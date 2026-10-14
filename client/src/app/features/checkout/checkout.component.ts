import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CreateOrderPayload, OrderCreationResponse } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  private router = inject(Router);

  // Form Fields
  customerName = '';
  customerEmail = '';
  streetAddress = '';
  city = 'Bangalore';
  pincode = '560001';
  paymentMethod = 'Cash on Delivery';

  errorMessage = signal<string | null>(null);
  orderConfirmation = signal<OrderCreationResponse | null>(null);

  ngOnInit(): void {
    if (this.cartService.count() === 0 && !this.orderConfirmation()) {
      // Empty cart redirect
      this.router.navigate(['/cart']);
    }
  }

  onPlaceOrder(): void {
    this.errorMessage.set(null);

    if (!this.customerName.trim()) {
      this.errorMessage.set('Please enter your full name for shipping.');
      return;
    }

    if (!this.customerEmail.trim() || !this.customerEmail.includes('@')) {
      this.errorMessage.set('Please enter a valid email address for delivery updates.');
      return;
    }

    if (!this.streetAddress.trim()) {
      this.errorMessage.set('Please enter your street address.');
      return;
    }

    const items = this.cartService.items().map(i => ({
      product_id: i.product.product_id,
      title: i.product.title,
      quantity: i.quantity,
      price: i.product.price
    }));

    const fullAddress = `${this.streetAddress.trim()}, ${this.city.trim()} - ${this.pincode.trim()}, India`;

    const payload: CreateOrderPayload = {
      customer_name: this.customerName.trim(),
      customer_email: this.customerEmail.trim(),
      shipping_address: fullAddress,
      payment_method: this.paymentMethod,
      items
    };

    this.orderService.submitOrder(payload).subscribe({
      next: res => {
        this.orderConfirmation.set(res);
        this.cartService.clearCart();
      },
      error: err => {
        this.errorMessage.set(err.message || 'Failed to place order. Please try again.');
      }
    });
  }
}
