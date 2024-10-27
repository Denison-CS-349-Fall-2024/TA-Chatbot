import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService, Message } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  @Input() semester: string | null = null;
  @Input() courseAndSection!: string | null
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
    if(this.userInput === "" || this.userInput.trim() === ""){
      return;
    }
    event.preventDefault();
    this.chatService.addMessage({ isSentByUser: true, content: this.userInput });
    this.userInput = "";
  }
  
}
