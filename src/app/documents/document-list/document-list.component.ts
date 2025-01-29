import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [
    new Document(
      '1', 
      'CIT 260 - Object Oriented Programming', 
      'Learn the fundamentals of OOP.', 
      'http://example.com/doc1'
    ),
    new Document(
      '2', 
      'CIT 366 - Full Web Stack Development', 
      'Learn how to develop modern web applications using the MEAN stack.', 
      'http://example.com/doc2'
    ),
    new Document(
      '3', 
      'CIT 425 - Data Warehousing', 
      'Learn how to design, secure, and maintain databases.', 
      'http://example.com/doc3'
    ),
    new Document(
      '4', 
      'CIT 460 - Enterprise Development', 
      'Learn how to develop enterprise business applications.', 
      'http://example.com/doc4'
    ),
    new Document(
      '5', 
      'CIT 495 - Senior Practicum', 
      'Design a senior project that illustrates skills you have learned.', 
      'http://example.com/doc5'
    )
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

  constructor() { }

  ngOnInit(): void {
  }

  
}
