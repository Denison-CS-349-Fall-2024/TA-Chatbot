import { Component, Input } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  @Input() semester = "";
  @Input() courseAndSection = "";

  constructor(private route: ActivatedRoute, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.semester = this.route.snapshot.paramMap.get('semester')!
    this.courseAndSection = this.route.snapshot.paramMap.get('courseAndSection')!
  }
}
