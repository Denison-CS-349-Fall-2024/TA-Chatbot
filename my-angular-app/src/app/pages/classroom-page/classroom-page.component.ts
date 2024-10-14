import { Component } from '@angular/core';
import { TaMaterialsComponent } from "../../components/ta-materials/ta-materials.component";

@Component({
  selector: 'app-classroom-page',
  standalone: true,
  imports: [TaMaterialsComponent],
  templateUrl: './classroom-page.component.html',
  styleUrl: './classroom-page.component.css'
})
export class ClassroomPageComponent {

}
