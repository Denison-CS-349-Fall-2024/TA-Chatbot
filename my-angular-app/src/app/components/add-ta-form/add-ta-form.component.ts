import { Component } from '@angular/core';
import { AddMaterialModalComponent } from '../add-material-modal/add-material-modal.component';
import { TaMaterialsComponent } from "../ta-materials/ta-materials.component";
import { CourseService } from '../../services/course-service/course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-ta',
  standalone: true,
  imports: [AddMaterialModalComponent, TaMaterialsComponent, FormsModule],
  templateUrl: './add-ta-form.component.html',
  styleUrl: './add-ta-form.component.css'
})
export class AddTaFormComponent {

  constructor(private courseService: CourseService){}

  async addCourse(){
    await this.courseService.addCourse({name: "string", section: 123, pin: 1234, professor: "string",})
  }
}
