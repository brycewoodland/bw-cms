import { Component , OnInit} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [];

  ngOnInit(): void {
    this.messages = [
      new Message('1', 'Hello World', 'This is a test message.', 'Alice'),
      new Message('2', 'Angular Rocks', 'Angular is a great framework for building web applications.', 'Bob'),
      new Message('3', 'TypeScript', 'TypeScript adds static typing to JavaScript.', 'Charlie')
    ];
  }

  onAddMessage(message: Message): void {
    this.messages.push(message);
  }
}
