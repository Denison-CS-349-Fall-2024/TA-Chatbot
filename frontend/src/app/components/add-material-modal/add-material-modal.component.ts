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
    <!-- Template content omitted for brevity -->
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
