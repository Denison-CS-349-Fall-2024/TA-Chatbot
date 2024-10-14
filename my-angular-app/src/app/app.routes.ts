import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { StudentDashboardPageComponent } from './pages/student-dashboard-page/student-dashboard-page.component';

export const routes: Routes = [
  {path: 'chat', component: ChatPageComponent},
  {path: '', component: LandingPageComponent},
  {path: 'student-dashboard', component: StudentDashboardPageComponent}
];
