import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private viewModeSubject = new BehaviorSubject<'instructor' | 'student'>('instructor');
  public viewMode$ = this.viewModeSubject.asObservable();

  /**
   * Sets the view mode.
   * 
   * @param mode - The view mode to set ('instructor' or 'student').
   */
  setViewMode(mode: 'instructor' | 'student') {
    this.viewModeSubject.next(mode);
  }

  /**
   * Gets the current view mode.
   * 
   * @returns The current view mode.
   */
  getViewMode() {
    return this.viewModeSubject.value;
  }
}