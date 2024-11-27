import { Component } from '@angular/core';
import { StudentDashboardComponent } from '../../components/student-dashboard/student-dashboard.component';

@Component({
  selector: 'app-student-dashboard-page',
  standalone: true,
  imports: [StudentDashboardComponent],
  templateUrl: './student-dashboard-page.component.html',
  styleUrl: './student-dashboard-page.component.css'
})
export class StudentDashboardPageComponent {

}
