import { Component, Input } from '@angular/core';
import { TaMaterialsComponent } from "../../components/ta-materials/ta-materials.component";
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course-service/course.service';

@Component({
  selector: 'app-classroom-page',
  standalone: true,
  imports: [TaMaterialsComponent],
  templateUrl: './classroom-page.component.html',
  styleUrl: './classroom-page.component.css'
})
export class ClassroomPageComponent {

  protected semester: string | null = null;
  protected courseAndSection: string | null = null;

  constructor (private route: ActivatedRoute, private courseService: CourseService){
  }

  ngOnInit(){
    this.semester = this.route.snapshot.paramMap.get("semester");
    this.courseAndSection = this.route.snapshot.paramMap.get("courseAndSection");
    this.courseService.fetchMaterials(this.semester!, this.courseAndSection!);

  }
}
