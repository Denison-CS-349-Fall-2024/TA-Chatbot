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

  constructor(private courseService: CourseService) {
    
  }

  ngOnInit(){
    this.materialSubscription = this.courseService.materials$.subscribe(materials => {
      this.materials = materials
    })
  }
}
