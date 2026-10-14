import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartItem, CartSummary } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'amazon_fsd_cart';

  // Signals for state
  readonly items = signal<CartItem[]>(this.loadInitialCart());

  // Computed signals
  readonly count = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  });

  readonly deliveryFee = computed(() => {
    const sub = this.subtotal();
    return sub > 499 || sub === 0 ? 0 : 40;
  });

  readonly tax = computed(() => {
    // 18% standard GST
    return Math.round(this.subtotal() * 0.18);
  });

  readonly total = computed(() => {
    return this.subtotal() + this.deliveryFee() + this.tax();
  });

  readonly summary = computed<CartSummary>(() => ({
    itemsCount: this.count(),
    subtotal: this.subtotal(),
    deliveryFee: this.deliveryFee(),
    tax: this.tax(),
    total: this.total()
  }));

  constructor() {}

  private loadInitialCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
    }
    return [];
  }

  private persist(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart in localStorage:', e);
    }
  }

  /**
   * Adds product to cart.
   * If already present, increments quantity up to stock limit to prevent duplicate distinct entries.
   * Returns true if newly added, false if quantity was incremented.
   */
  addToCart(product: Product, quantity = 1): { isNew: boolean; currentQuantity: number } {
    const current = this.items();
    const existingIndex = current.findIndex(i => i.product.product_id === product.product_id);

    if (existingIndex > -1) {
      const existing = current[existingIndex];
      const maxStock = product.stock_quantity ?? 99;
      const newQty = Math.min(existing.quantity + quantity, maxStock);
      
      const updated = [...current];
      updated[existingIndex] = {
        ...existing,
        product, // refresh product details
        quantity: newQty
      };
      this.items.set(updated);
      this.persist(updated);
      return { isNew: false, currentQuantity: newQty };
    } else {
      const newItem: CartItem = { product, quantity };
      const updated = [...current, newItem];
      this.items.set(updated);
      this.persist(updated);
      return { isNew: true, currentQuantity: quantity };
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const current = this.items();
    const updated = current.map(item => {
      if (item.product.product_id === productId) {
        const maxStock = item.product.stock_quantity ?? 99;
        return {
          ...item,
          quantity: Math.min(quantity, maxStock)
        };
      }
      return item;
    });

    this.items.set(updated);
    this.persist(updated);
  }

  removeFromCart(productId: number): void {
    const current = this.items();
    const updated = current.filter(i => i.product.product_id !== productId);
    this.items.set(updated);
    this.persist(updated);
  }

  clearCart(): void {
    this.items.set([]);
    this.persist([]);
  }

  isInCart(productId: number): boolean {
    return this.items().some(i => i.product.product_id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.items().find(i => i.product.product_id === productId);
    return item ? item.quantity : 0;
  }
}
