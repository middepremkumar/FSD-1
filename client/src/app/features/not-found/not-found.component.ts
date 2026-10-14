import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="nf-container">
      <div class="nf-card">
        <div class="nf-dog">🐕</div>
        <span class="nf-code">404 • PAGE NOT FOUND</span>
        <h1>Looking for something?</h1>
        <p>We're sorry. The Web address you entered is not a functioning page on our site.</p>
        <div class="nf-actions">
          <a routerLink="/" class="btn-nf-home">Go to Amazon's Home Page</a>
          <a routerLink="/products" class="btn-nf-cat">Explore Catalog</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nf-container {
      background: #eaeded;
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .nf-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 60px 32px;
      text-align: center;
      max-width: 550px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .nf-dog {
      font-size: 64px;
      margin-bottom: 12px;
    }
    .nf-code {
      background: #fee2e2;
      color: #991b1b;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 12px;
    }
    .nf-card h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 16px 0 8px 0;
    }
    .nf-card p {
      color: #64748b;
      font-size: 14px;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .nf-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn-nf-home {
      background: #ffd814;
      color: #0f1111;
      padding: 10px 20px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
    }
    .btn-nf-cat {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 10px 20px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
    }
  `]
})
export class NotFoundComponent {}
