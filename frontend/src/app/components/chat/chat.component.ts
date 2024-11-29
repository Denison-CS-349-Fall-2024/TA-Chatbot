import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService, Message } from '../../services/chat-service/chat.service';

interface ChatHistory {
  date: string;
  messages: Message[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked {
  @Input() semester!: string;
  @Input() courseAndSection!: string;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  public messagesSubscription!: Subscription;
  public messages!: Message[];
  public userInput: string = "";
  public isTyping: boolean = false;
  public showEmojiPicker: boolean = false;
  public darkMode: boolean = false;
  public fontSize: 'small' | 'medium' | 'large' = 'medium';
  public chatHistory: ChatHistory[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      this.groupMessagesByDate();
    });

    // Auto-focus the input field
    setTimeout(() => this.chatInput?.nativeElement.focus(), 0);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  async sendMessage(event: Event) {
    event.preventDefault();
    if(this.userInput.trim() === "") return;

    const userMessage = { isSentByUser: true, content: this.userInput };
    this.chatService.addMessage(userMessage, this.semester, this.courseAndSection);
    this.userInput = "";
    
    // Show typing indicator
    this.isTyping = true;
    
    try {
      // Simulate API call delay (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add bot response
      const botResponse = { isSentByUser: false, content: "Sample response" };
      this.chatService.addMessage(botResponse, this.semester, this.courseAndSection);
    } finally {
      this.isTyping = false;
    }
  }

  groupMessagesByDate() {
    // Group messages by date for the timeline view
    this.chatHistory = [];
    let currentDate = '';
    
    this.messages.forEach(message => {
      const messageDate = new Date().toLocaleDateString(); // Replace with message.timestamp
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        this.chatHistory.push({ date: messageDate, messages: [] });
      }
      this.chatHistory[this.chatHistory.length - 1].messages.push(message);
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    // Add logic to persist user preference
  }

  changeFontSize(size: 'small' | 'medium' | 'large') {
    this.fontSize = size;
  }

  // Handle file upload
  handleFileUpload(event: any) {
    const file = event.target.files[0];
    // Implement file upload logic
  }
}
