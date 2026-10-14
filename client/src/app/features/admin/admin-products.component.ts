import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product.model';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingComponent],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  searchTerm = '';
  toastMessage = signal<string | null>(null);

  get filteredProducts(): Product[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.title.toLowerCase().includes(term) ||
      (p.category_name && p.category_name.toLowerCase().includes(term)) ||
      p.product_id.toString().includes(term)
    );
  }

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: res => {
        this.products.set(res.data || []);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Admin: failed to fetch products:', err);
        this.isLoading.set(false);
      }
    });
  }

  deleteProduct(product: Product): void {
    const ok = confirm(`Are you sure you want to delete Product #${product.product_id}: "${product.title}"?`);
    if (!ok) return;

    this.productService.deleteProduct(product.product_id).subscribe({
      next: () => {
        this.products.set(this.products().filter(p => p.product_id !== product.product_id));
        this.toastMessage.set(`Product #${product.product_id} deleted successfully.`);
        setTimeout(() => this.toastMessage.set(null), 3000);
      },
      error: err => {
        alert('Failed to delete: ' + err.message);
      }
    });
  }
}
