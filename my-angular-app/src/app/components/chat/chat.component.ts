import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService, Message } from '../../services/chat-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(private chatService: ChatService) {}

  public messagesSubscription!: Subscription;
  public messages!: Message[];

  public userInput: string = "";

  ngOnInit() {
    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
    })
  }


  sendMessage(event: Event) {
    event.preventDefault();
    this.chatService.addMessage({ isSentByUser: true, content: this.userInput });
    this.userInput = "";
  }
}
