import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../types/coursetypes';
import { ToastService } from '../../services/toast-service/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { CourseService } from '../../services/course-service/course.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth-service/auth.service';

/**
 * The EnrollmentModalComponent represents a modal for students
 * to enroll in courses by searching for courses and providing a pin.
 */
@Component({
  selector: 'app-enrollment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  template: `
    <!-- Modal overlay -->
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="flex flex-col">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Enroll in a Course</h3>
            <button (click)="close()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Input -->
          <div class="mb-4">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Search by course title, number, department, or instructor..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <!-- Course List -->
          <div class="overflow-y-auto max-h-96">
            <div *ngFor="let course of getFilteredCourses()" 
                 (click)="selectCourse(course)"
                 class="p-4 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                 [class.bg-primary-50]="selectedCourse?.id === course.id">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ course.courseTitle }}</h4>
                  <p class="text-sm text-gray-600">
                    {{ course.department.toUpperCase() }} {{ course.courseNumber }}-{{ course.section }}
                  </p>
                  <p class="text-sm text-gray-500">Instructor: {{ course.professorFirstName }}</p>
                </div>
                <span class="text-sm text-gray-500">{{ course.credits }} Credits</span>
              </div>
            </div>
          </div>

          <!-- Pin Input -->
          <div *ngIf="selectedCourse" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Enter Course Pin</label>
            <input
              type="text"
              [(ngModel)]="pin"
              placeholder="Enter the course pin"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end space-x-3">
            <button
              (click)="close()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              *ngIf="selectedCourse"
              (click)="enrollInCourse()"
              [disabled]="!pin"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Toast notifications -->
    <app-toast
      *ngFor="let toast of toastService.toasts$ | async"
      [type]="toast.type"
      [title]="toast.title"
      [message]="toast.message"
      [show]="true"
      (dismissed)="toastService.dismiss(toast.id)"
    ></app-toast>
  `
})
export class EnrollmentModalComponent implements OnInit {
  // Emits an event to close the modal.
  @Output() closeModal = new EventEmitter<void>();

  // Emits an event when a student successfully enrolls in a course.
  @Output() enrolled = new EventEmitter<Course>();

  // Search term for filtering courses.
  protected searchTerm = '';

  // Stores the currently selected course.
  protected selectedCourse: Course | null = null;

  // Stores the entered pin for the selected course.
  protected pin = '';

  // List of courses available for enrollment.
  protected availableCourses: Course[] = [];

  // List of courses the student is currently enrolled in.
  private currentEnrollments: Course[] = [];

  constructor(
    protected toastService: ToastService, // Service to show toast notifications.
    private courseService: CourseService, // Service to manage course data.
    private authService: AuthService, // Service for authentication.
    private http: HttpClient // HTTP client for making API requests.
  ) {}

  /**
   * Lifecycle hook that initializes the component.
   * Fetches available courses and filters out courses the student is already enrolled in.
   */
  async ngOnInit() {
    await this.courseService.fetchAllCourses();

    // Local variable to store all active courses.
    let allActiveCourses: Course[] = [];
    
    // Subscribe to available courses and filter them based on current enrollments.
    this.courseService.availableCourses$.subscribe(courses => {
      allActiveCourses = courses.filter(course => course.isActive);
      this.filterAvailableCourses(allActiveCourses, this.currentEnrollments);
    });

    // Subscribe to current enrollments and update available courses accordingly.
    this.courseService.courses$.subscribe(enrollments => {
      this.currentEnrollments = enrollments;
      this.filterAvailableCourses(allActiveCourses, enrollments);
    });
  }

  /**
   * Filters out courses that the student is already enrolled in.
   * @param allCourses - List of all active courses.
   * @param enrollments - List of courses the student is already enrolled in.
   */
  private filterAvailableCourses(allCourses: Course[], enrollments: Course[]) {
    this.availableCourses = allCourses.filter(course => 
      !enrollments.some(enrollment => enrollment.id === course.id)
    );
  }

  /**
   * Returns a list of courses filtered by the search term.
   */
  getFilteredCourses() {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    if (!searchTerm) return this.availableCourses;

    return this.availableCourses.filter(course => 
      course.courseTitle.toLowerCase().includes(searchTerm) ||
      course.department.toLowerCase().includes(searchTerm) ||
      course.courseNumber.toString().includes(searchTerm) ||
      course.professorFirstName.toLowerCase().includes(searchTerm) ||
      course.professorLastName.toLowerCase().includes(searchTerm) ||
      `${course.department.toLowerCase()}${course.courseNumber}`.includes(searchTerm) ||
      `${course.department.toLowerCase()} ${course.courseNumber}`.includes(searchTerm)
    );
  }

  /**
   * Selects a course for enrollment and clears the pin input.
   * @param course - The course to select.
   */
  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.pin = '';
  }

  /**
   * Attempts to enroll the student in the selected course using the entered pin.
   */
  async enrollInCourse() {
    if (!this.selectedCourse || !this.pin) return;

    // Check if the entered pin matches the course pin.
    if (this.pin === this.selectedCourse.pin) {
      try {
        const studentId = this.authService.getId();
        
        // Call the course service to enroll the student in the course.
        await this.courseService.enrollStudent(studentId!, this.selectedCourse.id);

        // Emit the enrolled event and show a success notification.
        this.enrolled.emit(this.selectedCourse);
        
        this.toastService.show(
          'success',
          'Enrollment Successful',
          `You have been enrolled in ${this.selectedCourse.courseTitle}`
        );

        // Close the modal after successful enrollment.
        this.close();
      } catch (error) {
        // Show an error notification if enrollment fails.
        this.toastService.show(
          'error',
          'Enrollment Failed',
          'There was an error enrolling in the course. Please try again.'
        );
        console.error('Error enrolling in course:', error);
      }
    } else {
      // Show an error notification if the entered pin is invalid.
      this.toastService.show(
        'error',
        'Invalid Pin',
        'The pin you entered is incorrect.'
      );
    }
  }

  /**
   * Closes the modal and emits the close event.
   */
  close() {
    this.closeModal.emit();
  }
}
