import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingComponent, ProductCardComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  cartService = inject(CartService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  selectedQuantity = 1;
  addedToast = signal<string | null>(null);

  get discountPercent(): number {
    const p = this.product();
    if (p && p.original_price && p.original_price > p.price) {
      return Math.round(((p.original_price - p.price) / p.original_price) * 100);
    }
    return 0;
  }

  get savedAmount(): number {
    const p = this.product();
    if (p && p.original_price && p.original_price > p.price) {
      return p.original_price - p.price;
    }
    return 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.getProductById(id).subscribe({
      next: res => {
        if (res.data) {
          this.product.set(res.data);
          this.loadRelated(res.data.category_name, res.data.product_id);
        } else {
          this.errorMessage.set(`Product #${id} was not found.`);
        }
        this.isLoading.set(false);
      },
      error: err => {
        this.errorMessage.set(err.message || `Failed to load product details for #${id}.`);
        this.isLoading.set(false);
      }
    });
  }

  loadRelated(categoryName?: string, currentId?: number): void {
    if (!categoryName) return;
    this.productService.getProducts(categoryName).subscribe({
      next: res => {
        const list = (res.data || []).filter(p => p.product_id !== currentId);
        this.relatedProducts.set(list.slice(0, 4));
      }
    });
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;

    const result = this.cartService.addToCart(p, Number(this.selectedQuantity) || 1);
    const msg = result.isNew
      ? `Added ${this.selectedQuantity} item(s) to Cart`
      : `Cart updated: ${result.currentQuantity} in Cart`;

    this.addedToast.set(msg);
    setTimeout(() => this.addedToast.set(null), 3000);
  }

  buyNow(): void {
    const p = this.product();
    if (!p) return;

    this.cartService.addToCart(p, Number(this.selectedQuantity) || 1);
    this.router.navigate(['/checkout']);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
  }
}
