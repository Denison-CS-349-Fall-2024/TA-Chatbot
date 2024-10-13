import { Component } from '@angular/core';
import { AddCourseFormComponent } from '../../components/add-course-form/add-course-form.component';

@Component({
  selector: 'app-add-course-page',
  standalone: true,
  imports: [AddCourseFormComponent],
  templateUrl: './add-course-page.component.html',
  styleUrl: './add-course-page.component.css'
})
export class AddCoursePageComponent {

}
