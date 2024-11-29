import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewPreferenceService {
  private readonly VIEW_PREFERENCE_KEY = 'courseViewPreference';
  private viewModeSubject = new BehaviorSubject<'grid' | 'list'>('grid');
  public viewMode$ = this.viewModeSubject.asObservable();

  constructor(private cookieService: CookieService) {
    this.initializeViewPreference();
  }

  private initializeViewPreference() {
    const savedPreference = this.cookieService.get(this.VIEW_PREFERENCE_KEY) as 'grid' | 'list';
    if (savedPreference) {
      this.viewModeSubject.next(savedPreference);
    }
  }

  setViewMode(mode: 'grid' | 'list') {
    this.cookieService.set(this.VIEW_PREFERENCE_KEY, mode, 365); // Expires in 1 year
    this.viewModeSubject.next(mode);
  }

  getViewMode(): 'grid' | 'list' {
    return this.viewModeSubject.value;
  }
}
