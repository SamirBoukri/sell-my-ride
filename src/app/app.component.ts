import { Component, OnInit, inject } from "@angular/core";
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { QuotingPageComponent } from "./quoting-page/quoting-page.component";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RoutesRecognized,
} from "@angular/router";
import { RequestService } from "./service/request.service";
import { MatListModule} from "@angular/material/list"

interface QuotationRequest {
  quotation?: number;
  message: string;
  userId: string;
  image: string;
  id: string;
}

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    QuotingPageComponent,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    MatListModule
  ],
})
export class AppComponent implements OnInit {
  title = "Sell My Ride";
  items$: Observable<QuotationRequest[]>;
  subscription!: Subscription;
  quotionRequests!: QuotationRequest[];
  currentQuoteIdInRoute: string | undefined;
  otherQuotationRequests!: QuotationRequest[]

  constructor(
    private firestore: Firestore,
    private router: Router,
    private requestService: RequestService
  ) {
    const aCollection = collection(this.firestore, "quotationRequest");
    this.items$ = collectionData(
      query(
        aCollection as CollectionReference<QuotationRequest, QuotationRequest>,
        where("quotation", "==", -1)
      ),
      { idField: "id" }
    );
  }

  ngOnInit(): void {
    // IMPORTANT
    // On utilise cette méthode pour accéder aux paramètres d'une route hors du router outlet
    // Voir lien ici : https://stackoverflow.com/questions/42947133/parent-components-gets-empty-params-from-activatedroute
    this.router.events.subscribe((value) => {
      if (value instanceof RoutesRecognized) {
        this.currentQuoteIdInRoute =
          value.state.root.firstChild?.params["quoteId"];
      }
    });
    // La liste de cotation sera mise à jour automatique à chaque envoi d'estimation
    // Grace au realtime de firestore, qui détecte que les datas ont changé côté back
    // Il n'y a donc RIEN  à faire pour récupérer la prochaine estimation non traitée
    this.items$.subscribe((data) => {
      this.quotionRequests = data;
      if(this.quotionRequests.length > 1){
        this.otherQuotationRequests = this.quotionRequests.slice(1)
      } else {
        this.otherQuotationRequests = []
      }
      
      // On va traiter le cas ici où on ouvre la page pour la première fois (pas d'id de quote)
      if (!this.currentQuoteIdInRoute && data.length > 0) {
        // Naturellement, le premier élément de cette liste sera la première cotation non traitée
        // Grace au where de notre requête
        this.router.navigate(["quoting", data[0].id]);
      }
    });

    // Ici, on traite le cas ou on vient d'envoyer une estimation
    // this.quotionRequest a été mis à jour grâce au subscribe juste en haut
    // ...car l'envoi de notre estimation a modifié les données coté back ...
    // ...ce qui a forcé firestore à jour notre collection en temps réel, sans aucune action de notre part
    this.requestService.getNextQuoteEvent().subscribe((e) => {
      if (this.quotionRequests.length > 0) {
        this.router.navigate(["quoting", this.quotionRequests[0].id]);
      } else {
        // S'il n'y a plus aucune cotation à traiter, on retoure à la route /quoting
        this.router.navigate(["quoting"]);
      }
    });
  }
}
