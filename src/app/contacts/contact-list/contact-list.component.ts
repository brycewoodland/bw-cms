import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';  // Import Subscription from rxjs
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  standalone: false,
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;  // Declare the subscription variable

  constructor(private contactService: ContactService) { 
    this.contacts = this.contactService.getContacts();
  }

  ngOnInit() {
      this.subscription = this.contactService.contactListChangedEvent.subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
      });
    }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
