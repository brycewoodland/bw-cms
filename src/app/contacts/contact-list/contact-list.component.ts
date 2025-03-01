import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  standalone: false,
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;
  
  // This output will emit the dragged contact to the parent (ContactEditComponent)
  @Output() contactDropped = new EventEmitter<Contact>();

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contacts = this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    const draggedContact: Contact = event.item.data;  // Get the contact from the dragged item

    // Emit the dragged contact to parent (ContactEditComponent)
    this.contactDropped.emit(draggedContact);
  }  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}