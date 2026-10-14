import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading-container">
      <div class="amz-spinner"></div>
      <p class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 20px;
      gap: 16px;
    }
    .amz-spinner {
      width: 42px;
      height: 42px;
      border: 3.5px solid #eaeded;
      border-top-color: #ff9900;
      border-right-color: #ff9900;
      border-radius: 50%;
      animation: spin 0.75s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }
    .loading-message {
      font-size: 13px;
      color: #565959;
      font-weight: 600;
      letter-spacing: 0.2px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {
  @Input() message = 'Loading Amazon catalog...';
}
