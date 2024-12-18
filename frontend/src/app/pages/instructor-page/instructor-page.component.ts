import { Component } from '@angular/core';
import { InstructorComponent } from '../../components/instructor/instructor.component';

/**
 * Component representing the instructor page.
 */
@Component({
  selector: 'app-instructor-page',
  standalone: true,
  imports: [InstructorComponent],
  templateUrl: './instructor-page.component.html',
  styleUrls: ['./instructor-page.component.css']
})
export class InstructorPageComponent {
}