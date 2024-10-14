import { Component } from '@angular/core';
import { AddMaterialModalComponent } from '../add-material-modal/add-material-modal.component';

@Component({
  selector: 'app-add-ta',
  standalone: true,
  imports: [AddMaterialModalComponent],
  templateUrl: './add-ta-form.component.html',
  styleUrl: './add-ta-form.component.css'
})
export class AddTaFormComponent {

}
