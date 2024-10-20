import { Component } from '@angular/core';
import { AddMaterialModalComponent } from "../add-material-modal/add-material-modal.component";
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course-service/course.service';

@Component({
  selector: 'app-ta-materials',
  standalone: true,
  imports: [AddMaterialModalComponent],
  templateUrl: './ta-materials.component.html',
  styleUrl: './ta-materials.component.css'
})
export class TaMaterialsComponent {

  protected materialSubscription!: Subscription;
  protected materials!: string[];
  protected fileSelectedToDelete: number | null = null;

  constructor(private courseService: CourseService) {

  }

  ngOnInit(){
    this.materialSubscription = this.courseService.materials$.subscribe(materials => {
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
