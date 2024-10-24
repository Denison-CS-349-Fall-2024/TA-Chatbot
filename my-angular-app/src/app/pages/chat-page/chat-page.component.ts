import { Component } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  protected semester: string | null = null;
  protected courseAndSection: string | null = null;

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.semester = this.route.snapshot.paramMap.get('semester')
    this.courseAndSection = this.route.snapshot.paramMap.get('courseAndSection')
  }
}
