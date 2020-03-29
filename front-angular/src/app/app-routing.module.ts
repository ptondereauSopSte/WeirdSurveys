import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SurveySharedComponent } from './surveyShared/surveyShared.component';
import { AdminComponent } from './admin/admin.component';
import { AddSurveyComponent } from './home/add-survey/AddSurvey.component';
import { IdentificationComponent } from './identification/identification.component';
import { AdminNavigationComponent } from './admin/adminNavigation/adminNavigation.component';

const routes: Routes = [
  { path: '', redirectTo: 'identification', pathMatch: 'full' },
  { path: 'identification', component: IdentificationComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'sharedSurvey', component: SurveySharedComponent},
  { path: 'add-survey', canActivate: [AuthGuard], component: AddSurveyComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'adminPannels', component: AdminNavigationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }