import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { csrfInterceptor } from './app/interceptors/csrf/csrf.interceptor';


bootstrapApplication(AppComponent, {
...appConfig,
  providers: [
    ...appConfig.providers ?? [], // Spread existing providers from appConfig if any
    provideHttpClient(
      withInterceptors([csrfInterceptor])
    ),
  ]
}).catch((err) => console.error(err));