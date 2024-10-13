import { Component } from '@angular/core';
import { CreateClassComponent } from '../../components/create-class/create-class.component';

@Component({
  selector: 'app-create-class-pages',
  standalone: true,
  imports: [CreateClassComponent],
  templateUrl: './create-class-pages.component.html',
  styleUrl: './create-class-pages.component.css'
})
export class CreateClassPagesComponent {

}
