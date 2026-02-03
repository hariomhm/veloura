import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { AppError } from "../utils/errors.js";

export const calculateSellingPrice = (mrp, discountPercent) => {
  if (!mrp) return 0;
  if (!discountPercent || discountPercent <= 0) return mrp;
  return Math.round((mrp - (mrp * discountPercent) / 100) * 100) / 100;
};

const aggregateItems = (items) => {
  const map = new Map();
  for (const item of items) {
    const key = `${item.productId}::${item.size || ""}`;
    const existing = map.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(key, { ...item });
    }
  }
  return Array.from(map.values());
};

export const normalizeCartItems = async (items) => {
  const aggregated = aggregateItems(items);
  const ids = aggregated.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const normalized = [];
  let subtotal = 0;

  for (const item of aggregated) {
    const product = byId.get(String(item.productId));
    if (!product) {
      throw new AppError(400, `Product not found or inactive: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new AppError(400, `Insufficient stock for ${product.name}`);
    }
    const price = calculateSellingPrice(product.mrp, product.discountPercent);
    subtotal += price * item.quantity;
    normalized.push({
      productId: String(product._id),
      name: product.name,
      image: Array.isArray(product.imageUrl) ? product.imageUrl[0] || "" : "",
      size: item.size || null,
      mrp: product.mrp,
      discountPercent: product.discountPercent || 0,
      price,
      sellingPrice: price,
      quantity: item.quantity,
    });
  }

  return { items: normalized, subtotal };
};

export const validateCoupon = async (couponCode, subtotal, userId) => {
  if (!couponCode) return { coupon: null, discountTotal: 0 };
  const code = String(couponCode).trim().toUpperCase();
  const coupon = await Coupon.findOne({ code });
  if (!coupon || !coupon.active) {
    throw new AppError(400, "Invalid coupon code");
  }

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) {
    throw new AppError(400, "Coupon not active yet");
  }
  if (coupon.endsAt && now > coupon.endsAt) {
    throw new AppError(400, "Coupon has expired");
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new AppError(400, "Coupon usage limit reached");
  }
  const userUsage = Number(coupon.usageByUser?.get(userId) || 0);
  if (coupon.perUserLimit && userUsage >= coupon.perUserLimit) {
    throw new AppError(400, "Coupon limit reached for this user");
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new AppError(400, "Order total below coupon minimum");
  }

  let discountTotal = 0;
  if (coupon.type === "percentage") {
    discountTotal = Math.round((subtotal * coupon.value) / 100 * 100) / 100;
  } else {
    discountTotal = coupon.value;
  }

  if (coupon.maxDiscount && discountTotal > coupon.maxDiscount) {
    discountTotal = coupon.maxDiscount;
  }
  if (discountTotal > subtotal) discountTotal = subtotal;

  return { coupon, discountTotal };
};
