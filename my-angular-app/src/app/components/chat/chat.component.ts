import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  public chats = [{
    "isSentByUser": true,
    "content": "What is the lowest point in the world?"
},
{
    "isSentByUser": false,
    "content": "The lowest point on Earth's surface is the Challenger Deep, located in the Mariana Trench in the Pacific Ocean. It reaches a depth of about 36,000 feet (approximately 10,973 meters) below sea level. In terms of land, the lowest point is the shoreline of the Dead Sea, which lies around 1,410 feet (430 meters) below sea level."
},]


clickMe(event: Event){
  event.preventDefault()
  console.log("clicked")
}
}
