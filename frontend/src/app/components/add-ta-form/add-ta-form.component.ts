import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course-service/course.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { Course } from '../../types/coursetypes';

/**
 * AddTaFormComponent allows users to create a new course or duplicate an existing course for TA management.
 */
@Component({
  selector: 'app-add-ta', // Selector for using this component in templates.
  standalone: true, // Indicates this is a standalone component.
  imports: [
    FormsModule, // Enables form handling.
    CommonModule, // Provides common Angular directives.
    ToastComponent // Used for displaying toast notifications.
  ],
  templateUrl: './add-ta-form.component.html', // Path to the HTML template.
  styleUrl: './add-ta-form.component.css' // Path to the CSS file for styling.
})
export class AddTaFormComponent {
  @Output() closeModal = new EventEmitter<void>(); // Event emitted to close the modal.
  @Output() courseAdded = new EventEmitter<void>(); // Event emitted after successfully adding a course.
  @Input() duplicateData: Course | null = null; // Input to prefill form data for duplicating an existing course.

  protected isSubmitting = false; // Flag to prevent duplicate submissions.
  protected addCourseData = {
    name: "", // Name of the course.
    section: "", // Section identifier.
    department: "N/A", // Department offering the course.
    courseNumber: "", // Course number.
    credits: "", // Number of credits for the course.
  };

  constructor(
    protected toastService: ToastService, // Service for showing toast notifications.
    private courseService: CourseService // Service for managing course-related operations.
  ) {}

  /**
   * Lifecycle hook to initialize the component.
   * Prefills form data if `duplicateData` is provided.
   */
  ngOnInit() {
    if (this.duplicateData) {
      this.addCourseData = {
        name: this.duplicateData.courseTitle, // Set course name from duplicate data.
        section: this.duplicateData.section, // Set section from duplicate data.
        department: this.duplicateData.department, // Set department from duplicate data.
        courseNumber: this.duplicateData.courseNumber, // Set course number from duplicate data.
        credits: this.duplicateData.credits, // Set credits from duplicate data.
      };
    }
  }

  /**
   * Adds a new course based on form data.
   */
  async addCourse() {
    if (this.isSubmitting) return; // Prevent multiple submissions.

    // Validate form fields before submission.
    if (!this.isFormValid()) {
      this.toastService.show(
        'error',
        'Validation Error',
        'Please fill in all required fields.' // Notify user of validation error.
      );
      return;
    }

    try {
      this.isSubmitting = true; // Set submitting flag to true.
      
      // Call service to add a new course.
      await this.courseService.addCourse(
        this.addCourseData.name,
        this.addCourseData.section,
        this.addCourseData.department,
        this.addCourseData.courseNumber,
        this.addCourseData.credits
      );
      
      this.courseAdded.emit(); // Emit event to notify the parent component of course creation.
      this.closeModal.emit(); // Emit event to close the modal.

      this.toastService.show(
        'success',
        'Course Created',
        'The course has been successfully created.' // Notify user of success.
      );
    } catch (error) {
      this.toastService.show(
        'error',
        'Error',
        'Failed to create course. Please try again.' // Notify user of failure.
      );
    } finally {
      this.isSubmitting = false; // Reset submitting flag.
    }
  }

  /**
   * Handles the close button click to emit `closeModal` event.
   */
  handleClose() {
    this.closeModal.emit(); // Notify parent component to close the modal.
  }

  /**
   * Validates the form fields to ensure all required fields are filled.
   * @returns `true` if the form is valid, otherwise `false`.
   */
  isFormValid(): boolean {
    return !!(
      this.addCourseData.name &&
      this.addCourseData.section &&
      this.addCourseData.courseNumber &&
      this.addCourseData.department !== 'N/A' &&
      this.addCourseData.credits
    );
  }
}
