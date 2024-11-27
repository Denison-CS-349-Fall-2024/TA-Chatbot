import { Component, Input } from '@angular/core';
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
    department: string;
    courseNumber: string;
  }  =  {
    name: "",
    section: "",
    department: "N/A",
    courseNumber: ""
  }
  constructor(private courseService: CourseService){}

  async addCourse(){
    await this.courseService.addCourse(this.addCourseData.name, this.addCourseData.section, this.addCourseData.department, this.addCourseData.courseNumber)
  }
}
