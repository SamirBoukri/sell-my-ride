import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/*
Le code ici permet de faire fonctionner la logique d'envoi / switch auto
En conservant la structure que vous aviez choisie.

Je l'ai volontairement conservée, car même si ce n'est pas la structure optimale, c'est intéressant
pour vous de voir comment y arriver de cette manière.

L'idée générale est la suivante :
- envoyer l'estimation
- laisser firestore mettre à jour notre liste de cotations en temps réel, sans rien avoir à faire
- après l'estimation, sélectionner à nouveau le premier élément de notre liste (temps réel) de cotation
- gérer les edge-cases comme la première ouverture de la page, ou la liste vide
*/

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
