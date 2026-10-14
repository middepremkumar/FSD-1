import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Amazon.in: Great Deals on Electronics, Laptops, Mobiles'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Amazon Catalog: Products & Deals'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/product-details/product-details.component').then(m => m.ProductDetailsComponent),
    title: 'Amazon Product Details'
  },
  {
    path: 'search',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Amazon Search Results'
  },
  {
    path: 'category/:category',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Amazon Category'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Amazon Shopping Cart'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Amazon Secure Checkout'
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
    title: 'Your Amazon Orders'
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./features/admin/admin-products.component').then(m => m.AdminProductsComponent),
    title: 'Admin: Product Catalog'
  },
  {
    path: 'admin/products/new',
    loadComponent: () => import('./features/admin/product-form.component').then(m => m.ProductFormComponent),
    title: 'Admin: Add New Product'
  },
  {
    path: 'admin/products/edit/:id',
    loadComponent: () => import('./features/admin/product-form.component').then(m => m.ProductFormComponent),
    title: 'Admin: Edit Product'
  },
  {
    path: 'lab',
    loadComponent: () => import('./features/lab/lab.component').then(m => m.LabComponent),
    title: 'Developer Portal'
  },
  {
    path: 'lab/:exp',
    loadComponent: () => import('./features/lab/lab.component').then(m => m.LabComponent),
    title: 'Developer Console'
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./features/access-denied/access-denied.component').then(m => m.AccessDeniedComponent),
    title: '403: Access Denied'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404: Page Not Found'
  }
];
