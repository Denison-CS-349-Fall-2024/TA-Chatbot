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

  show(type: ToastType, title: string, message: string, duration: number = 5000) {
    const id = this.counter++;
    const toast = { type, title, message, id };
    
    this.toasts.next([...this.toasts.value, toast]);
    
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
    
    return id;
  }

  dismiss(id: number) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}