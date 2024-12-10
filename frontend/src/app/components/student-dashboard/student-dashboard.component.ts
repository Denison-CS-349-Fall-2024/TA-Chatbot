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

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EnrollmentModalComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  @Input() isInstructorView = false;
  protected courses!: Course[];
  protected coursesSubscription!: Subscription;
  protected currentUser$: Observable<User | null>;
  protected isLoading = true;
  protected searchTerm = '';
  protected selectedSemester = 'all';
  protected showEnrollModal = false;
  protected view: 'grid' | 'list' = 'grid';
  protected stats = {
    totalCourses: 0,
    totalCredits: 0,
    currentSemesterCourses: 0
  };

  constructor(
    private courseService: CourseService, 
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit() {
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
      this.isLoading = false;
      this.updateStats();
    });
  }

  ngOnDestroy() {
    if (this.coursesSubscription) {
      this.coursesSubscription.unsubscribe();
    }
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

  openEnrollModal() {
    this.showEnrollModal = true;
  }

  closeEnrollModal() {
    this.showEnrollModal = false;
  }

  handleEnrollmentSuccess(course: Course) {
    this.toastService.show(
      'success',
      'Enrollment Successful',
      `You have been enrolled in ${course.courseTitle}`
    );
    //TODO: change this to students courses:
    this.courseService.getInstructorCourses(this.authService.getId()!);
  }

  toggleView() {
    this.view = this.view === 'grid' ? 'list' : 'grid';
  }

  private updateStats() {
    if (!this.courses) return;
    
    const currentSemester = this.getCurrentSemester();
    this.stats = {
      totalCourses: this.courses.length,
      totalCredits: this.courses.reduce((sum, course) => sum + parseInt(course.credits), 0),
      currentSemesterCourses: this.courses.filter(c => c.semester === currentSemester).length
    };
  }

  private getCurrentSemester(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    if (month < 6) return `spring${year}`;
    return `fall${year}`;
  }

  navigateToChat(course: Course) {
    this.router.navigate([`/chat/${course.semester}/${course.department}${course.courseNumber}-${course.section}`]);
  }

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

