import { Component } from '@angular/core';
import { StudentDashboardComponent } from '../../components/student-dashboard/student-dashboard.component';

/**
 * Component representing the student dashboard page.
 */
@Component({
  selector: 'app-student-dashboard-page',
  standalone: true,
  imports: [StudentDashboardComponent],
  templateUrl: './student-dashboard-page.component.html',
  styleUrls: ['./student-dashboard-page.component.css']
})
export class StudentDashboardPageComponent {

}