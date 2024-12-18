import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { InstructorComponent } from '../../components/instructor/instructor.component';
import { StudentDashboardComponent } from '../../components/student-dashboard/student-dashboard.component';
import { Subscription } from 'rxjs';
import { User } from '../../types/usertype';
import { LoadingComponent } from '../../components/loading/loading.component';

/**
 * Component representing the landing page.
 */
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [StudentDashboardComponent, InstructorComponent, LoadingComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  protected currentUserSubscription!: Subscription;
  protected currentUser: User | null = null;

  /**
   * Initializes the component and subscribes to the current user.
   */
  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => this.currentUser = user);
  }

  constructor(private authService: AuthService) {}
}