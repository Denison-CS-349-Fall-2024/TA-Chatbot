import { Component } from '@angular/core';
import { AccessRestrictedComponent } from '../../components/access-restricted/access-restricted.component';
@Component({
  selector: 'app-access-restricted-page',
  standalone: true,
  imports: [AccessRestrictedComponent],
  templateUrl: './access-restricted-page.component.html',
  styleUrl: './access-restricted-page.component.css'
})
export class AccessRestrictedPageComponent {

}
