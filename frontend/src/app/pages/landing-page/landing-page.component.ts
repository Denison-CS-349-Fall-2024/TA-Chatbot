import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { InstructorComponent } from '../../components/instructor/instructor.component';
import { StudentDashboardComponent } from '../../components/student-dashboard/student-dashboard.component';
import { Subscription } from 'rxjs';
import { User } from '../../types/usertype';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [StudentDashboardComponent, InstructorComponent, LoadingComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  protected currentUserSubscription!: Subscription;
  protected currentUser: User | null = null;

  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser.subscribe(user => this.currentUser = user);
  }
  constructor(private authService: AuthService){
  }
}
