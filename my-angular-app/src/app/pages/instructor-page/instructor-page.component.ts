import { Component } from '@angular/core';
import { InstructorComponent } from '../../components/instructor/instructor.component';

@Component({
  selector: 'app-instructor-page',
  standalone: true,
  imports: [InstructorComponent],
  templateUrl: './instructor-page.component.html',
  styleUrl: './instructor-page.component.css'
})
export class InstructorPageComponent {
}
