import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  get freeDeliveryPercent(): number {
    const sub = this.cartService.subtotal();
    return Math.min(100, Math.round((sub / 499) * 100));
  }

  updateQty(productId: number, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearAll(): void {
    if (confirm('Are you sure you want to empty your Amazon cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    if (this.cartService.count() > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}
