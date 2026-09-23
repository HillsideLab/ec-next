# ec-next 🛒

A modern, robust full-stack e-commerce platform built with **Next.js 16 (App Router)** and **React 19**.

The platform is designed with real-world cross-border e-commerce between **Europe and Japan** in mind, with a strong focus on **performance, security, and user experience (UX)**.

🚀 **Live Demo:** [ec-next-one.vercel.app](https://ec-next-one.vercel.app)

🔑 **Demo Account:**

- **Email:** `demo@example.com`
- **Password:** `EcNextDemo2026!`

> After signing in, you can experience the complete shopping flow, from browsing products and adding items to the cart to checkout and order placement.

---

## 🛠️ Tech Stack

### Frontend / Backend

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19 / TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Base UI)
- **Theme:** next-themes (Light / Dark mode)

### Database / Authentication / Security

- **Database / ORM:** PostgreSQL (Neon) / Prisma ORM
- **Authentication:** better-auth with Edge Middleware-based session verification
- **Password Hashing:** bcrypt-ts-edge
- **Forms & Validation:** React Hook Form × Zod

### Infrastructure / CI/CD

- **Hosting:** Vercel

---

## ✨ Key Features

- 🔐 **Secure Authentication:** Cookie-based session management with `better-auth`, combined with Edge Middleware for automatic redirection and route protection.
- 🛒 **High-performance Cart System:** Asynchronous UI updates using `useTransition`, with session persistence and accurate subtotal calculations.
- 📝 **Robust Form Validation:** `React Hook Form` and `Zod` are used together for consistent validation on both the client side and inside `Server Actions`.
- 📦 **Checkout Progress:** A step-based checkout UI clearly guides users through the purchasing process: **Shipping Address → Payment Method → Order Review**.

---

## 🏗️ Architecture & Design Decisions

### 1. Dual-layer Validation with Server Actions & Zod

All user-submitted data, including shipping addresses and payment-related information, is validated using shared Zod schemas on both the client and server.

Client-side validation provides immediate feedback, while server-side validation inside `Server Actions` ensures that incoming requests are validated independently before being processed.

This approach helps maintain data integrity and prevents invalid or malicious input from reaching the database.

### 2. Low-latency Route Protection with Edge Middleware

Access to private areas such as the checkout and order history is protected at the **Next.js Edge Middleware** layer.

Authentication checks are performed before requests reach protected pages, reducing unnecessary server-side processing while providing a fast and secure user experience.

---

## 📅 Roadmap

- [ ] 💳 **Payment Gateway Integration:** Implement real payment processing using Stripe and PayPal.
- [ ] 🌍 **Cross-border E-commerce Optimization:** Add multilingual and multi-currency support, automated international shipping cost calculation, and support for country-specific customs, duties, and tax rules.
- [ ] 📊 **Admin Dashboard:** Build product and inventory management, sales analytics, and order status management.
- [ ] 👤 **Enhanced User Profiles:** Add detailed order history and shipping address management.
