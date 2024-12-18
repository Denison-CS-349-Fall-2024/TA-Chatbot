import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course-service/course.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast-service/toast.service';

/**
 * Interface representing a file type with associated metadata.
 */
interface FileType {
  value: string; // Internal identifier for the file type.
  label: string; // Display label for the file type.
  icon: string; // Icon representing the file type.
  description: string; // Brief description of the file type.
}

@Component({
  selector: 'app-add-material-modal', // Selector for embedding the component in templates.
  standalone: true, // Marks this component as standalone.
  imports: [FormsModule, CommonModule], // Modules required for form handling and common directives.
  template: `
    <!-- Modal toggle -->
    <button type="button" 
            (click)="openModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Add Material
    </button>

    <!-- Modal backdrop -->
    <div *ngIf="isModalOpen"
         class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
         (click)="closeModal()">
    </div>

    <!-- Main modal -->
    <div *ngIf="isModalOpen"
         class="fixed inset-0 z-50 overflow-y-auto"
         aria-labelledby="modal-title" 
         role="dialog" 
         aria-modal="true">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <!-- Modal header -->
          <div class="absolute right-0 top-0 pr-4 pt-4">
            <button type="button" 
                    (click)="closeModal()"
                    class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Add Course Material
              </h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Upload course materials for your students. Supported formats: PDF, DOCX (Max 7MB)
              </p>
            </div>
          </div>

          <!-- Form -->
          <form class="mt-6 space-y-6" (ngSubmit)="onFileUpload()" #materialForm="ngForm">
            <!-- Material Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Material Name
              </label>
              <input type="text"
                     [(ngModel)]="materialName"
                     name="materialName"
                     required
                     [class.border-red-300]="!materialName && isSubmitting"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                     placeholder="e.g., Course Syllabus"
                     autocomplete="off"
                     >
            </div>

            <!-- Material Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Material Type
              </label>
              <div class="mt-2 grid grid-cols-2 gap-3">
                <ng-container *ngFor="let type of fileTypes">
                  <div (click)="selectedFileType = type.value"
                       [class.ring-2]="selectedFileType === type.value"
                       class="relative flex cursor-pointer rounded-lg border bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none">
                    <div class="flex w-full items-center justify-between">
                      <div class="flex items-center">
                        <div class="text-sm">
                          <p class="font-medium text-gray-900 dark:text-white">
                            {{ type.label }}
                          </p>
                          <p class="text-gray-500 dark:text-gray-400">
                            {{ type.description }}
                          </p>
                        </div>
                      </div>
                      <svg *ngIf="selectedFileType === type.value" 
                           class="h-5 w-5 text-primary-600" 
                           viewBox="0 0 20 20" 
                           fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>

            <!-- File Upload -->
            
          <div class="flex items-center justify-center w-full">
            <div class="w-full flex flex-col">
              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:border-gray-500">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">PDF or DOCX up to 7MB</p>
                  </div>
                  <input id="dropzone-file" type="file" class="hidden sr-only" (change)="onFileSelect($event)" accept=".pdf,.docx"/>
              </label>
              @if(selectedFile) {
                <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ selectedFile.name }}
                </div>
              }
                </div>
          </div> 
            <!-- AI Processing Option -->
            <div class="relative flex items-start">
              <div class="flex h-6 items-center">
                <input type="checkbox"
                       [(ngModel)]="enableAI"
                       name="enableAI"
                       class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
              </div>
              <div class="ml-3">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable AI Processing
                </label>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Allow the chatbot to answer questions using this material
                </p>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end">

              <button type="submit"
                      [disabled]="isSubmitting || !isFormValid()"
                      class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <svg *ngIf="isSubmitting" 
                     class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                     xmlns="http://www.w3.org/2000/svg" 
                     fill="none" 
                     viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Uploading...' : 'Upload Material' }}
              </button>
                <button type="button"
                      (click)="closeModal()"
                      [disabled]="isSubmitting"
                      class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AddMaterialModalComponent {
  @Input() semester!: string; // Semester for which the material is being uploaded.
  @Input() courseAndSection!: string; // Course and section identifier for the material.
  @Input() isModalOpen = false; // Flag to track modal visibility.
  @Output() modalClosed = new EventEmitter<void>(); // Event emitted when the modal is closed.

  protected selectedFile: File | null = null; // Holds the currently selected file.
  protected selectedFileType: string = ""; // Stores the selected file type.
  protected materialName: string = ""; // Name of the material being uploaded.
  protected isSubmitting = false; // Flag to indicate if the form is being submitted.
  protected enableAI = false; // Indicates whether AI processing is enabled for the material.
  protected isDragging = false; // Tracks drag-and-drop activity.

  /**
   * List of file types supported by the system, along with metadata.
   */
  protected fileTypes: FileType[] = [
    { value: 'syllabus', label: 'Syllabus', icon: 'document', description: 'Course Syllabus' },
    { value: 'assignment', label: 'Assignment', icon: 'clipboard', description: 'Homework and Project' },
    { value: 'quiz', label: 'Quiz', icon: 'academic-cap', description: 'Test and Assessment' },
    { value: 'readings', label: 'Reading', icon: 'book-open', description: 'Reading Material' }
  ];

  constructor(
    private courseService: CourseService, // Service for handling course-related operations.
    private http: HttpClient, // HttpClient for making HTTP requests.
    private toastService: ToastService // Service for displaying toast notifications.
  ) {}

  /**
   * Validates the form to ensure all required fields are filled.
   * @returns `true` if the form is valid, otherwise `false`.
   */
  isFormValid(): boolean {
    return !!(this.materialName && this.selectedFile && this.selectedFileType);
  }

  /**
   * Handles file selection via the input field.
   * @param event The file selection event.
   */
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
      }
    }
  }

  /**
   * Validates the selected file against size and type restrictions.
   * @param file The file to validate.
   * @returns `true` if the file is valid, otherwise `false`.
   */
  validateFile(file: File): boolean {
    const maxSize = 7 * 1024 * 1024; // Maximum file size: 7MB.
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file.size > maxSize) {
      this.toastService.show('error', 'Error', 'File size must be less than 7MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.toastService.show('error', 'Error', 'Only PDF and DOCX files are allowed');
      return false;
    }

    return true;
  }

  /**
   * Handles the form submission for uploading the material.
   */
  onFileUpload() {
    if (!this.isFormValid()) return;

    this.isSubmitting = true;

    this.courseService.uploadFile(
      this.selectedFile!,
      this.selectedFileType,
      this.materialName,
      this.semester,
      this.courseAndSection
    ).subscribe({
      next: () => {
        this.toastService.show('success', 'Success', 'Material uploaded successfully');
        this.resetForm(); // Reset the form after successful upload.
        this.closeModal(); // Close the modal.
      },
      error: (error) => {
        this.toastService.show('error', 'Error', 'Failed to upload material');
        console.error('File upload failed', error);
      },
      complete: () => {
        this.isSubmitting = false; // Reset the submitting flag.
      }
    });
  }

  /**
   * Resets the form fields to their default values.
   */
  resetForm() {
    this.selectedFile = null;
    this.selectedFileType = "";
    this.materialName = "";
    this.enableAI = false;
  }

  /**
   * Opens the modal.
   */
  openModal() {
    this.isModalOpen = true;
  }

  /**
   * Closes the modal and emits the `modalClosed` event.
   */
  closeModal() {
    this.isModalOpen = false;
    this.modalClosed.emit();
  }

  /**
   * Handles the drag-over event to enable drag-and-drop functionality.
   * @param event The drag-over event.
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  /**
   * Handles the drag-leave event to reset the drag-and-drop state.
   * @param event The drag-leave event.
   */
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  /**
   * Handles the drop event to upload files via drag-and-drop.
   * @param event The drop event.
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
      }
    }
  }
}
