import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AddCoursePageComponent } from './pages/add-course-page/add-course-page.component';

export const routes: Routes = [
  {path: 'chat', component: ChatPageComponent},
  {path: 'add-course', component: AddCoursePageComponent},
  {path: '', component: LandingPageComponent},
];
