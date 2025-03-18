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
  private mongoUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) { }

  getDocuments() {
    this.http.get<Document[]>(`${this.mongoUrl}`).subscribe(
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
  
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }
  
    // Ensure the new document keeps the same id
    newDocument.id = originalDocument.id;
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.put<{ message: string; document: Document }>(
      `${this.mongoUrl}/${originalDocument.id}`,
      newDocument,
      { headers }
    ).subscribe(
      (response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      },
      (error) => {
        console.error('Error updating document:', error);
      }
    );
  }
  
  

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  storeDocuments() {
    // Convert documents array to a JSON string
    const documentsJson = JSON.stringify(this.documents);

    // Set HTTP headers
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    // Send an HTTP PUT request to update the Firebase database
    this.http.put(`${this.mongoUrl}/documents.json`, documentsJson, { headers })
      .subscribe(() => {
        // Emit documentListChangedEvent with a cloned array when the request is successful
        this.documentListChangedEvent.next(this.documents.slice());
      }, (error) => {
        console.error('Error storing documents:', error);
      })
  }

  private sortAndSend() {
    this.documents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}