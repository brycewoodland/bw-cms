import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string = '';

  constructor(private ContactService: ContactService) {}

  ngOnInit(): void {
    if (!this.message) {
      console.error('Message is undefined in MessageItemComponent');
      return;
    }
  
    if (!this.message.sender) {
      console.error('Message sender is undefined:', this.message);
      return;
    }
  
    console.log('Raw sender ID:', this.message.sender);
  
    // Convert sender ID to string (if necessary)
    const senderId = this.message.sender.toString();  
  
    console.log('Converted sender ID:', senderId);
  
    const contact: Contact = this.ContactService.getContact(senderId);
  
    if (!contact) {
      console.warn('No contact found for sender ID:', senderId);
      return;
    }
  
    this.messageSender = contact.name;
  }  
}
