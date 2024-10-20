import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Course } from '../../types/coursetypes';
import { CourseService } from '../../services/course-service/course.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  public student: string = "Liam"

  protected courses!: Course[];
  protected coursesSubscription!: Subscription;

  constructor(private courseService: CourseService){}

  ngOnInit(){
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
    })
  }
}

