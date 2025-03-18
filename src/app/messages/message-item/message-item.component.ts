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
    if (!this.message) {
      console.error('Message is undefined in MessageItemComponent');
      return;
    }

    if (!this.message.sender) {
      console.error('Message sender is undefined:', this.message);
      return;
    }

    console.log('Raw sender:', this.message.sender);

    // If sender is already a populated object, use its name
    if (typeof this.message.sender === 'object' && this.message.sender.name) {
      this.messageSender = this.message.sender.name;
      return;
    }

    // Otherwise, assume it's an ID and look it up
    const senderId = this.message.sender.toString();
    console.log('Looking up sender ID:', senderId);

    const contact = this.contactService.getContact(senderId);
    if (contact) {
      this.messageSender = contact.name;
    } else {
      console.warn('No contact found for sender ID:', senderId);
    }
  }
}
