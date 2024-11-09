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

  private dummyMessagesData = [{
    isSentByUser: true,
    content: "Can you tell me when the meetings time and location of the class? Also, when are the professor's office hours?"
  },
  {
    isSentByUser: false,
    content: "The class meets on Mondays, Wednesdays, and Fridays from 11:30 AM to 12:20 PM in Ebaugh 002. If you need to meet with the instructor, office hours are on Monday from 1:30 to 2:30 PM, Wednesday from 2:00 to 3:00 PM, and Friday from 10:00 to 11:00 AM, or you can arrange an appointment if needed."
  },]
  private messagesSource = new BehaviorSubject<Message[]>(this.dummyMessagesData);

  public messages$ = this.messagesSource.asObservable(); //Observables are what components listen to, observable variables should have $ sign in the variable name.

  constructor(private http: HttpClient) {

  }

  async getAllMessagess() {
    //TODO: once the backend is setup, we will want to send a request to the backend and get the messages for a
    //partiular user for a particular class chat. For now, let's just return the dummyMessageData array.
    this.messagesSource.next(this.dummyMessagesData);
  }
  async addMessage(newMessage: Message) {
    //TODO: Once the backend is up, send a asynchronous call to the backend to create a new message.
    this.messagesSource.next([...this.messagesSource.getValue(), newMessage]);
    this.http.get(`http://127.0.0.1:8000/api/chat/query/?question=${encodeURIComponent(newMessage.content)}`).subscribe(res =>{

      //@ts-ignore
      this.messagesSource.next([...this.messagesSource.getValue(), {content: res.response, isSentByUser: false}]);
    }
    )
    ;
  }
}
