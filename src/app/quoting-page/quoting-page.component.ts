import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
  // providers: [RequestService],
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
    private requestservice: RequestService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    // this.activeRoute.params.subscribe((params) => {
    //   //  console.log(params);
    //   // if(params['quoteId'] === ""){
    //   //   console.log()
    //   // }
    // });
    this.quotationForm = new FormGroup({
      message: new FormControl('', Validators.required),
      quotation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
    });
    this.unsub = this.route.paramMap.subscribe((params) => {
      this.quoteId = params.get('quoteId');
      // console.log(this.preivousQuoteId, this.quoteId);
      // if (this.quoteId !== this.preivousQuoteId) {
      //   console.log('HERE');
      //   this.preivousQuoteId === this.quoteId;
      // console.log(this.quoteId);
      if (this.quoteId) {
        const docRef = doc(this.db, 'quotationRequest', this.quoteId);
        this.quotation$ = docData(docRef);
        this.quotation$.subscribe((data) => {
          // console.log(this.quoteId);
          // console.log(this.quotationRequest?.message, this.quoteId);
          this.quotationRequest = data;
          // console.log(this.quotationRequest);
        });
      }
      // }
    });
  }
  ngOnInit() {
    /* if (this.quoteId) {
      const docRef = doc(this.db, `quotations/${this.quoteId}`);
      this.quotation$ = docData(docRef);
    }
    this.quotation$ = this.requestservice.getQuotationRequests(); */
    /*this.requestservice.getQuotationRequests().subscribe((data) => {
      this.quotations = data;
    });*/
  }
  // onSubmit() {
  //   if (this.quotationForm.valid) {
  //     this.requestservice
  //       .addQuotation(this.quotationForm.value)
  //       .then(() => {
  //         console.log('Devis ajouté avec succès!');
  //         // Ici, vous pouvez par exemple réinitialiser le formulaire
  //         this.quotationForm.reset();
  //         this.requestservice.sendEvent('bruh');
  //       })
  //       .catch((error) => {
  //         console.error("Erreur lors de l'ajout du devis:", error);
  //       });
  //   }
  // }
  updateQuotation(quoteId: string, newQuotation: any) {
    // 'any' peut être remplacé par le type approprié
    const newQuotationNumber = Number(newQuotation); // Assurez-vous que c'est un nombre
    // this.requestservice.sendEvent('bruh');
    if (!isNaN(newQuotationNumber)) {
      this.requestservice
        .updateQuotation(quoteId, newQuotationNumber)
        .then(() => {
          console.log('Devis mis à jour avec succès!');
          this.requestservice.sendEvent('bruh');

          // ...
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
