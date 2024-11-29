import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course-service/course.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { Course } from '../../types/coursetypes';

@Component({
  selector: 'app-add-ta',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    ToastComponent
  ],
  templateUrl: './add-ta-form.component.html',
  styleUrl: './add-ta-form.component.css'
})
export class AddTaFormComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() courseAdded = new EventEmitter<void>();
  @Input() duplicateData: Course | null = null;

  protected isSubmitting = false;
  protected addCourseData = {
    name: "",
    section: "",
    department: "N/A",
    courseNumber: "",
    credits: "",
  };

  constructor(
    protected toastService: ToastService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    if (this.duplicateData) {
      this.addCourseData = {
        name: this.duplicateData.courseTitle,
        section: this.duplicateData.section,
        department: this.duplicateData.department,
        courseNumber: this.duplicateData.courseNumber,
        credits: this.duplicateData.credits,
      };
    }
  }

  async addCourse() {
    if (this.isSubmitting) return;

    if (!this.isFormValid()) {
      this.toastService.show(
        'error',
        'Validation Error',
        'Please fill in all required fields.'
      );
      return;
    }

    try {
      this.isSubmitting = true;
      await this.courseService.addCourse(
        this.addCourseData.name,
        this.addCourseData.section,
        this.addCourseData.department,
        this.addCourseData.courseNumber,
        this.addCourseData.credits
      );
      this.courseAdded.emit();
      this.closeModal.emit();
      
      this.toastService.show(
        'success',
        'Course Created',
        'The course has been successfully created.'
      );
      
      this.courseAdded.emit();
      this.closeModal.emit();
    } catch (error) {
      this.toastService.show(
        'error',
        'Error',
        'Failed to create course. Please try again.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  handleClose() {
    this.closeModal.emit();
  }

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
