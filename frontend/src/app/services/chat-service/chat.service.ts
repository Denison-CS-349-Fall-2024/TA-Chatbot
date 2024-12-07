import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment/environment';

export type Message = {
  isSentByUser: boolean,
  content: string
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSource = new BehaviorSubject<Message[]>([]);

  public messages$ = this.messagesSource.asObservable();

  constructor(private http: HttpClient) {

  }

  async getAllMessagess() {
    this.messagesSource.next([]);
  }
  async addMessage(newMessage: Message, semester: string, courseAndSection: string): Promise<void> {

    this.messagesSource.next([...this.messagesSource.getValue(), newMessage]);

    return new Promise((resolve, reject) => {
      this.http.post<{response: string}>(`${environment.apiEndpoint}/api/chat/query/`, {class_id: courseAndSection, query: newMessage.content}).subscribe((res) => {
        this.messagesSource.next([...this.messagesSource.getValue(), {content: res.response, isSentByUser: false}])
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }
}
