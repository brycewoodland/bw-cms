import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(this.id);

      if (!this.originalContact) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      this.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      value.group
    );

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  // Handle the drop event when a contact is dropped in the drop zone
  onDrop(event: CdkDragDrop<Contact[]>) {
    const contact = event.item.data as Contact;  // The contact being dragged

    // Check if the contact is already in the group
    if (!this.isContactInGroup(contact)) {
      this.groupContacts.push(contact);  // Add it to groupContacts if not already present
    }
  }

  // Check if the contact is already in the group
  isContactInGroup(contact: Contact): boolean {
    return this.groupContacts.some(c => c.id === contact.id);
  }

  onRemoveItem(index: number) {
    this.groupContacts.splice(index, 1);  // Remove a contact from the group
  }
}
