import { Component } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  selectedContact: Contact | null = null;
}