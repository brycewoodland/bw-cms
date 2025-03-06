import { Injectable, EventEmitter } from '@angular/core';
import { Document } from '../documents/document.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = []; // Initialize with an empty array
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;
  private firebaseUrl = 'https://bwcms-62379-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) { }

  getDocuments() {
    this.http.get<Document[]>(`${this.firebaseUrl}/documents.json`).subscribe(
      // Success method (fat arrow function)
      (documents: Document[]) => {
        this.documents = documents ? documents : []; // Assign the received array
  
        this.maxDocumentId = this.getMaxId(); // Get max ID
  
        // Sort documents by name
        this.documents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  
        // Emit document list changed event with a cloned array
        this.documentListChangedEvent.next(this.documents.slice());
      },
      // Error method (fat arrow function)
      (error: any) => {
        console.error('Error fetching documents:', error);
      }
    );
  }  

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments(); // Save changes to Firebase
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments(); // Save changes to Firebase
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments(); // Save changes to Firebase
  }

  storeDocuments() {
    // Convert documents array to a JSON string
    const documentsJson = JSON.stringify(this.documents);

    // Set HTTP headers
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    // Send an HTTP PUT request to update the Firebase database
    this.http.put(`${this.firebaseUrl}/documents.json`, documentsJson, { headers })
      .subscribe(() => {
        // Emit documentListChangedEvent with a cloned array when the request is successful
        this.documentListChangedEvent.next(this.documents.slice());
      }, (error) => {
        console.error('Error storing documents:', error);
      })
  }
}