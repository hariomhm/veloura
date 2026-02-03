import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { CheckoutSession } from "../models/CheckoutSession.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { AppError } from "../utils/errors.js";

export const finalizeCheckout = async ({
  checkoutId,
  userId,
  payment,
  shipping,
}) => {
  const session = await mongoose.startSession();
  let createdOrder = null;

  try {
    await session.withTransaction(async () => {
      const checkout = await CheckoutSession.findOne({
        _id: checkoutId,
        userId,
        status: "pending",
      }).session(session);

      if (!checkout) {
        throw new AppError(404, "Checkout session not found");
      }

      if (checkout.expiresAt < new Date()) {
        throw new AppError(400, "Checkout session expired");
      }

      const bulkOps = checkout.items.map((item) => ({
        updateOne: {
          filter: {
            _id: item.productId,
            isActive: true,
            stock: { $gte: item.quantity },
          },
          update: { $inc: { stock: -item.quantity } },
        },
      }));

      const bulkResult = await Product.bulkWrite(bulkOps, { session });
      if (bulkResult.modifiedCount !== checkout.items.length) {
        throw new AppError(400, "Insufficient stock for one or more items");
      }

      if (checkout.couponCode) {
        const coupon = await Coupon.findOne({
          code: checkout.couponCode,
          active: true,
        }).session(session);
        if (!coupon) throw new AppError(400, "Coupon no longer valid");
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          throw new AppError(400, "Coupon usage limit reached");
        }
        const userUsage = Number(coupon.usageByUser?.get(userId) || 0);
        if (coupon.perUserLimit && userUsage >= coupon.perUserLimit) {
          throw new AppError(400, "Coupon limit reached for this user");
        }
        await Coupon.updateOne(
          { _id: coupon._id },
          {
            $inc: {
              usageCount: 1,
              [`usageByUser.${userId}`]: 1,
            },
          },
          { session }
        );
      }

      const orderNumber = nanoid(10).toUpperCase();
      const [order] = await Order.create(
        [
          {
            userId,
            orderNumber,
            items: checkout.items,
            subtotal: checkout.subtotal,
            discountTotal: checkout.discountTotal,
            totalPrice: checkout.total,
            currency: checkout.currency,
            couponCode: checkout.couponCode || "",
            status: payment?.status === "paid" ? "paid" : "pending",
            paymentStatus: payment?.status || "pending",
            paymentId: payment?.paymentId || "",
            orderId: payment?.orderId || "",
            paymentProvider: payment?.provider || "razorpay",
            customerName: shipping?.name || "",
            customerPhone: shipping?.phone || "",
            addressLine: shipping?.addressLine || "",
            city: shipping?.city || "",
            state: shipping?.state || "",
            pincode: shipping?.pincode || "",
          },
        ],
        { session }
      );

      await CheckoutSession.findByIdAndUpdate(
        checkout._id,
        { status: "completed", orderId: order._id.toString() },
        { session }
      );

      createdOrder = order;
    });
  } finally {
    session.endSession();
  }

  return createdOrder;
};
