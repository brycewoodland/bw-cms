import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInputRef!: ElementRef;
  @ViewChild('msgText') msgTextInputRef!: ElementRef;

  currentSender: string = '1';

  constructor(private messageService: MessageService) {}

  onSendMessage(): void{
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const newMessage = new Message(
      '1',
      subject, 
      msgText, 
      this.currentSender
    );
    
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear(): void {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
