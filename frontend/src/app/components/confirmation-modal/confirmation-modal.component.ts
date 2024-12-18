import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * The ConfirmationModalComponent represents a modal dialog for confirming or canceling an action.
 * It provides customizable title and message inputs and emits events on user confirmation or cancellation.
 */
@Component({
  selector: 'app-confirmation-modal', // Component selector for use in templates.
  standalone: true, // Indicates that this component can be used without being declared in a module.
  imports: [CommonModule], // Imports the Angular CommonModule for template directives.
  template: `
    <!-- Overlay background -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <!-- Centered modal container -->
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <!-- Modal content -->
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="sm:flex sm:items-start">
              <!-- Icon container -->
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <!-- Title and message -->
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ title }} <!-- Title passed as an input -->
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ message }} <!-- Message passed as an input -->
                  </p>
                </div>
              </div>
            </div>
            <!-- Buttons -->
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <!-- Confirm button -->
              <button
                type="button"
                (click)="onConfirm()"
                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Delete
              </button>
              <!-- Cancel button -->
              <button
                type="button"
                (click)="onCancel()"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
  /**
   * The title of the confirmation modal.
   * Defaults to "Confirm Delete".
   */
  @Input() title: string = 'Confirm Delete';

  /**
   * The message displayed in the confirmation modal.
   * Defaults to a warning about the irreversibility of the action.
   */
  @Input() message: string = 'Are you sure you want to delete this item? This action cannot be undone.';

  /**
   * Event emitted when the confirm button is clicked.
   */
  @Output() confirm = new EventEmitter<void>();

  /**
   * Event emitted when the cancel button is clicked.
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Emits the confirm event when the confirm button is clicked.
   */
  onConfirm() {
    this.confirm.emit();
  }

  /**
   * Emits the cancel event when the cancel button is clicked.
   */
  onCancel() {
    this.cancel.emit();
  }
}
