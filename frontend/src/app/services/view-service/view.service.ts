import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private viewModeSubject = new BehaviorSubject<'instructor' | 'student'>('instructor');
  public viewMode$ = this.viewModeSubject.asObservable();

  setViewMode(mode: 'instructor' | 'student') {
    this.viewModeSubject.next(mode);
  }

  getViewMode() {
    return this.viewModeSubject.value;
  }
}