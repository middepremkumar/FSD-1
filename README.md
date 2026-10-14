# 🛍️ Amazon Store & Full Stack Development Lab Suite (FSD-1)

A complete full-stack e-commerce web application integrating an **Angular 19 + TypeScript Frontend** (`client/`), **Node.js + Express 5 Backend REST API** (`server/`), and a **MySQL Database** (`database/`) with connection pooling and automated in-memory mock fallback resiliency.

The project fulfills academic requirements for **Unit 4: Node.js & Express.js** and **Unit 5: MySQL Database** alongside an Amazon-style shopping application.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Directory Structure](#-directory-structure)
- [Windows CMD Startup Instructions](#-windows-cmd-startup-instructions)
- [Angular 19 Frontend Features & Routes](#-angular-19-frontend-features--routes)
- [Backend REST API Reference](#-backend-rest-api-reference)
- [Database Schema & Lab Scripts](#-database-schema--lab-scripts)
- [Unit 4 & Unit 5 Academic Lab Matrix](#-unit-4--unit-5-academic-lab-matrix)
- [Automated Verification Suite](#-automated-verification-suite)

---

## 🌐 System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Port 4200)                 │
│              Angular 19 + TypeScript Single Page App        │
│    (Navbar, Home, Products, Details, Cart, Checkout, Admin) │
└──────────────────────────────┬──────────────────────────────┘
                               │
            Angular Proxy (/api, /lab) forwards to Port 5000
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    SERVER LAYER (Port 5000)                 │
│                 Node.js + Express 5 REST API                │
│       - Products, Orders, Categories, Health, Stats         │
│       - Standalone Unit 4 Endpoints (/lab/4a - /lab/4e)     │
│       - Production SPA Static Server (/app & fallback)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (Port 3306)                │
│              MySQL 8.0 Database (amazon_fsd_db)             │
│        (Categories, Products, Orders, Order Items)          │
│                              │                              │
│              * If MySQL is offline, automatically *         │
│              * falls back to in-memory mock dataset *       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```text
FSD-1/
├── client/                               # Angular 19 Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── services/             # Injectable services
│   │   │   │       ├── api.service.ts
│   │   │   │       ├── product.service.ts
│   │   │   │       ├── category.service.ts
│   │   │   │       ├── cart.service.ts
│   │   │   │       ├── order.service.ts
│   │   │   │       └── stats.service.ts
│   │   │   ├── models/                   # TypeScript interfaces
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── category.model.ts
│   │   │   │   ├── cart.model.ts
│   │   │   │   ├── order.model.ts
│   │   │   │   └── api-response.model.ts
│   │   │   ├── shared/                   # Reusable components
│   │   │   │   ├── navbar/
│   │   │   │   ├── footer/
│   │   │   │   ├── product-card/
│   │   │   │   └── loading/
│   │   │   ├── features/                 # Standalone route pages
│   │   │   │   ├── home/                 # Amazon landing page & deals
│   │   │   │   ├── products/             # Product catalog & search/filter
│   │   │   │   ├── product-details/      # Product view & buybox
│   │   │   │   ├── cart/                 # Shopping cart manager
│   │   │   │   ├── checkout/             # Order checkout & address
│   │   │   │   ├── orders/               # Placed order history & tracking
│   │   │   │   ├── admin/                # Admin product CRUD & form
│   │   │   │   ├── lab/                  # Academic lab portal (Unit 4 & 5)
│   │   │   │   ├── access-denied/        # 403 route
│   │   │   │   └── not-found/            # 404 route
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── proxy.conf.json               # Development proxy forwarding to 5000
│   │   ├── styles.css                    # Amazon global design system
│   │   └── index.html
│   ├── angular.json
│   └── package.json
├── server/                               # Node.js + Express backend
│   ├── index.js                          # Express app, lab routes & SPA serving
│   └── routes/
│       └── api.js                        # Full REST API endpoints
├── database/                             # Database integration & Unit 5 SQL
│   ├── db.js                             # mysql2 pool & resilient in-memory fallback
│   ├── database.sql                      # Schema DDL (Categories, Products, Orders)
│   ├── initDb.js                         # Automated table creation and seeding
│   ├── 5a_create_db_cli.sql              # Lab 5.a: CLI create database & table
│   ├── 5b_crud_queries.sql               # Lab 5.b: CRUD query demonstrations
│   ├── 5c_subqueries.sql                 # Lab 5.c: Subqueries (Scalar, IN, EXISTS)
│   ├── 5d_workbench_script.sql           # Lab 5.d: Views, Procedures, Transactions
│   └── README_MYSQL.md
├── exercises/
│   └── unit4/                            # Standalone Unit 4 lab scripts
│       ├── 4a_hello_world_route.js
│       ├── 4b_multi_route_website.js
│       ├── 4c_hello_world_console.js
│       ├── 4d_crud_express.js
│       └── 4e_express_mysql.js
├── src_react_reference/                  # Preserved React reference codebase
├── thunder-tests/                        # Thunder Client REST test suite
├── postman_collection.json               # Postman collection
├── verify.js                             # Full-stack automated verification test
├── package.json                          # Root npm scripts and dependencies
└── README_LAB.md                         # Unit 4 & 5 lab manual
```

---

## 💻 Windows CMD Startup Instructions

Open **Command Prompt (cmd.exe)** in `c:\Users\DELL\.gemini\antigravity-ide\scratch\FSD-1`.

### 1. Install Dependencies
```cmd
npm install
cd client && npm install && cd ..
```

### 2. Start the Express API Backend Server (Port 5000)
```cmd
npm run server
```
*Console output:*
```text
🛍️ [Amazon Store] Server running at: http://localhost:5000
```

### 3. Start the Angular Development Server (Port 4200)
In a new Command Prompt window:
```cmd
npm run dev:angular
```
*(Or navigate to `client` and run `npm start`)*
- Open [http://localhost:4200](http://localhost:4200) in your browser.
- All `/api/*` and `/lab/*` requests automatically proxy to the Express server on port 5000.

### 4. Build the Angular Application for Production
```cmd
npm run build
```
Builds the optimized Angular production bundle into `client/dist/client/browser`. Express automatically hosts this bundle at:
- [http://localhost:5000/app](http://localhost:5000/app)

### 5. Run the Full Automated Verification Test Suite
```cmd
npm run verify
```
Checks backend health, database connection/fallback, all Unit 4 lab routes, production app routing, and dev proxy.

### 6. (Optional) Initialize Real MySQL Database
When local MySQL service (e.g., XAMPP, MySQL Server) is running on port 3306:
```cmd
npm run db:init
```
Executes [`database/database.sql`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/database/database.sql) to create tables and seed 8 products, 6 categories, and 3 customer orders.

---

## 🚀 Angular 19 Frontend Features & Routes

| Route | View Component | Description |
| :--- | :--- | :--- |
| `/` | `HomeComponent` | Amazon-style hero carousel, live metrics ribbon, categories, and today's blockbuster deals |
| `/products` | `ProductsComponent` | Product catalog with category filter tabs, sorting (price, rating), and stock indicators |
| `/products/:id` | `ProductDetailsComponent` | Product display, star ratings, specifications table, quantity picker, Add to Cart, Buy Now |
| `/search?q=...` | `ProductsComponent` | Filtered search results matching keyword across titles and categories |
| `/category/:category` | `ProductsComponent` | Category-scoped products (e.g. `/category/mobiles`, `/category/laptops`) |
| `/cart` | `CartComponent` | Shopping cart items, quantity stepper, free delivery progress meter, and order subtotal |
| `/checkout` | `CheckoutComponent` | Multi-step shipping address, payment selection, and duplicate-prevented order placement |
| `/orders` | `OrdersComponent` | Customer order history, shipping details, and live status pipeline simulator |
| `/admin/products` | `AdminProductsComponent` | Inventory management table with search, stock counters, edit, and deletion |
| `/admin/products/new` | `ProductFormComponent` | Form to create and add new products with live preview |
| `/admin/products/edit/:id`| `ProductFormComponent` | Form to edit existing products |
| `/lab` | `LabComponent` | Academic lab suite hub for Unit 4 and Unit 5 experiments with live endpoints & subquery evaluator |
| `/lab/:exp` | `LabComponent` | Direct link to specific lab exercise (e.g. `/lab/4a`, `/lab/4b`) |
| `/access-denied` | `AccessDeniedComponent` | 403 Unauthorized state |
| `**` | `NotFoundComponent` | 404 Not Found page |

---

## ⚡ Backend REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status and MySQL / in-memory fallback connection health |
| `GET` | `/api/stats` | Aggregated store metrics: product counts, order volumes, revenue |
| `GET` | `/api/categories` | List all product categories |
| `GET` | `/api/products` | Query products (supports `?category=...&search=...&sort=...`) |
| `GET` | `/api/products/:id` | Retrieve single product by ID |
| `POST` | `/api/products` | Add new product to catalog |
| `PUT` | `/api/products/:id` | Update existing product details |
| `DELETE` | `/api/products/:id` | Remove product from catalog |
| `GET` | `/api/orders` | Retrieve list of placed customer orders |
| `POST` | `/api/orders` | Place new order with order items and stock deduction |
| `PATCH` | `/api/orders/:id/status`| Update status of an existing order |
| `GET` | `/api/subqueries` | Evaluates Scalar, IN, and EXISTS MySQL subqueries |
| `GET` | `/api/hello` | Unit 4.a Hello World greeting route |

---

## 🧪 Unit 4 & Unit 5 Academic Lab Matrix

### Unit 4: Node.js and Express.js
- **4.a**: Hello World route ([`exercises/unit4/4a_hello_world_route.js`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/exercises/unit4/4a_hello_world_route.js) | `npm run 4a` | [http://localhost:5000/lab/4a](http://localhost:5000/lab/4a))
- **4.b**: Multi-route website ([`exercises/unit4/4b_multi_route_website.js`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/exercises/unit4/4b_multi_route_website.js) | `npm run 4b` | [http://localhost:5000/lab/4b](http://localhost:5000/lab/4b))
- **4.c**: Print in browser console ([`exercises/unit4/4c_hello_world_console.js`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/exercises/unit4/4c_hello_world_console.js) | `npm run 4c` | [http://localhost:5000/lab/4c](http://localhost:5000/lab/4c))
- **4.d**: CRUD operations in Express ([`exercises/unit4/4d_crud_express.js`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/exercises/unit4/4d_crud_express.js) | `npm run 4d` | [http://localhost:5000/lab/4d](http://localhost:5000/lab/4d))
- **4.e**: MySQL driver connection ([`exercises/unit4/4e_express_mysql.js`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/exercises/unit4/4e_express_mysql.js) | `npm run 4e` | [http://localhost:5000/lab/4e](http://localhost:5000/lab/4e))

### Unit 5: MySQL Database
- **5.a**: Create database & tables CLI ([`database/5a_create_db_cli.sql`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/database/5a_create_db_cli.sql))
- **5.b**: CRUD SQL queries ([`database/5b_crud_queries.sql`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/database/5b_crud_queries.sql))
- **5.c**: Subqueries in CLI ([`database/5c_subqueries.sql`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/database/5c_subqueries.sql))
- **5.d**: MySQL Workbench scripts & Stored Procedures ([`database/5d_workbench_script.sql`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/database/5d_workbench_script.sql))
- **5.e**: Database directory & API integration ([`database/database.sql`](file:///c:/Users/DELL/.gemini/antigravity-ide/scratch/FSD-1/database/database.sql))
