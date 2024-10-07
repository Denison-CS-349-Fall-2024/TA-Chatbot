import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  public chats = [{
    "isSentByUser": true,
    "content": "Can you tell me when the meetings time and location of the class? Also, when are the professor's office hours?"
},
{
    "isSentByUser": false,
    "content": "The class meets on Mondays, Wednesdays, and Fridays from 11:30 AM to 12:20 PM in Ebaugh 002. If you need to meet with the instructor, office hours are on Monday from 1:30 to 2:30 PM, Wednesday from 2:00 to 3:00 PM, and Friday from 10:00 to 11:00 AM, or you can arrange an appointment if needed."
},]

public userInput: string = "";

clickMe(event: Event){
  event.preventDefault()
  console.log("clicked")
}
sendMessage(event: Event){
  event.preventDefault();
  this.chats.push({isSentByUser: true, content: this.userInput});
  this.userInput = "";
}
}
