import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class InstructorComponent {
  classList: string[] = [];

  addClass(){
    const newClassNumber = this.classList.length + 1;
    this.classList.push(`Class ${newClassNumber}`);
  }

}
