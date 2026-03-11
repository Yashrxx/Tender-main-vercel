# 🏗️ B2B Tender Management Platform - Architecture Overview

## 🔍 Overview

This is a minimal viable B2B tender-management platform that enables companies to:
- Register and manage their profiles
- Create and publish tenders
- Browse and apply to tenders
- Search for companies by name, industry, or services
- View full profiles of other companies

The app is structured as a **full-stack project** with a **Next.js frontend** and an **Express.js backend**, connected via REST APIs. PostgreSQL is used for the database, and Supabase handles file storage (company logos, etc.).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (TypeScript) |
| Backend | Express.js (TypeScript) |
| Database | PostgreSQL + Sequelize ORM |
| Storage | Supabase Storage (company logos, images) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🔐 Authentication Flow

- User signs up or logs in using **email + password**
- Backend verifies credentials and issues a **JWT token**
- Token is stored in frontend (`localStorage`) and sent with each request in the `Authorization: Bearer <token>` header
- Protected routes (e.g., `/tenders`, `/company/update`) use middleware (`fetchUser`) to verify the JWT and extract `req.user`

---

## 🗃️ Database Schema (Core Tables)

- `users`: stores credentials for login
- `companies`: stores metadata like name, description, industry, logo, etc.
- `tenders`: each tender belongs to a company
- `applications`: proposal submitted by one company to another's tender

> All models are created via Sequelize migrations and associated using foreign keys.

### ➕ Relationships

- A **User** owns a **Company**
- A **Company** has many **Tenders**
- A **Tender** has many **Applications**
- An **Application** belongs to a **Tender** and is submitted by another **Company**

---

## 🌐 API Routes Overview

### ✅ Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### 🏢 Company
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/company/profile` | Get current user's company profile |
| POST | `/api/company/profile` | Create company profile |
| PUT | `/api/company/profile` | Update company profile |
| GET | `/api/company/:id` | Get public company details |
| GET | `/api/companies/search` | Search companies by name/industry/product |

### 📄 Tender
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/tenders` | Create a new tender |
| GET | `/api/tenders` | List all tenders |
| GET | `/api/tenders/mine` | List logged-in company's tenders |
| PUT | `/api/tenders/:id` | Update tender |
| DELETE | `/api/tenders/:id` | Delete tender |

### 📬 Application
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/applications` | Apply to a tender |
| GET | `/api/applications/:tenderId` | View all applications to a tender |

---

## 🖼️ Image Uploads (Supabase)

- Company logos and images are uploaded via a multipart/form-data request
- Backend middleware handles upload to **Supabase Storage**
- Public URL is returned and saved in the `companies` table
- URL is rendered on the frontend to display the logo

---

## 📁 Folder Structure