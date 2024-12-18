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

/**
 * The InstructorComponent represents the instructor dashboard, 
 * allowing management of courses, archiving/restoring, and toggling between views.
 */
@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddTaFormComponent,
    ToastComponent,
    RouterModule,
    TooltipComponent,
    ConfirmationArchiveModalComponent,
    StudentDashboardComponent
  ],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class InstructorComponent implements OnInit, OnDestroy {
  // List of active courses.
  protected courses!: Course[];

  // Subscription for courses observable to track active courses.
  protected coursesSubscription!: Subscription;

  // Observable for the current authenticated user.
  protected currentUser$: Observable<User | null>;

  // Flag to track whether data is still loading.
  protected isLoading: boolean = true;

  // Search term for filtering courses.
  protected searchTerm: string = '';

  // Selected semester for filtering courses.
  protected selectedSemester: string = 'all';

  // Current view mode for displaying courses ('grid' or 'list').
  protected view: 'grid' | 'list' = 'grid';

  // Course being duplicated.
  protected duplicatingCourse: Course | null = null;

  // Flag to indicate whether archived courses are being shown.
  protected showArchivedCourses = false;

  // List of archived courses.
  protected archivedCourses: Course[] = [];

  // Subscription for archived courses observable to track archived courses.
  protected archivedCoursesSubscription!: Subscription;

  // Flags for modals (archiving and restoring courses).
  protected showArchiveModal = false;
  protected showRestoreModal = false;

  // Currently selected course for archiving or restoring.
  protected selectedCourse: Course | null = null;

  // Flag to toggle between instructor and student views.
  protected isStudentView = false;

  constructor(
    private courseService: CourseService, // Service for handling course-related operations.
    private authService: AuthService, // Service for authentication-related tasks.
    private router: Router, // Router for navigation.
    protected toastService: ToastService, // Service for displaying toast notifications.
    private viewPreferenceService: ViewPreferenceService, // Service for saving user view preferences.
    private viewService: ViewService // Service for managing view mode changes.
  ) {
    // Assign the current user observable from AuthService.
    this.currentUser$ = this.authService.currentUser;

    // Set the initial view mode from saved preferences.
    this.view = this.viewPreferenceService.getViewMode();
  }

  /**
   * Lifecycle hook that runs when the component is initialized.
   * Subscribes to active courses and archived courses observables.
   */
  ngOnInit() {
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses; // Updates active courses list.
      this.isLoading = false; // Indicates that data has finished loading.
    });

    this.archivedCoursesSubscription = this.courseService.archivedCourses$.subscribe(archivedCourses => {
      this.archivedCourses = archivedCourses; // Updates archived courses list.
    });
  }

  /**
   * Lifecycle hook that runs when the component is destroyed.
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy() {
    if (this.coursesSubscription) {
      this.coursesSubscription.unsubscribe(); // Unsubscribe from active courses.
    }
    if (this.archivedCoursesSubscription) {
      this.archivedCoursesSubscription.unsubscribe(); // Unsubscribe from archived courses.
    }
  }

  /**
   * Handles user logout and displays an error toast if logout fails.
   */
  async handleLogout() {
    try {
      await this.authService.logout(); // Logs out the user.
    } catch (error) {
      this.toastService.show(
        'error',
        'Logout Error',
        'Failed to logout properly. Please try again.' // Error notification for logout failure.
      );
    }
  }

  /**
   * Toggles the view mode between 'grid' and 'list' and saves the preference.
   */
  toggleView() {
    const newView = this.view === 'grid' ? 'list' : 'grid'; // Switches view mode.
    this.view = newView; // Updates the current view mode.
    this.viewPreferenceService.setViewMode(newView); // Saves the preference.
  }

  /**
   * Initiates the archiving process for a course and opens the archive modal.
   * @param course - The course to be archived.
   * @param event - Event object to prevent click propagation.
   */
  initiateArchive(course: Course, event: Event) {
    event.stopPropagation(); // Prevents unintended event propagation.
    this.selectedCourse = course; // Sets the selected course for archiving.
    this.showArchiveModal = true; // Opens the archive confirmation modal.
  }

  /**
   * Initiates the restoring process for a course and opens the restore modal.
   * @param course - The course to be restored.
   * @param event - Event object to prevent click propagation.
   */
  initiateRestore(course: Course, event: Event) {
    event.stopPropagation(); // Prevents unintended event propagation.
    this.selectedCourse = course; // Sets the selected course for restoring.
    this.showRestoreModal = true; // Opens the restore confirmation modal.
  }

  /**
   * Confirms the archiving of the selected course and closes the modal.
   */
  async confirmArchive() {
    if (this.selectedCourse) {
      await this.archiveCourse(this.selectedCourse); // Archives the selected course.
      this.showArchiveModal = false; // Closes the archive modal.
      this.selectedCourse = null; // Resets the selected course.
    }
  }

  /**
   * Confirms the restoring of the selected course and closes the modal.
   */
  async confirmRestore() {
    if (this.selectedCourse) {
      await this.unarchiveCourse(this.selectedCourse); // Restores the selected course.
      this.showRestoreModal = false; // Closes the restore modal.
      this.selectedCourse = null; // Resets the selected course.
    }
  }

  /**
   * Cancels the current modal action and resets the selected course.
   */
  cancelModal() {
    this.showArchiveModal = false; // Closes the archive modal.
    this.showRestoreModal = false; // Closes the restore modal.
    this.selectedCourse = null; // Resets the selected course.
  }

  /**
   * Archives a course and updates the active courses list.
   * @param course - The course to be archived.
   */
  async archiveCourse(course: Course) {
    try {
      await this.courseService.archiveCourse(course.id); // Calls service to archive the course.
      await this.courseService.getInstructorCourses(this.authService.getId()!); // Refreshes the active courses list.
      this.toastService.show(
        'success',
        'Course Archived',
        `${course.courseTitle} has been archived successfully` // Success notification for archiving.
      );
    } catch (error) {
      this.toastService.show(
        'error',
        'Error',
        'Failed to archive course. Please try again.' // Error notification for archiving failure.
      );
    }
  }

  /**
   * Restores a course and updates the active courses list.
   * @param course - The course to be restored.
   */
  async unarchiveCourse(course: Course) {
    try {
      await this.courseService.unarchiveCourse(course.id); // Calls service to restore the course.
      await this.courseService.getInstructorCourses(this.authService.getId()!); // Refreshes the active courses list.
      this.toastService.show(
        'success',
        'Course Restored',
        `${course.courseTitle} has been restored successfully` // Success notification for restoring.
      );
    } catch (error) {
      this.toastService.show(
        'error',
        'Error',
        'Failed to restore course. Please try again.' // Error notification for restoring failure.
      );
    }
  }

  /**
   * Duplicates a course and opens the add course modal.
   * @param course - The course to be duplicated.
   */
  async duplicateCourse(course: Course) {
    this.duplicatingCourse = {
      ...course,
      id: '' // Clears the ID for the new course.
    };
    this.showAddCourseModal = true; // Opens the add course modal.
  }

  /**
   * Filters the list of courses based on the search term and selected semester.
   */
  getFilteredCourses() {
    if (!this.courses) return []; // Returns an empty list if no courses are available.

    let filtered = this.courses.filter(course => {
      const searchTerm = this.searchTerm.toLowerCase().trim(); // Normalizes the search term.
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

    return filtered.sort((a, b) => {
      const aYear = parseInt(a.semester.slice(-4));
      const bYear = parseInt(b.semester.slice(-4));
      const aSeason = a.semester.slice(0, -4).toLowerCase();
      const bSeason = b.semester.slice(0, -4).toLowerCase();

      const seasonOrder: Record<string, number> = {
        spring: 0,
        summer: 1,
        fall: 2,
        winter: 3
      };

      return (bYear - aYear) || (seasonOrder[bSeason] - seasonOrder[aSeason]); // Sorts by year and season.
    });
  }

  // Controls the visibility of the add course modal.
  showAddCourseModal = false;

  /**
   * Opens the add course modal.
   */
  openAddCourseModal() {
    this.showAddCourseModal = true;
  }

  /**
   * Handles the closing of the modal.
   */
  handleModalClose() {
    this.showAddCourseModal = false;
    this.duplicatingCourse = null; // Resets the duplicating course.
  }

  /**
   * Displays a success message when a course is added.
   */
  handleCourseAdded() {
    this.showAddCourseModal = false;
    this.toastService.show(
      'success',
      'Course Added',
      'The course has been successfully created' // Success notification for course addition.
    );
  }

  /**
   * Toggles the visibility of archived courses.
   */
  toggleArchivedCourses() {
    this.showArchivedCourses = !this.showArchivedCourses;
  }

  /**
   * Toggles between student and instructor views.
   */
  toggleViewMode() {
    this.isStudentView = !this.isStudentView; // Switches view mode.
    this.viewService.setViewMode(this.isStudentView ? 'student' : 'instructor'); // Updates the view mode.
  }

  /**
   * Formats the semester string into a human-readable format.
   * @param semester - The semester string to format.
   */
  formatSemester(semester: string): string {
    return formatSemester(semester);
  }

  /**
   * Returns a CSS class for the semester based on its season.
   * @param semester - The semester string to determine the color.
   */
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
