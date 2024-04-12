import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotingPageComponent } from './quoting-page/quoting-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'quoting/', pathMatch: 'full' },
  { path: 'quoting', redirectTo: 'quoting/', pathMatch: 'full' },
  { path: 'quoting/:quoteId', component: QuotingPageComponent },
];

export { routes };
