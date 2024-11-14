import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Course } from '../../types/coursetypes';
import { CourseService } from '../../services/course-service/course.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { User } from '../../types/usertype';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {

  protected courses!: Course[];
  protected coursesSubscription!: Subscription;
  protected currentUser$: Observable<User | null>;

  constructor(private courseService: CourseService, private authService: AuthService){
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(){
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
    })
  }
}

