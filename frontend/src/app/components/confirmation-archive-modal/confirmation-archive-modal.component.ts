import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * The ConfirmationArchiveModalComponent is a reusable modal component 
 * for confirming archive or restore actions. It provides customizable 
 * title, message, and button styles based on the action type ('archive' or 'restore').
 */
@Component({
  selector: 'app-confirmation-archive-modal', // Component selector used in templates.
  standalone: true, // Indicates that the component is standalone and can be used without a module.
  imports: [CommonModule], // Imports Angular's CommonModule for template functionalities.
  template: `
  <!-- Modal overlay -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center" *ngIf="show">
    <div class="relative mx-auto p-5 w-full max-w-md">
      <!-- Modal container -->
      <div class="relative bg-white rounded-xl shadow-lg p-8">
        <!-- Icon display -->
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" [ngClass]="iconBackgroundClass">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [ngClass]="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="iconPath" />
          </svg>
        </div>
        
        <!-- Title -->
        <h3 class="text-xl font-semibold text-gray-900 text-center mb-2">{{ title }}</h3>
        <!-- Message -->
        <p class="text-gray-500 text-center mb-6">{{ message }}</p>
        
        <!-- Action buttons -->
        <div class="flex justify-center space-x-4">
          <!-- Cancel button -->
          <button
            (click)="onCancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <!-- Confirm button -->
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
  styleUrl: './confirmation-archive-modal.component.css' // Styles specific to this component.
})
export class ConfirmationArchiveModalComponent {
  // Determines if the modal is visible.
  @Input() show = false;

  // The title of the modal.
  @Input() title = '';

  // The message displayed inside the modal.
  @Input() message = '';

  // The type of action: 'archive' (default) or 'restore'.
  @Input() type: 'archive' | 'restore' = 'archive';

  // The text displayed on the confirmation button.
  @Input() actionButtonText = 'Confirm';

  // Event emitted when the confirm button is clicked.
  @Output() confirmed = new EventEmitter<void>();

  // Event emitted when the cancel button is clicked.
  @Output() cancelled = new EventEmitter<void>();

  /**
   * Returns the appropriate SVG path for the icon based on the action type.
   */
  get iconPath(): string {
    return this.type === 'archive' 
      ? 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
      : 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
  }

  /**
   * Returns the background class for the icon based on the action type.
   */
  get iconBackgroundClass(): string {
    return this.type === 'archive' ? 'bg-yellow-100' : 'bg-primary-100';
  }

  /**
   * Returns the text color class for the icon based on the action type.
   */
  get iconColorClass(): string {
    return this.type === 'archive' ? 'text-yellow-600' : 'text-primary-600';
  }

  /**
   * Returns the class for the confirmation button based on the action type.
   */
  get actionButtonClass(): string {
    return this.type === 'archive' 
      ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';
  }

  /**
   * Emits the confirmed event when the confirm button is clicked.
   */
  onConfirm() {
    this.confirmed.emit();
  }

  /**
   * Emits the cancelled event when the cancel button is clicked.
   */
  onCancel() {
    this.cancelled.emit();
  }
}
