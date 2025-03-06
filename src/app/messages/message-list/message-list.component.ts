import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private messageSubscription: Subscription; // For handling the subscription

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Call getMessages to fetch the messages from the server
    this.messageService.getMessages();

    // Subscribe to the messageChangedEvent to get updated messages whenever the list changes
    this.messageSubscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages; // Update the messages list
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the event to prevent memory leaks
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
