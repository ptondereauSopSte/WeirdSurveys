import { Subscription } from 'rxjs';
import { SurveyManagementService } from './home/surveyManagement.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Survey } from 'src/models/Survey';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'NewProject';
  isLoaded=false;
  isAnimationClosed=false;

  listSurveysSubscription:Subscription;

  constructor(private router : Router, private surveyManagementService : SurveyManagementService){}
  ngOnInit(){
    this.surveyManagementService.getAllSurveys();
    this.listSurveysSubscription = this.surveyManagementService.listSurveysDisplayedSubject.subscribe(
      (listSurveys: Survey[]) => {
        if(listSurveys.length>0){
          this.isLoaded=true;
          setTimeout(()=>{
            this.isAnimationClosed=true;
          },400);
        }
      }
    );
  }
}
