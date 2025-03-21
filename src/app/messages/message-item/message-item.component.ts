import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string = 'Unknown Sender';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    if (!this.message?.sender) {
      console.error('Message sender is undefined:', this.message);
      return;
    }
  
    console.log('Raw sender:', this.message.sender);
  
    // Check if sender is an object with a name, otherwise handle it as an ID
    if (typeof this.message.sender === 'object' && this.message.sender.name) {
      this.messageSender = this.message.sender.name;
    } else if (typeof this.message.sender === 'string') {
      console.log('Sender is an ID, looking up:', this.message.sender);
      const contact = this.contactService.getContact(this.message.sender);
      this.messageSender = contact ? contact.name : 'Unknown Sender';
    } else {
      console.warn('Unexpected sender format:', this.message.sender);
    }
  }
}
