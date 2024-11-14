import { Component, Input } from '@angular/core';
import { AddMaterialModalComponent } from "../add-material-modal/add-material-modal.component";
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course-service/course.service';
import { Material } from '../../types/coursetypes';

@Component({
  selector: 'app-ta-materials',
  standalone: true,
  imports: [AddMaterialModalComponent],
  templateUrl: './ta-materials.component.html',
  styleUrl: './ta-materials.component.css'
})
export class TaMaterialsComponent {

  protected materialSubscription!: Subscription;
  protected materials!: Material[];
  protected fileSelectedToDelete: number | null = null;
  @Input() semester: string | null = null;
  @Input() courseAndSection: string | null = null;

  constructor(private courseService: CourseService) {

  }

  ngOnInit(){
    this.materialSubscription = this.courseService.materials$.subscribe((materials: Material[]) => {
      this.materials = materials
    })
  }

  deleteMaterial(){
    if (this.fileSelectedToDelete !== null){
      this.courseService.deleteMaterial(this.fileSelectedToDelete);
      this.fileSelectedToDelete = null;
    }
  }

  setFileSelectedToDelete(index: number){
    this.fileSelectedToDelete = index;
  }
}
