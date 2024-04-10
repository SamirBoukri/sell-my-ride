import { Component, OnInit, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { QuotingPageComponent } from './quoting-page/quoting-page.component';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { query, where } from 'firebase/firestore';
import { RequestService } from './service/request.service';

interface QuotationRequest {
  quotation?: number;
  message: string;
  userId: string;
  image: string;
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    QuotingPageComponent,
    RouterModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent implements OnInit {
  title = 'Sell My Ride';
  items$: Observable<QuotationRequest[]>;
  subscription!: Subscription;
  quotionRequests!: QuotationRequest[];
  previousQuoteId: number = 0;
  constructor(
    private firestore: Firestore,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private requestService: RequestService
  ) {
    const aCollection = collection(this.firestore, 'quotationRequest');
    this.items$ = collectionData(
      query(
        aCollection as CollectionReference<QuotationRequest, QuotationRequest>,
        where('quotation', '==', -1)
      ),
      { idField: 'id' }
    );
    // this.activeRoute.paramMap.subscribe((p) =>
    //   console.log('hey', JSON.stringify(p))
    // );
    // this.items$.subscribe((newQuotes) => {
    //   // this.router.navigate(['quoting', newQuotes[0].id]);
    // });
  }

  ngOnInit(): void {
    // if (routeId === '' || routeId === undefined || routeId === null) {
    //@ts-ignore
    //@ts-ignore
    // this.router.navigate(['/quoting/' + last(this.items$)[0].id]);
    // this.requestService.sendFirstNavEvent(data[0].id);
    // }
    this.subscription = this.requestService
      .getEvent()
      .subscribe((eventData) => {
        this.router.navigate(['quoting', this.quotionRequests[0].id]);
        // this.quotionRequests.shift();
        // console.log('ICI' + this.quotionRequests);
        // this.router.navigate(['quoting', this.quotionRequests[1].id]);
      });
    this.items$.subscribe((data) => {
      let routeId =
        //@ts-ignore
        this.activeRoute.snapshot._routerState.url.split('quoting/')[1];
      let nextQuoteId = data[0]?.id;
      console.log(nextQuoteId, routeId);
      this.quotionRequests = data;
      if (routeId !== nextQuoteId) {
        console.log('HERE');
        // this.previousQuoteId = routeId;
        this.router.navigate(['quoting/' + nextQuoteId]);
        // if (routeId === '' || routeId === undefined || routeId === null) {
        // this.router.navigate(['quoting', data[0].id]);
        // } else {
        //   console.log('already okay');
        // }
      }
    });
    //   //this.router.navigate(['quoting', data[0].id]);
    //   this.router.navigate([], { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['quoting', data[0].id], {
    //       queryParams: { refresh: new Date().getTime() },
    //     });
    //   });
    // });
  }
}
