import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, count } from 'rxjs';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { RequestService } from '../service/request.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface QuotationRequest {
  quotation?: number;
  message: string;
  userId: string;
  image: string;
  id: string;
}

@Component({
  selector: 'app-quoting-page',
  templateUrl: './quoting-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  styleUrls: ['./quoting-page.component.css'],
})
export class QuotingPageComponent implements OnInit {
  quoteId: any;
  quotationRequest!: QuotationRequest;
  quotation$: Observable<any> | undefined;
  quotations: any[] = [];
  quotationForm = new FormGroup({
    message: new FormControl('', Validators.required),
    quotation: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
  });
  updateQuotationForm = new FormGroup({
    newQuotation: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
  });
  unsub: Subscription | undefined;
  preivousQuoteId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private db: Firestore,
    private requestservice: RequestService
  ) {
    this.quotationForm = new FormGroup({
      message: new FormControl('', Validators.required),
      quotation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
    });
    this.unsub = this.route.paramMap.subscribe((params) => {
      this.quoteId = params.get('quoteId');
      if (this.quoteId) {
        const docRef = doc(this.db, 'quotationRequest', this.quoteId);
        this.quotation$ = docData(docRef);
        this.quotation$.subscribe((data) => {
          this.quotationRequest = data;
        });
      } else {
      }
    });
  }
  ngOnInit() {}

  updateQuotation(quoteId: string, newQuotation: any) {
    // 'any' peut être remplacé par le type approprié
    const newQuotationNumber = Number(newQuotation); // Assurez-vous que c'est un nombre
    if (!isNaN(newQuotationNumber)) {
      this.requestservice
        .updateQuotation(quoteId, newQuotationNumber)
        .then(() => {
          console.log('Devis mis à jour avec succès!');
          // Déclenche l'affichage de la cote suivante -
          // Cet event n'a besoin d'aucune data
          this.requestservice.sendNextQuoteEvent();
          // Bien étudier à quoi sert patchValue
          this.updateQuotationForm.patchValue({ newQuotation: '' });
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour du devis:', error);
        });
    } else {
      console.error('Le nouveau montant du devis doit être un nombre');
    }
  }
  ngOnDestroy() {
    this.unsub?.unsubscribe();
  }
}
