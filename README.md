# ec-next 🛒

A modern, full-stack e-commerce platform built with **Next.js 16**, **React 19**, and **TypeScript**.

The project focuses on a complete e-commerce experience, including product discovery, payment processing, authentication, and administration tools, with an emphasis on performance, maintainability, and user experience.

🚀 **Live Demo:** [ec-next-one.vercel.app](https://ec-next-one.vercel.app)

## 🔑 Demo Account

- **Email:** `demo@example.com`
- **Password:** `EcNextDemo2026!`

Explore the shopping experience and administrative features using the demo account, including product browsing, checkout, order management, and the admin dashboard.

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** – App Router and server-side rendering
- **React 19** – Component-based UI
- **TypeScript** – Static typing
- **Tailwind CSS v4** – Utility-first styling
- **shadcn/ui** – Reusable UI components built on Base UI
- **React Hook Form & Zod** – Form state management and validation

### Backend & Database

- **Next.js Server Actions** – Server-side application logic
- **Prisma ORM** – Database access and data modeling
- **Neon PostgreSQL** – Hosted relational database
- **better-auth** – Authentication and session management

### Payments & Email

- **Stripe** – Payment Intents and webhook-based payment updates
- **PayPal Checkout** – PayPal payment integration
- **Resend** – Transactional email delivery
- **React Email** – Email template development

### Infrastructure & Media

- **Vercel** – Application hosting and deployment
- **UploadThing** – Product image and banner uploads

## ✨ Key Features

### 🛍️ Product Discovery & Shopping

- Product catalog with search and sorting
- Category, price, and rating filters
- Recommended products and product carousels
- Product ratings and customer reviews
- Dynamic page metadata
- Deal countdown component
- Responsive, reusable UI components
- EUR-based price display

### 🛒 Cart & Checkout

- Persistent shopping cart
- Automatic subtotal calculation
- Shipping address and payment selection
- Order review before purchase
- Form validation using React Hook Form and Zod
- Loading states and asynchronous UI interactions

### 💳 Payment Processing

- Stripe Payment Intents integration
- Stripe webhook handling for payment status updates
- PayPal Checkout integration
- Payment result tracking in order records
- Server-side order payment status updates

### 📦 Order Management

- Order creation and order details
- Customer order history
- Shipping and payment information
- Payment status tracking
- Purchase receipt emails

### ⭐ Product Reviews

- Review submission with validated input
- Rating validation from 1 to 5
- Review listing and display
- Review update and reload functionality

### 🔐 Authentication & Authorization

- Sign-up and sign-in using better-auth
- Protected account, checkout, order, and administrative routes
- Server-side authorization checks for privileged operations
- Role-based access control for administrative features

### 📊 Admin Dashboard

- Sales overview and monthly sales chart
- Product creation, editing, and deletion
- Order management
- User management
- Product image and banner uploads
- Authorization checks for administrative operations

### 📧 Transactional Emails

- Purchase receipt emails using Resend
- Email templates built with React Email

## 🏗️ Architecture & Design Decisions

### Server-side Business Logic

Next.js Server Actions handle application operations, keeping database access and business logic on the server wherever appropriate.

### Form Validation

Zod schemas provide input validation and integrate with React Hook Form to manage form state and submissions.

### Authentication & Authorization

better-auth handles authentication and session management. Protected routes and server-side authorization checks help restrict access to account, order, checkout, and administrative functionality.

### Payment Processing

Stripe and PayPal provide separate payment flows. Stripe webhook handling updates order payment information based on payment events, reducing reliance on client-side payment status alone.

### Database Modeling

Prisma and PostgreSQL manage core e-commerce entities, including users, products, orders, order items, and reviews.

### Reusable UI Components

The application uses reusable components and shadcn/ui with Base UI to support a consistent, maintainable interface.

## 📌 Project Background

This project is a full-stack e-commerce application that integrates the core functionality required for an online store, from product discovery and checkout to payment processing, order management, and administrative operations.

The project also demonstrates the integration of frontend and backend functionality, relational database modeling, authentication and authorization, payment APIs, and transactional email services.

## 🗺️ Roadmap

- [ ] **Multi-currency Support** – Extend beyond EUR with consistent currency handling across product pricing, checkout, payment processing, and order records.
- [ ] **Internationalization (i18n)** – Add multilingual storefront support.
- [ ] **International Shipping** – Expand shipping options for cross-border orders.
- [ ] **Customs & Tax Handling** – Improve support for international tax and customs requirements.
- [ ] **Production Hardening** – Further strengthen payment reliability, authorization, error handling, monitoring, and operational security.

---

**Built with Next.js, TypeScript, Prisma, PostgreSQL, and modern web technologies.**
