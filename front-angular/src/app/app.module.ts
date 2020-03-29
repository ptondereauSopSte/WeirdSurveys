import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material';

import { AppComponent } from './app.component';
import { IdentificationComponent } from './identification/identification.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SurveySharedComponent } from './surveyShared/surveyShared.component';
import { AdminNavigationComponent } from './admin/adminNavigation/adminNavigation.component';
import { StatistiquesComponent } from './admin/adminNavigation/pannels/statistiques/statistiques.component';
import { SurveyGestionComponent } from './admin/adminNavigation/pannels/surveyGestion/surveyGestion.component';
import { SurveyAdminPreviewComponent } from './admin/adminNavigation/pannels/surveyGestion/surveyAdminPreview/surveyAdminPreview.component';
import { AddSurveyComponent } from './home/add-survey/AddSurvey.component';
import { SurveyPreviewComponent } from './home/surveyPreview/surveyPreview.component';

import { SurveyManagementService } from './home/surveyManagement.service';
import { StatisticsService } from './admin/adminNavigation/pannels/statistiques/statistics.service';
import { AdminService } from './admin/admin.service';
import { AuthGuard } from './auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AdminNavigationComponent,
    SurveyGestionComponent,
    SurveyAdminPreviewComponent,
    StatistiquesComponent,
    IdentificationComponent,
    HomeComponent,
    SurveySharedComponent,
    AddSurveyComponent,
    SurveyPreviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthGuard, CookieService, SurveyManagementService, AdminService, StatisticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
