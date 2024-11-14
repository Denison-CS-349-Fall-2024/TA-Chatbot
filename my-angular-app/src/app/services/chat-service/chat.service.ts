import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Message = {
  isSentByUser: boolean,
  content: string
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSource = new BehaviorSubject<Message[]>([]);

  public messages$ = this.messagesSource.asObservable(); //Observables are what components listen to, observable variables should have $ sign in the variable name.

  constructor(private http: HttpClient) {

  }

  async getAllMessagess() {
    //TODO: once the backend is setup, we will want to send a request to the backend and get the messages for a
    //partiular user for a particular class chat. For now, let's just return the dummyMessageData array.
    this.messagesSource.next([]);
  }
  async addMessage(newMessage: Message, semester: string, courseAndSection: string) {
    //TODO: Once the backend is up, send a asynchronous call to the backend to create a new message.
    this.messagesSource.next([...this.messagesSource.getValue(), newMessage]);
    this.http.post<{response: string}>("http://127.0.0.1:8000/api/chat/query/", {class_id: courseAndSection, query: newMessage.content}).subscribe((res) => {
      this.messagesSource.next([...this.messagesSource.getValue(), {content: res.response, isSentByUser: false}])
    });
  }
}
