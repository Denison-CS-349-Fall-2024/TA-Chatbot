import { Component } from "@angular/core";
import { ClassroomComponent } from "../../components/classroom/classroom.component";
import { CourseService } from "../../services/course-service/course.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingComponent } from "../../components/loading/loading.component";


@Component({
  selector: 'app-classroom-page',
  standalone: true,
  imports: [ClassroomComponent, LoadingComponent],
  templateUrl: './classroom-page.component.html',
  styleUrl: './classroom-page.component.css'
})
export class ClassroomPageComponent{
  
  protected isLoading = true;
  protected semester!: string;
  protected courseAndSection!: string;

  constructor(
    protected courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    this.semester = this.route.snapshot.paramMap.get("semester")!;
    this.courseAndSection = this.route.snapshot.paramMap.get("courseAndSection")!;
    try{
      await this.courseService.fetchMaterials(this.semester, this.courseAndSection);
    } catch (error) {
      this.router.navigate(['/not-found']);
    } finally {
      this.isLoading = false;
    }
  }
}
