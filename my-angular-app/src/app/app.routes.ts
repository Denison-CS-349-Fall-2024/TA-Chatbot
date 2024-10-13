import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InstructorPageComponent } from './pages/instructor-page/instructor-page.component';
import { CreateClassPagesComponent } from './pages/create-class-pages/create-class-pages.component';



export const routes: Routes = [
  {path: 'create-class', component: CreateClassPagesComponent},
  {path: 'chat', component: ChatPageComponent},
  {path: '', component: LandingPageComponent},
  {path: 'instructor', component: InstructorPageComponent},
  
];
