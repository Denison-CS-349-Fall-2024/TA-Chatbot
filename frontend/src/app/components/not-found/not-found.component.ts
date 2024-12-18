import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';

/**
 * Component representing the "Not Found" page.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(
    private location: Location,
    private router: Router
  ) {}

  /**
   * Navigates back in the browser history or redirects to the home page.
   */
  goBack(): void {
    // Check if there's enough history to go back twice
    if (window.history.length > 2) {
      window.history.go(-2); // Go back 2 steps
    } else {
      // If not enough history exists, redirect to home
      this.router.navigate(['/']);
    }
  }
}