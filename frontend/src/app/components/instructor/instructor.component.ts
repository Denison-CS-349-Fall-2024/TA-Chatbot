import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../types/coursetypes';
import { Observable, Subscription } from 'rxjs';
import { CourseService } from '../../services/course-service/course.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { User } from '../../types/usertype';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddTaFormComponent } from '../add-ta-form/add-ta-form.component';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../services/toast-service/toast.service';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { ViewPreferenceService } from '../../services/view-preference/view-preference.service';
import { ConfirmationArchiveModalComponent } from '../confirmation-archive-modal/confirmation-archive-modal.component';
import { ViewService } from '../../services/view-service/view.service';
import { StudentDashboardComponent } from '../student-dashboard/student-dashboard.component';
import { formatSemester } from '../../utils/format';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule, AddTaFormComponent, ToastComponent, RouterModule, TooltipComponent, ConfirmationArchiveModalComponent, StudentDashboardComponent],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class InstructorComponent implements OnInit, OnDestroy {
  protected courses!: Course[];
  protected coursesSubscription!: Subscription;
  protected currentUser$: Observable<User | null>;
  protected isLoading: boolean = true;
  protected searchTerm: string = '';
  protected selectedSemester: string = 'all';
  protected view: 'grid' | 'list' = 'grid';
  protected duplicatingCourse: Course | null = null;
  protected showArchivedCourses = false;
  protected archivedCourses: Course[] = [];
  protected archivedCoursesSubscription!: Subscription;
  protected showArchiveModal = false;
  protected showRestoreModal = false;
  protected selectedCourse: Course | null = null;
  protected isStudentView = false;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    protected toastService: ToastService,
    private viewPreferenceService: ViewPreferenceService,
    private viewService: ViewService
  ) {
    this.currentUser$ = this.authService.currentUser;
    this.view = this.viewPreferenceService.getViewMode();
  }

  ngOnInit() {
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
      this.isLoading = false;
    });
    this.archivedCoursesSubscription = this.courseService.archivedCourses$.subscribe(archivedCourses => {
      this.archivedCourses = archivedCourses;
    });
  }

  ngOnDestroy() {
    if (this.coursesSubscription) {
      this.coursesSubscription.unsubscribe();
    }
    if (this.archivedCoursesSubscription) {
      this.archivedCoursesSubscription.unsubscribe();
    }
  }

  async handleLogout() {
    try {
      await this.authService.logout();
    } catch (error) {
      this.toastService.show(
        'error',
        'Logout Error',
        'Failed to logout properly. Please try again.'
      );
    }
  }

  toggleView() {
    const newView = this.view === 'grid' ? 'list' : 'grid';
    this.view = newView;
    this.viewPreferenceService.setViewMode(newView);
  }

  initiateArchive(course: Course, event: Event) {
    event.stopPropagation();
    this.selectedCourse = course;
    this.showArchiveModal = true;
  }

  initiateRestore(course: Course, event: Event) {
    event.stopPropagation();
    this.selectedCourse = course;
    this.showRestoreModal = true;
  }

  async confirmArchive() {
    if (this.selectedCourse) {
      await this.archiveCourse(this.selectedCourse);
      this.showArchiveModal = false;
      this.selectedCourse = null;
    }
  }

  async confirmRestore() {
    if (this.selectedCourse) {
      await this.unarchiveCourse(this.selectedCourse);
      this.showRestoreModal = false;
      this.selectedCourse = null;
    }
  }

  cancelModal() {
    this.showArchiveModal = false;
    this.showRestoreModal = false;
    this.selectedCourse = null;
  }

  // Future functionality methods
  async archiveCourse(course: Course) {
    try {
      await this.courseService.archiveCourse(course.id);
      await this.courseService.getInstructorCourses(this.authService.getId()!);
      this.toastService.show(
        'success',
        'Course Archived',
        `${course.courseTitle} has been archived successfully`
      );
    } catch (error) {
      this.toastService.show(
        'error',
        'Error',
        'Failed to archive course. Please try again.'
      );
    }
  }

  async unarchiveCourse(course: Course) {
    try {
      await this.courseService.unarchiveCourse(course.id);
      await this.courseService.getInstructorCourses(this.authService.getId()!);
      this.toastService.show(
        'success',
        'Course Restored',
        `${course.courseTitle} has been restored successfully`
      );
    } catch (error) {
      this.toastService.show(
        'error',
        'Error',
        'Failed to restore course. Please try again.'
      );
    }
  }

  async duplicateCourse(course: Course) {
    this.duplicatingCourse = {
      ...course,
      id: '', // Reset ID since this will be a new course
    };
    this.showAddCourseModal = true;
  }

  getFilteredCourses() {
    if (!this.courses) return [];
    
    let filtered = this.courses.filter(course => {
      const searchTerm = this.searchTerm.toLowerCase().trim();
      if (!searchTerm) return this.selectedSemester === 'all' || course.semester === this.selectedSemester;

      const matchesSearch = 
        course.department.toLowerCase().includes(searchTerm) ||
        course.courseNumber.toString().includes(searchTerm) ||
        course.section.toLowerCase().includes(searchTerm) ||
        course.courseTitle.toLowerCase().includes(searchTerm) ||
        `${course.department.toLowerCase()}${course.courseNumber}`.includes(searchTerm) ||
        `${course.department.toLowerCase()} ${course.courseNumber}`.includes(searchTerm);
      
      const matchesSemester = this.selectedSemester === 'all' || course.semester === this.selectedSemester;
      
      return matchesSearch && matchesSemester;
    });

    // Add semester sorting
    return filtered.sort((a, b) => {
      const aYear = parseInt(a.semester.slice(-4));
      const bYear = parseInt(b.semester.slice(-4));
      const aSeason = a.semester.slice(0, -4).toLowerCase();
      const bSeason = b.semester.slice(0, -4).toLowerCase();
      
      if (aYear !== bYear) return bYear - aYear;
      
      const seasonOrder: Record<string, number> = {
        spring: 0,
        summer: 1,
        fall: 2,
        winter: 3
      };
      
      return (seasonOrder[bSeason] ?? 0) - (seasonOrder[aSeason] ?? 0);
    });
  }

  showAddCourseModal = false;

  openAddCourseModal() {
    this.showAddCourseModal = true;
  }

  handleModalClose() {
    this.showAddCourseModal = false;
    this.duplicatingCourse = null;
  }

  handleCourseAdded() {
    this.showAddCourseModal = false;
    this.toastService.show(
      'success',
      'Course Added',
      'The course has been successfully created'
    );
  }

  toggleArchivedCourses() {
    this.showArchivedCourses = !this.showArchivedCourses;
  }

  toggleViewMode() {
    this.isStudentView = !this.isStudentView;
    this.viewService.setViewMode(this.isStudentView ? 'student' : 'instructor');
  }

  formatSemester(semester: string): string {
    return formatSemester(semester);
  }

  getSemesterColor(semester: string): string {
    const season = semester.slice(0, -4).toLowerCase();
    switch (season) {
      case 'fall':
        return 'bg-orange-100 text-orange-800';
      case 'spring':
        return 'bg-green-100 text-green-800';
      case 'summer':
        return 'bg-yellow-100 text-yellow-800';
      case 'winter':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
