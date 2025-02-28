import { Component } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent {
  contact: Contact;
  groupContacts: Contact[];


  onSubmit(form: NgForm) {

  }

  onCancel() {

  }
}
