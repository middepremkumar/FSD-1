import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CategoryService } from '../../core/services/category.service';
import { StatsService } from '../../core/services/stats.service';
import { Category } from '../../models/category.model';
import { HealthStatus } from '../../models/api-response.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartService = inject(CartService);
  private categoryService = inject(CategoryService);
  private statsService = inject(StatsService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  selectedCategory = 'All';
  searchQuery = '';
  dbHealth = signal<HealthStatus | null>(null);
  isMobileMenuOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: res => {
        if (res.data) {
          this.categories.set(res.data);
        }
      },
      error: err => console.warn('Categories load error in navbar:', err)
    });

    this.statsService.getHealth().subscribe({
      next: res => this.dbHealth.set(res),
      error: err => console.warn('Health fetch error in navbar:', err)
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      this.router.navigate(['/category', this.selectedCategory.toLowerCase()], {
        queryParams: q ? { q } : undefined
      });
    } else if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
    } else {
      this.router.navigate(['/products']);
    }
    this.isMobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
