import { Component } from '@angular/core';
import { AddTaFormComponent } from '../../components/add-ta-form/add-ta-form.component';

@Component({
  selector: 'app-add-ta-page',
  standalone: true,
  imports: [AddTaFormComponent],
  templateUrl: './add-ta-page.component.html',
  styleUrl: './add-ta-page.component.css'
})
export class AddTaPageComponent {

}
