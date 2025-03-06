import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number;
  private firebaseUrl = 'https://bwcms-62379-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) { 
    this.maxMessageId = 0; // Initialize maxMessageId
    this.getMessages(); // Call to fetch messages when the service is initialized
  }

  getMessages() {
    this.http.get<Message[]>(`${this.firebaseUrl}/messages.json`).subscribe(
      (messages: Message[]) => {
        this.messages = messages ? messages : [];
        this.maxMessageId = this.getMaxId(); // Update maxMessageId
        this.messageChangedEvent.next(this.messages.slice());
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  getMessage(id: string): Message {
    return this.messages.find(message => message.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      const currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages(); // Save the updated messages list to the database
  }

  storeMessages() {
    const messagesArray = JSON.stringify(this.messages); // Convert the message list to string format
  
    // Ensure the URL ends with .json for Firebase compatibility
    const firebaseUrlWithJson = `${this.firebaseUrl}/messages.json`;
  
    this.http.put(firebaseUrlWithJson, messagesArray, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(
      () => {
        this.messageChangedEvent.next(this.messages.slice()); // Emit updated messages list
      },
      (error) => {
        console.error('Error saving messages:', error);
      }
    );
  }  
}
