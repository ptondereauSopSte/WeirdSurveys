import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddSurveyComponent } from './home/add-survey/AddSurvey.component';
import { IdentificationComponent } from './identification/identification.component';

const routes: Routes = [
  { path: '', redirectTo: 'identification', pathMatch: 'full' },
  { path: 'identification', component: IdentificationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-survey', component: AddSurveyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }