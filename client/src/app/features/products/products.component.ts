import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent, LoadingComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);

  activeCategory = signal<string>('All');
  searchQuery = signal<string>('');
  selectedSort = signal<string>('default');

  ngOnInit(): void {
    // Load categories for filter tabs
    this.categoryService.getCategories().subscribe({
      next: res => {
        if (res.data) this.categories.set(res.data);
      }
    });

    // Listen to route params & query params
    this.route.params.subscribe(params => {
      if (params['category']) {
        this.activeCategory.set(params['category']);
      } else {
        this.activeCategory.set('All');
      }
      this.route.queryParams.subscribe(qParams => {
        if (qParams['q']) {
          this.searchQuery.set(qParams['q']);
        } else {
          this.searchQuery.set('');
        }
        if (qParams['sort']) {
          this.selectedSort.set(qParams['sort']);
        }
        this.fetchProducts();
      });
    });
  }

  fetchProducts(): void {
    this.isLoading.set(true);
    const cat = this.activeCategory() === 'All' ? undefined : this.activeCategory();
    const q = this.searchQuery() || undefined;
    const sort = this.selectedSort() === 'default' ? undefined : this.selectedSort();

    this.productService.getProducts(cat, q, sort).subscribe({
      next: res => {
        this.products.set(res.data || []);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Products: failed to load:', err);
        this.products.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onCategorySelect(slug: string): void {
    this.activeCategory.set(slug);
    if (slug === 'All') {
      this.router.navigate(['/products'], {
        queryParams: this.searchQuery() ? { q: this.searchQuery() } : undefined
      });
    } else {
      this.router.navigate(['/category', slug.toLowerCase()], {
        queryParams: this.searchQuery() ? { q: this.searchQuery() } : undefined
      });
    }
  }

  onSortChange(): void {
    const sortVal = this.selectedSort();
    const queryParams: any = { ...this.route.snapshot.queryParams };
    if (sortVal && sortVal !== 'default') {
      queryParams['sort'] = sortVal;
    } else {
      delete queryParams['sort'];
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  clearFilters(): void {
    this.activeCategory.set('All');
    this.searchQuery.set('');
    this.selectedSort.set('default');
    this.router.navigate(['/products']);
  }
}
