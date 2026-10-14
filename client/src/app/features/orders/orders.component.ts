import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../models/order.model';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);
  actionToast = signal<string | null>(null);

  getStatusStep(status: string): number {
    switch (status) {
      case 'Placed': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.orderService.getOrders().subscribe({
      next: res => {
        this.orders.set(res.data || []);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Orders: failed to fetch:', err);
        this.orders.set([]);
        this.isLoading.set(false);
      }
    });
  }

  advanceStatus(order: Order): void {
    const sequence = ['Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = sequence.indexOf(order.order_status);
    const nextStatus = currentIndex >= 0 && currentIndex < sequence.length - 1
      ? sequence[currentIndex + 1]
      : 'Delivered';

    this.orderService.updateOrderStatus(order.order_id, nextStatus).subscribe({
      next: () => {
        order.order_status = nextStatus;
        this.actionToast.set(`Order #${order.order_id} status updated to '${nextStatus}'`);
        setTimeout(() => this.actionToast.set(null), 3000);
      },
      error: err => {
        alert('Failed to update status: ' + err.message);
      }
    });
  }
}
