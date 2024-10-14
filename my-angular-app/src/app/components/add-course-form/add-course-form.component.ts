import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddMaterialModalComponent } from '../add-material-modal/add-material-modal.component';

@Component({
  selector: 'app-add-course-form',
  standalone: true,
  imports: [FormsModule, AddMaterialModalComponent],
  templateUrl: './add-course-form.component.html',
  styleUrl: './add-course-form.component.css'
})
export class AddCourseFormComponent {

}
