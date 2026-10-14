import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="ad-container">
      <div class="ad-card">
        <div class="ad-icon">🔒</div>
        <span class="ad-code">403 • ACCESS RESTRICTED</span>
        <h1>Access Denied</h1>
        <p>You do not have administrative clearance to access this protected area.</p>
        <a routerLink="/" class="btn-ad-home">Return to Safety</a>
      </div>
    </div>
  `,
  styles: [`
    .ad-container {
      background: #eaeded;
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .ad-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 60px 32px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .ad-icon {
      font-size: 56px;
      margin-bottom: 12px;
    }
    .ad-code {
      background: #fee2e2;
      color: #991b1b;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 12px;
    }
    .ad-card h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 16px 0 8px 0;
    }
    .ad-card p {
      color: #64748b;
      font-size: 14px;
      margin: 0 0 24px 0;
    }
    .btn-ad-home {
      background: #ffd814;
      color: #0f1111;
      padding: 10px 24px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
    }
  `]
})
export class AccessDeniedComponent {}
