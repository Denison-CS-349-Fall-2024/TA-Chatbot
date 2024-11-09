import { Component } from '@angular/core';
import { AddMaterialModalComponent } from '../add-material-modal/add-material-modal.component';
import { TaMaterialsComponent } from "../ta-materials/ta-materials.component";
import { CourseService } from '../../services/course-service/course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-ta',
  standalone: true,
  imports: [FormsModule, AddMaterialModalComponent, TaMaterialsComponent],
  templateUrl: './add-ta-form.component.html',
  styleUrl: './add-ta-form.component.css'
})
export class AddTaFormComponent {

  protected addCourseData: {
    name: string;
    section: string;
    pin: number;
    professor_id: string;
  }  =  {
    name: "",
    section: "",
    pin: 0,
    professor_id: "1",
  }
  constructor(private courseService: CourseService){}

  async addCourse(){
    console.log(this.addCourseData);
    await this.courseService.addCourse({name: this.addCourseData.name, section: this.addCourseData.section, pin: 1234, professor_id: this.addCourseData.professor_id,})
  }
}
