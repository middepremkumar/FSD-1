import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  cartService = inject(CartService);
  addedToast = signal<string | null>(null);

  get discountPercent(): number {
    if (this.product.original_price && this.product.original_price > this.product.price) {
      return Math.round(((this.product.original_price - this.product.price) / this.product.original_price) * 100);
    }
    return 0;
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const result = this.cartService.addToCart(this.product, 1);
    const msg = result.isNew
      ? `Added to Cart`
      : `Cart updated (Qty: ${result.currentQuantity})`;

    this.addedToast.set(msg);
    setTimeout(() => this.addedToast.set(null), 2500);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
  }
}
