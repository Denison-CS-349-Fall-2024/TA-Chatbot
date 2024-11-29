import { mapToCanActivate, Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InstructorPageComponent } from './pages/instructor-page/instructor-page.component';
import { AddTaPageComponent } from './pages/add-ta-page/add-ta-page.component';
import { ClassroomPageComponent } from './pages/classroom-page/classroom-page.component';
import { StudentDashboardPageComponent } from './pages/student-dashboard-page/student-dashboard-page.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { LoadingComponent } from './components/loading/loading.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'chat', component: ChatPageComponent},
  {path: 'chat/:semester/:courseAndSection', component: ChatPageComponent},
  {path: 'instructor-dashboard', component: InstructorPageComponent, canActivate: mapToCanActivate([AuthGuard, RoleGuard]), data: {role: "instructor", isProf: true}},
  {path: 'add-ta', component: AddTaPageComponent},
  {path: 'classroom', component: ClassroomPageComponent},
  {path: 'classroom/:semester/:courseAndSection', component: ClassroomPageComponent},
  {path: 'student-dashboard', component: StudentDashboardPageComponent, canActivate: mapToCanActivate([AuthGuard])},
  {path: 'loading-test', component: LoadingComponent}
];