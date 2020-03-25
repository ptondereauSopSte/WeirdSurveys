import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { IdentificationComponent } from './identification/identification.component';
import { HomeComponent } from './home/home.component';
import { AddSurveyComponent } from './home/add-survey/AddSurvey.component';
import { SurveyPreviewComponent } from './home/surveyPreview/surveyPreview.component';

import { SurveyManagementService } from './home/surveyManagement.service';

@NgModule({
  declarations: [
    AppComponent,
    IdentificationComponent,
    HomeComponent,
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
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [SurveyManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
