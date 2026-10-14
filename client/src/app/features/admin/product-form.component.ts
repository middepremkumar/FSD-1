import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../models/category.model';
import { ProductFormData } from '../../models/product.model';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  categories = signal<Category[]>([]);

  // Form Fields
  formData: ProductFormData = {
    title: '',
    category_id: 1,
    price: 999,
    original_price: 1299,
    stock_quantity: 25,
    deal_tag: 'Special Offer',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    delivery_info: 'FREE Delivery Tomorrow'
  };

  ngOnInit(): void {
    // Load categories for selector
    this.categoryService.getCategories().subscribe({
      next: res => {
        if (res.data) this.categories.set(res.data);
      }
    });

    // Check if editing
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.productId.set(Number(id));
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: res => {
        if (res.data) {
          const p = res.data;
          this.formData = {
            title: p.title,
            category_id: p.category_id || 1,
            price: p.price,
            original_price: p.original_price || Math.round(p.price * 1.2),
            stock_quantity: p.stock_quantity ?? 20,
            deal_tag: p.deal_tag || '',
            badge: p.badge || '',
            image: p.image,
            delivery_info: p.delivery_info || 'FREE Delivery Tomorrow'
          };
        }
        this.isLoading.set(false);
      },
      error: err => {
        this.errorMessage.set(err.message || 'Failed to load product details.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (!this.formData.title.trim()) {
      this.errorMessage.set('Product title is required.');
      return;
    }

    if (this.formData.price === undefined || this.formData.price < 0) {
      this.errorMessage.set('A valid price is required.');
      return;
    }

    this.isSaving.set(true);

    if (this.isEditMode() && this.productId()) {
      this.productService.updateProduct(this.productId()!, this.formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/admin/products']);
        },
        error: err => {
          this.errorMessage.set(err.message || 'Failed to update product.');
          this.isSaving.set(false);
        }
      });
    } else {
      this.productService.createProduct(this.formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/admin/products']);
        },
        error: err => {
          this.errorMessage.set(err.message || 'Failed to create product.');
          this.isSaving.set(false);
        }
      });
    }
  }
}
