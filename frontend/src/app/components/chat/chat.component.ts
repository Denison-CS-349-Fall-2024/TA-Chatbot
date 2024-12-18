import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService, Message } from '../../services/chat-service/chat.service';
import { formatSemester } from '../../utils/format';

/**
 * Interface representing the chat history for grouping messages by date.
 */
interface ChatHistory {
  date: string; // The date of the chat messages.
  messages: Message[]; // Array of messages sent on the given date.
}

@Component({
  selector: 'app-chat', // Selector for the chat component.
  standalone: true, // Indicates the component is standalone and not part of a module.
  imports: [FormsModule, CommonModule], // Modules used within this component.
  template: `
  <!-- Template for chat UI -->
  <div [class]="'min-h-screen bg-gray-50 ' + (darkMode ? 'dark' : '')" class="w-full flex justify-center p-4">
    <div class="flex w-full max-w-4xl flex-col bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      
      <!-- Chat Header -->
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <!-- Header Content -->
        <div class="flex items-center space-x-4">
          <!-- User/Assistant Icon -->
          <div class="relative">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-semibold text-lg">TA</span>
            </div>
            <!-- Online Indicator -->
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <!-- Chat Details -->
          <div>
            <h2 class="text-xl font-bold dark:text-white">
              {{ courseAndSection }} Assistant
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatSemester(semester) }}</p>
          </div>
        </div>
        
        <!-- Settings Menu -->
        <div class="flex items-center space-x-2">
          <!-- Dark Mode Toggle -->
          <button (click)="toggleDarkMode()" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <!-- Icon for toggling dark/light mode -->
            </svg>
          </button>
          <!-- Settings Button -->
          <div class="relative">
            <button class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <!-- Settings Icon -->
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages Container -->
      <div #messageContainer class="flex-1 overflow-y-auto p-4 space-y-4"
           [class.text-sm]="fontSize === 'small'"
           [class.text-base]="fontSize === 'medium'"
           [class.text-lg]="fontSize === 'large'">
        
        <!-- Group messages by date -->
        <div *ngFor="let dayGroup of chatHistory" class="space-y-4">
          <!-- Date Separator -->
          <div class="flex justify-center">
            <span class="px-4 py-1 text-xs text-gray-500 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400">
              {{ dayGroup.date }}
            </span>
          </div>

          <!-- Individual Messages -->
          <div *ngFor="let message of dayGroup.messages" 
               [class]="message.isSentByUser ? 'flex flex-row-reverse' : 'flex'">
            <div [class]="'max-w-[80%] ' + (message.isSentByUser ? 'ml-auto' : 'mr-auto')">
              <div class="flex items-end space-x-2">
                <!-- Display TA Icon for incoming messages -->
                <div *ngIf="!message.isSentByUser" 
                     class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 text-sm">TA</span>
                </div>
                <!-- Message Content -->
                <div [class]="message.isSentByUser ? 
                             'bg-primary-600 text-white rounded-l-xl rounded-tr-xl' : 
                             'bg-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl dark:bg-gray-700 dark:text-white'"
                     class="p-4 shadow-sm max-w-xl">
                  <p class="whitespace-pre-wrap">{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div *ngIf="isTyping" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-primary-600 text-sm">TA</span>
          </div>
          <div class="bg-gray-100 rounded-xl p-4 dark:bg-gray-700">
            <div class="flex space-x-2">
              <!-- Animation for typing dots -->
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t dark:border-gray-700 p-4">
        <form class="flex items-center space-x-4" (submit)="sendMessage($event)">
          <!-- Input Field -->
          <input autocomplete="off" #chatInput
                 [(ngModel)]="userInput"
                 name="message"
                 type="text"
                 class="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                 placeholder="Type your message..."
                 [disabled]="isTyping">

          <!-- Send Button -->
          <button type="submit"
                  [disabled]="isTyping || !userInput.trim()"
                  class="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200">
            <svg class="w-6 h-6 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
`,
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked {
  @Input() semester!: string; // The current semester.
  @Input() courseAndSection!: string; // The course and section identifier.
  @ViewChild('messageContainer') private messageContainer!: ElementRef; // Reference to the message container for scrolling.
  @ViewChild('chatInput') private chatInput!: ElementRef; // Reference to the input field for auto-focus.

  public messagesSubscription!: Subscription; // Subscription for chat messages.
  public messages!: Message[]; // Array of messages.
  public userInput: string = ""; // User input for sending messages.
  public isTyping: boolean = false; // Indicates if the TA is typing.
  public showEmojiPicker: boolean = false; // Flag for emoji picker visibility.
  public darkMode: boolean = false; // Flag for toggling dark mode.
  public fontSize: 'small' | 'medium' | 'large' = 'medium'; // Font size for chat messages.
  public chatHistory: ChatHistory[] = []; // Grouped chat messages by date.

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages; // Update messages.
      this.groupMessagesByDate(); // Group messages by date.
    });

    setTimeout(() => this.chatInput?.nativeElement.focus(), 0); // Auto-focus input.
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // Automatically scroll to the bottom when view updates.
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  async sendMessage(event: Event) {
    event.preventDefault(); // Prevent default form submission.
    if (this.userInput.trim() === "") return;

    try {
      const userMessage = { isSentByUser: true, content: this.userInput };
      this.userInput = ""; // Clear input after sending.
      this.isTyping = true; // Set typing indicator.
      await this.chatService.addMessage(userMessage, this.semester, this.courseAndSection); // Send message.
    } catch (error) {
      console.error(error); // Handle errors.
    } finally {
      this.isTyping = false; // Ensure typing indicator resets.
    }
  }

  groupMessagesByDate() {
    // Group messages by date for rendering.
    this.chatHistory = [];
    let currentDate = '';

    this.messages.forEach(message => {
      const messageDate = new Date().toLocaleDateString(); // Group by date.
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        this.chatHistory.push({ date: messageDate, messages: [] });
      }
      this.chatHistory[this.chatHistory.length - 1].messages.push(message);
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode; // Toggle dark mode.
  }

  changeFontSize(size: 'small' | 'medium' | 'large') {
    this.fontSize = size; // Update font size for messages.
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0]; // Access the uploaded file.
    // Add file upload handling logic.
  }

  formatSemester(semester: string): string {
    return formatSemester(semester); // Format the semester string.
  }
}
