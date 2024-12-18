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

  constructor(private http: HttpClient) {}

  /**
   * Clears all messages.
   */
  async getAllMessages() {
    this.messagesSource.next([]);
  }

  /**
   * Adds a new message and sends it to the server.
   * 
   * @param newMessage - The new message to add.
   * @param semester - The semester of the course.
   * @param courseAndSection - The course and section identifier.
   * @returns A promise that resolves when the message is sent.
   */
  async addMessage(newMessage: Message, semester: string, courseAndSection: string): Promise<void> {
    this.messagesSource.next([...this.messagesSource.getValue(), newMessage]);

    return new Promise((resolve, reject) => {
      this.http.post<{response: string}>(`${environment.apiEndpoint}/api/chat/query/`, {class_id: courseAndSection, query: newMessage.content}).subscribe((res) => {
        this.messagesSource.next([...this.messagesSource.getValue(), {content: res.response, isSentByUser: false}]);
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }
}