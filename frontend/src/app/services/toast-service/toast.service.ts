import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastType } from '../../components/toast/toast.component';

interface Toast {
  type: ToastType;
  title: string;
  message: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();
  private counter = 0;

  /**
   * Shows a toast notification.
   * 
   * @param type - The type of the toast (e.g., success, error).
   * @param title - The title of the toast.
   * @param message - The message of the toast.
   * @param duration - The duration the toast should be displayed (default is 5000ms).
   * @returns The ID of the toast.
   */
  show(type: ToastType, title: string, message: string, duration: number = 5000): number {
    const id = this.counter++;
    const toast = { type, title, message, id };
    
    this.toasts.next([...this.toasts.value, toast]);
    
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
    
    return id;
  }

  /**
   * Dismisses a toast notification by its ID.
   * 
   * @param id - The ID of the toast to dismiss.
   */
  dismiss(id: number) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}