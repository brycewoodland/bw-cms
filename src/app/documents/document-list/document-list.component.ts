import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  ngOnInit(): void {
    this.documents = [
      new Document('1', 'CIT 260', 'Object Oriented Programming', 'http://example.com/doc1'),
      new Document('2', 'CIT 366', 'Full Web Stack Development', 'http://example.com/doc2'),
      new Document('3', 'CIT 425', 'Data Warehousing', 'http://example.com/doc3'),
      new Document('4', 'CIT 460', 'Enterprise Development', 'http://example.com/doc4'),
      new Document('5', 'CIT 495', 'Senior Practicum', 'http://example.com/doc5')
    ];
  }

  onSelectedDocument(document: Document): void {
    this.selectedDocumentEvent.emit(document);
  }
}
