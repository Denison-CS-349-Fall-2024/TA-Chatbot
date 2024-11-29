import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-archive-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" *ngIf="show">
    <div class="relative mx-auto p-5 w-full max-w-md">
      <div class="relative bg-white rounded-xl shadow-lg p-8">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" [ngClass]="iconBackgroundClass">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [ngClass]="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="iconPath" />
          </svg>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 text-center mb-2">{{ title }}</h3>
        <p class="text-gray-500 text-center mb-6">{{ message }}</p>
        
        <div class="flex justify-center space-x-4">
          <button
            (click)="onCancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            (click)="onConfirm()"
            [ngClass]="actionButtonClass"
            class="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {{ actionButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  `,
  styleUrl: './confirmation-archive-modal.component.css'
})
export class ConfirmationArchiveModalComponent {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'archive' | 'restore' = 'archive';
  @Input() actionButtonText = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get iconPath(): string {
    return this.type === 'archive' 
      ? 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
      : 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
  }

  get iconBackgroundClass(): string {
    return this.type === 'archive' ? 'bg-yellow-100' : 'bg-primary-100';
  }

  get iconColorClass(): string {
    return this.type === 'archive' ? 'text-yellow-600' : 'text-primary-600';
  }

  get actionButtonClass(): string {
    return this.type === 'archive' 
      ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';
  }

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
