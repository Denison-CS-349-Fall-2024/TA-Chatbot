import { Component } from '@angular/core';
import { AddMaterialModalComponent } from "../add-material-modal/add-material-modal.component";

@Component({
  selector: 'app-ta-materials',
  standalone: true,
  imports: [AddMaterialModalComponent],
  templateUrl: './ta-materials.component.html',
  styleUrl: './ta-materials.component.css'
})
export class TaMaterialsComponent {
  protected materials: string[] = ["Reading assignment 1", "Quiz 1", "Quiz 2", "Mid Term"]
}
