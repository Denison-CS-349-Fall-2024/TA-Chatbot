import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../types/coursetypes';
import { ToastService } from '../../services/toast-service/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-enrollment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="flex flex-col">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Enroll in a Course</h3>
            <button (click)="close()" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search -->
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

          <!-- Pin Input (shows only when course is selected) -->
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
    <app-toast
  *ngFor="let toast of toastService.toasts$ | async"
  [type]="toast.type"
  [title]="toast.title"
  [message]="toast.message"
  [show]="true"
  (dismissed)="toastService.dismiss(toast.id)"
    >
    </app-toast>
  `
})
export class EnrollmentModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() enrolled = new EventEmitter<Course>();

  protected searchTerm = '';
  protected selectedCourse: Course | null = null;
  protected pin = '';
  protected availableCourses: Course[] = [];

  constructor(protected toastService: ToastService) {}

  ngOnInit() {
    // Generate mock data
    this.availableCourses = this.generateMockCourses();
  }

  generateMockCourses(): Course[] {
    const departments = ['CS', 'MATH', 'PHYS', 'CHEM', 'BIO'];
    const professors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones'];
    const courses: Course[] = [];

    for (let i = 0; i < 20; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const courseNum = "" + Math.floor(Math.random() * 500) + 100;
      courses.push({
        id: `course-${i}`,
        courseTitle: `${dept} ${courseNum}: Introduction to ${dept}`,
        department: dept,
        courseNumber: courseNum,
        section: `0${Math.floor(Math.random() * 5) + 1}`,
        semester: Math.random() > 0.5 ? 'fall2024' : 'spring2024',
        credits: "" + Math.floor(Math.random() * 3) + 2,
        professorFirstName: professors[Math.floor(Math.random() * professors.length)].split(' ')[0],
        professorLastName: professors[Math.floor(Math.random() * professors.length)].split(' ')[1],
        pin: '1234', // Mock pin for testing
        isActive: true
      });
    }
    return courses;
  }

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

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.pin = '';
  }

  enrollInCourse() {
    if (!this.selectedCourse || !this.pin) return;

    if (this.pin === this.selectedCourse.pin) {
      this.enrolled.emit(this.selectedCourse);
      this.close();
    } else {

      this.toastService.show('error', 'Invalid pin', 'The pin you entered is incorrect.');

    }
  }

  close() {
    this.closeModal.emit();
  }
}
