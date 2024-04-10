import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private db: Firestore) {}

  private submitEvent = new Subject<any>();
  private navFirstEvent = new Subject<string>();

  sendEvent(data: any) {
    this.submitEvent.next(data);
  }

  sendFirstNavEvent(id: string) {
    this.navFirstEvent.next(id);
  }

  getEvent() {
    return this.submitEvent.asObservable();
  }

  getFirstNavEvent() {
    return this.navFirstEvent.asObservable();
  }

  getQuotationRequests(): Observable<any[]> {
    const quoteRequestsRef = collection(this.db, 'quotationRequest');
    return collectionData(quoteRequestsRef, { idField: 'id' });
  }

  async addQuotation(quotationData: any) {
    const quoteRequestsRef = collection(this.db, 'quotationRequest');
    return await addDoc(quoteRequestsRef, quotationData);
  }

  async updateQuotation(quoteId: string, newQuotation: number) {
    const quoteRef = doc(this.db, `quotationRequest/${quoteId}`);
    return updateDoc(quoteRef, { quotation: newQuotation });
  }

  getDocument(documentId: string) {
    const docRef = doc(collection(this.db, 'quotationRequest'), documentId);
  }
}
