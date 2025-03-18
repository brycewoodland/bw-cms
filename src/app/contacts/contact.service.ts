import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  private mongoUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http.get<Contact[]>(this.mongoUrl).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts ? contacts : [];
        this.maxContactId = this.getMaxId();

        // Sort contacts by name
        this.contacts.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

        // Emit updated contact list
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    // Ensure new contact has no ID before sending it
    newContact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; contact: Contact }>(this.mongoUrl, newContact, { headers }).subscribe(
      (responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<{ message: string; contact: Contact }>(`${this.mongoUrl}/${originalContact.id}`, newContact, { headers }).subscribe(
      () => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }

  deleteContact(contact: Contact) {
    if (!contact || !contact.id) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(`${this.mongoUrl}/${contact.id}`).subscribe(
      () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      (error) => {
        console.error('Error deleting contact:', error);
      }
    );
  }

  storeContacts() {
    const contactsJson = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.mongoUrl, contactsJson, { headers }).subscribe(
      () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error storing contacts:', error);
      }
    );
  }

  private sortAndSend() {
    this.contacts.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
