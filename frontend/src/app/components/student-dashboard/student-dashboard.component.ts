import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../types/coursetypes';
import { CourseService } from '../../services/course-service/course.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { User } from '../../types/usertype';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentModalComponent } from '../enrollment-modal/enrollment-modal.component';
import { ToastService } from '../../services/toast-service/toast.service';
import { formatSemester } from '../../utils/format';

/**
 * The StudentDashboardComponent represents the dashboard for students,
 * displaying courses and providing features like enrollment and course filtering.
 */
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EnrollmentModalComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  // Indicates whether the instructor view is enabled.
  @Input() isInstructorView = false;

  // Array to store the list of courses.
  protected courses!: Course[];

  // Subscription to track changes to the courses data stream.
  protected coursesSubscription!: Subscription;

  // Observable representing the currently logged-in user.
  protected currentUser$: Observable<User | null>;

  // Flag indicating whether the component is loading data.
  protected isLoading = true;

  // Search term for filtering courses.
  protected searchTerm = '';

  // Selected semester for filtering courses.
  protected selectedSemester = 'all';

  // Flag to show or hide the enrollment modal.
  protected showEnrollModal = false;

  // Current view type, either 'grid' or 'list'.
  protected view: 'grid' | 'list' = 'grid';

  // Statistics related to courses.
  protected stats = {
    totalCourses: 0, // Total number of courses.
    totalCredits: 0, // Total credits of all courses.
    currentSemesterCourses: 0 // Number of courses in the current semester.
  };

  constructor(
    private courseService: CourseService, 
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    // Assign the current user observable from the AuthService.
    this.currentUser$ = this.authService.currentUser;
  }

  /**
   * Lifecycle hook for initialization.
   * Subscribes to the courses observable and updates statistics when data changes.
   */
  ngOnInit() {
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
      this.isLoading = false;
      this.updateStats();
    });
  }

  /**
   * Lifecycle hook for cleanup.
   * Unsubscribes from the courses observable to prevent memory leaks.
   */
  ngOnDestroy() {
    if (this.coursesSubscription) {
      this.coursesSubscription.unsubscribe();
    }
  }

  /**
   * Formats the semester string into a readable format.
   * @param semester - The semester string to format.
   */
  formatSemester(semester: string): string {
    return formatSemester(semester);
  }

  /**
   * Returns a CSS class string based on the semester's season.
   * @param semester - The semester string.
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

  /**
   * Filters and sorts courses based on the search term and selected semester.
   */
  getFilteredCourses() {
    if (!this.courses) return [];
    
    let filtered = this.courses.filter(course => {
      const searchTerm = this.searchTerm.toLowerCase().trim();
      const matchesSearch = !searchTerm || 
        course.department.toLowerCase().includes(searchTerm) ||
        course.courseNumber.toString().includes(searchTerm) ||
        course.courseTitle.toLowerCase().includes(searchTerm);
      
      const matchesSemester = this.selectedSemester === 'all' || 
        course.semester === this.selectedSemester;
      
      return matchesSearch && matchesSemester;
    });

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

  /**
   * Opens the enrollment modal.
   */
  openEnrollModal() {
    this.showEnrollModal = true;
  }

  /**
   * Closes the enrollment modal.
   */
  closeEnrollModal() {
    this.showEnrollModal = false;
  }

  /**
   * Handles a successful enrollment action and shows a toast notification.
   * @param course - The course that the user enrolled in.
   */
  handleEnrollmentSuccess(course: Course) {
    this.toastService.show(
      'success',
      'Enrollment Successful',
      `You have been enrolled in ${course.courseTitle}`
    );
    this.courseService.getInstructorCourses(this.authService.getId()!);
  }

  /**
   * Toggles the view between grid and list modes.
   */
  toggleView() {
    this.view = this.view === 'grid' ? 'list' : 'grid';
  }

  /**
   * Updates the course statistics based on the current course list.
   */
  private updateStats() {
    if (!this.courses) return;
    
    const currentSemester = this.getCurrentSemester();
    this.stats = {
      totalCourses: this.courses.length,
      totalCredits: this.courses.reduce((sum, course) => sum + parseInt(course.credits), 0),
      currentSemesterCourses: this.courses.filter(c => c.semester === currentSemester).length
    };
  }

  /**
   * Determines the current semester based on the current date.
   */
  private getCurrentSemester(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    if (month < 6) return `spring${year}`;
    return `fall${year}`;
  }

  /**
   * Navigates to the chat page for a specific course.
   * @param course - The course to navigate to.
   */
  navigateToChat(course: Course) {
    this.router.navigate([`/chat/${course.semester}/${course.department}${course.courseNumber}-${course.section}`]);
  }

  /**
   * Handles user logout and redirects to the login page.
   */
  async handleLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      this.toastService.show(
        'error',
        'Logout Error',
        'Failed to logout properly. Please try again.'
      );
    }
  }
}
