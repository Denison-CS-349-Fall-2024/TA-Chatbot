import { Component } from '@angular/core';
import { AccessRestrictedComponent } from '../../components/access-restricted/access-restricted.component';

/**
 * Component representing the access restricted page.
 */
@Component({
  selector: 'app-access-restricted-page',
  standalone: true,
  imports: [AccessRestrictedComponent],
  templateUrl: './access-restricted-page.component.html',
  styleUrls: ['./access-restricted-page.component.css']
})
export class AccessRestrictedPageComponent {
  // Component logic goes here
}