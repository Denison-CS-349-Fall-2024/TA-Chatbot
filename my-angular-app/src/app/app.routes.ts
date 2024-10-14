import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InstructorPageComponent } from './pages/instructor-page/instructor-page.component';
import { AddTaPageComponent } from './pages/add-ta-page/add-ta-page.component';

export const routes: Routes = [
  {path: 'chat', component: ChatPageComponent},
  {path: '', component: LandingPageComponent},
  {path: 'instructor', component: InstructorPageComponent},
  {path: 'add-ta', component: AddTaPageComponent}
];
