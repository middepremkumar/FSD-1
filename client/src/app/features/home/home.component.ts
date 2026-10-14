import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { StatsService } from '../../core/services/stats.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { DashboardStats } from '../../models/api-response.model';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private statsService = inject(StatsService);

  isLoading = signal<boolean>(true);
  featuredProducts = signal<Product[]>([]);
  dealProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    // Fetch products
    this.productService.getProducts().subscribe({
      next: res => {
        const list = res.data || [];
        this.featuredProducts.set(list);
        this.dealProducts.set(list.filter(p => !!p.deal_tag || (p.original_price && p.original_price > p.price)));
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Home: Failed to fetch products:', err);
        this.isLoading.set(false);
      }
    });

    // Fetch categories
    this.categoryService.getCategories().subscribe({
      next: res => {
        if (res.data) this.categories.set(res.data);
      }
    });

    // Fetch stats
    this.statsService.getStats().subscribe({
      next: res => {
        if (res.stats) this.stats.set(res.stats);
      }
    });
  }
}
