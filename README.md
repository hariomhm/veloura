# 🛒 Appwrite E‑commerce Backend

This repository contains the **Appwrite database schema** and backend structure for an e‑commerce application. It covers **users, products, orders, and newsletter subscriptions**, designed to be production‑ready and scalable.

---

## 🧱 Tech Stack

* **Backend**: Appwrite
* **Database**: Appwrite Databases
* **Authentication**: Appwrite Auth
* **Storage**: Appwrite Storage (product images, invoices, avatars)
* **Frontend (assumed)**: React

---

## 📦 Collections Overview

| Collection               | Description                              |
| ------------------------ | ---------------------------------------- |
| `users`                  | User profiles, roles, and account status |
| `products`               | Product catalog and attributes           |
| `orders`                 | Order lifecycle, payment & shipping      |
| `wishlist`               | User wishlists and saved products        |
| `newsletter_subscribers` | Newsletter subscription & verification   |

---

## 👤 Users Collection (`users`)

Stores all registered users and account metadata.

### Fields

| Field                  | Type     | Required | Description           |
| ---------------------- | -------- | -------- | --------------------- |
| `$id`                  | string   | ✅        | Document ID           |
| `userid`               | string   | ✅        | Appwrite Auth User ID |
| `name`                 | string   | ✅        | Full name             |
| `email`                | string   | ✅        | Email address         |
| `phone`                | string   | ✅        | Phone number          |
| `avatar`               | string   | ❌        | Profile image URL     |
| `role`                 | enum     | ❌        | `user`, `admin`       |
| `isActive`             | boolean  | ❌        | Account active status |
| `isBanned`             | boolean  | ❌        | User banned flag      |
| `banReason`            | string   | ❌        | Reason for ban        |
| `address[]`            | string   | ❌        | Saved addresses       |
| `wishlist[]`           | string   | ❌        | Product IDs           |
| `city`           | string   | ❌        | user city          |
| `state`           | string   | ❌        | user state          |
| `pincode`           | string   | ❌        | user pincode          |
| `totalOrders`          | integer  | ❌        | Total orders placed   |
| `totalSpent`           | double   | ❌        | Total amount spent    |
| `emailVerified`        | boolean  | ❌        | Email verification    |
| `phoneVerified`        | boolean  | ❌        | Phone verification    |
| `newsletterSubscribed` | boolean  | ❌        | Newsletter opt‑in     |
| `lastLoginAt`          | datetime | ❌        | Last login timestamp  |
| `createdAt`            | datetime | ✅        | Created at            |
| `updatedAt`            | datetime | ❌        | Updated at            |

---

## 🛍 Products Collection (`products`)

Stores product catalog data.

### Fields

| Field             | Type     | Required | Description              |
| ----------------- | -------- | -------- | ------------------------ |
| `$id`             | string   | ✅        | Document ID              |
| `name`            | string   | ✅        | Product name             |
| `slug`            | string   | ✅        | SEO slug                 |
| `description`     | string   | ❌        | Description              |
| `category`        | string   | ✅        | Category                 |
| `productType`     | string   | ✅        | Shirt, Kurta, Suit, etc. |
| `gender`          | string   | ✅        | Men / Women / Kids / Unisex |
| `mrp`             | double   | ✅        | Maximum retail price     |
| `discountPercent`        | double   | ❌        | Discount value in percent          |
| `sellingPrice`    | integer  | ❌        | Final price              |
| `imageUrl[]`      | string   | ❌        | Product images           |
| `sizes[]`         | string   | ❌        | Available sizes          |
| `color`           | string   | ❌        | Color                    |
| `material`        | string   | ❌        | Fabric                   |
| `pattern`         | string   | ❌        | Pattern                  |
| `neckType`        | string   | ❌        | Neck style               |
| `sleeveLength`    | string   | ❌        | Sleeve length            |
| `washCare`        | string   | ❌        | Care instructions        |
| `countryOfOrigin` | string   | ❌        | Origin country           |
| `rating`          | integer  | ❌        | Average rating           |
| `reviewCount`     | integer  | ❌        | Total reviews            |
| `isFeatured`      | boolean  | ❌        | Featured product         |
| `isActive`        | boolean  | ❌        | Visibility status        |
| `stock`           | integer  | ❌        | Stock quantity           |
| `createdAt`       | datetime | ✅        | Created at               |
| `updatedAt`       | datetime | ❌        | Updated at               |

---

## 📦 Orders Collection (`orders`)

Handles order processing, payments, and delivery tracking.

### Fields

| Field               | Type     | Required | Description                               |
| ------------------- | -------- | -------- | ----------------------------------------- |
| `$id`               | string   | ✅        | Document ID                               |
| `userid`            | string   | ✅        | User ID                                   |
| `orderNumber`       | string   | ✅        | Unique order number                       |
| `status`            | enum     | ✅        | pending / shipped / delivered / cancelled |
| `paymentStatus`     | enum     | ✅        | pending / paid / failed / refunded        |
| `paymentMethod`     | enum     | ✅        | COD / Razorpay / Stripe                   |
| `items[]`           | string   | ❌        | Ordered items (stringified JSON)          |
| `subtotal`          | double   | ❌        | Subtotal amount                           |
| `discountTotal`          | double   | ❌        | Discount                                  |
| `shippingCharge`          | double   | ❌        | Shipping charge                           |
| `taxAmount`               | double   | ❌        | Tax                                       |
| `totalAmount`       | double   | ❌        | Final payable amount                      |
| `shippingAddress[]` | string   | ❌        | Shipping address                          |
| `trackingId`        | string   | ❌        | Tracking number                           |
| `courier`           | string   | ❌        | Courier partner                           |
| `estimatedDelivery` | datetime | ❌        | Estimated delivery                        |
| `deliveredAt`       | datetime | ❌        | Delivered at                              |
| `cancelReason`      | string   | ❌        | Cancellation reason                       |
| `returnReason`      | string   | ❌        | Return reason                             |
| `refundAmount`      | double   | ❌        | Refund value                              |
| `refundStatus`      | enum     | ❌        | pending / processed                       |
| `invoiceUrl`        | string   | ❌        | Invoice PDF                               |
| `notes`             | string   | ❌        | Admin notes                               |
| `source`            | string   | ❌        | Web / App                                 |
| `createdAt`         | datetime | ✅        | Created at                                |
| `updatedAt`         | datetime | ❌        | Updated at                                |

---

## ❤️ Wishlist Collection (`wishlist`)

Stores user saved products for wishlists.

### Fields

| Field      | Type     | Required | Description     |
| ---------- | -------- | -------- | --------------- |
| `$id`      | string   | ✅        | Document ID     |
| `userId`   | string   | ✅        | User ID         |
| `productId`| string   | ✅        | Product ID      |
| `createdAt`| datetime | ✅        | Created at      |

---

## 📩 Newsletter Subscribers (`newsletter_subscribers`)

Manages newsletter subscriptions with email verification.

### Fields

| Field               | Type     | Required | Description         |
| ------------------- | -------- | -------- | ------------------- |
| `$id`               | string   | ✅        | Document ID         |
| `email`             | string   | ✅        | Subscriber email    |
| `isActive`          | boolean  | ❌        | Subscription status |
| `isVerified`        | boolean  | ❌        | Email verified      |
| `verificationToken` | string   | ✅        | Verification token  |
| `unsubToken`        | string   | ✅        | Unsubscribe token   |
| `source`            | string   | ❌        | Signup source       |
| `verifiedAt`        | datetime | ❌        | Verified at         |
| `createdAt`         | datetime | ✅        | Created at          |
| `updatedAt`         | datetime | ❌        | Updated at          |

---

## 🔐 Permissions (Recommended)

* **Users**: Read (self, admin) · Write (admin)
* **Products**: Read (public) · Write (admin)
* **Orders**: Read (owner, admin) · Write (user create, admin update)
* **Wishlist**: Read (owner, admin) · Write (user create, admin)
* **Newsletter**: Create (public) · Read/Update/Delete (admin)

---

## ⚠️ Notes

* Appwrite does not support nested objects → complex data is stored as **stringified JSON**.
* Arrays like `items[]`, `sizes[]`, `imageUrl[]` are stored as **string arrays**.
* Index frequently queried fields such as `email`, `slug`, `userid`, and `orderNumber`.

---

## 🚀 Ready for Production

This schema is suitable for:

* Full e‑commerce storefronts
* Admin dashboards
* Order & payment tracking
* Newsletter marketing flows

---

**Author:** Hariom Mahawar
