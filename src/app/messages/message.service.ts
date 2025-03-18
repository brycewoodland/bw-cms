import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { Contact } from '../contacts/contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = []; // Initialize with an empty array
  messageSelectedEvent = new EventEmitter<Message>();
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;
  private mongoUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http.get<Message[]>(`${this.mongoUrl}`).subscribe(
      (messages: Message[]) => {
        this.messages = messages ? messages : [];
        this.maxMessageId = this.getMaxId();
  
        // Fetch contacts separately to resolve sender names
        this.http.get<Contact[]>('http://localhost:3000/contacts').subscribe((contacts) => {
          this.messages.forEach(msg => {
            const senderContact = contacts.find(c => c.id === msg.sender);
            if (senderContact) {
              msg.sender = senderContact; // Replace ObjectId with actual Contact
            }
          });
  
          this.sortAndSend();
        });
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }
  

  getMessage(id: string): Message | null {
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

    // Ensure the new message has no ID (to let backend assign it)
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; newMessage: Message }>(
      `${this.mongoUrl}`,
      message,
      { headers }
    ).subscribe(
      (responseData) => {
        this.messages.push(responseData.newMessage);
        this.sortAndSend();
      },
      (error) => {
        console.error('Error adding message:', error);
      }
    );
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) {
      return;
    }

    // Ensure the updated message keeps the same ID
    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<{ message: string; updatedMessage: Message }>(
      `${this.mongoUrl}/${originalMessage.id}`,
      newMessage,
      { headers }
    ).subscribe(
      (response) => {
        this.messages[pos] = response.updatedMessage;
        this.sortAndSend();
      },
      (error) => {
        console.error('Error updating message:', error);
      }
    );
  }

  deleteMessage(message: Message) {
    if (!message || !message.id) {
      return;
    }

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(`${this.mongoUrl}/${message.id}`).subscribe(
      () => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }

  storeMessages() {
    const messagesJson = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(`${this.mongoUrl}/messages.json`, messagesJson, { headers }).subscribe(
      () => {
        this.messageListChangedEvent.next(this.messages.slice());
      },
      (error) => {
        console.error('Error storing messages:', error);
      }
    );
  }

  private sortAndSend() {
    this.messages.sort((a, b) => (a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0));
    this.messageListChangedEvent.next(this.messages.slice());
  }
}
