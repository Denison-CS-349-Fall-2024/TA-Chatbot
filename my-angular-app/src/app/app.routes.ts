import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  {path: 'chat', component: ChatPageComponent},
  {path: '', component: LandingPageComponent},
];
