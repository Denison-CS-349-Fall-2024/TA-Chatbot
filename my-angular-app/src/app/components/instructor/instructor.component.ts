import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Course } from '../../types/coursetypes';
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course-service/course.service';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class InstructorComponent {

  protected courses!: Course[];
  protected coursesSubscription!: Subscription;

  constructor(private courseService: CourseService){}

  ngOnInit(){
    this.coursesSubscription = this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
    })
  }

}
