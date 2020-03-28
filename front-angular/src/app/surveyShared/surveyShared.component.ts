import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { Survey } from 'src/models/Survey';
import { SurveyManagementService } from '../home/surveyManagement.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-surveyShared",
  templateUrl: "./surveyShared.component.html",
  styleUrls: ["./surveyShared.component.scss"]
})

export class SurveySharedComponent implements OnInit {
  
  idSharedSurvey:String;
  oneSurvey:Survey;
  oneSurveySubscription: Subscription;
  friendOptionSelected:Number;

  constructor(private surveyManagementService : SurveyManagementService, private cookieService: CookieService, private router : Router) {}

  ngOnInit() {
    if (!this.cookieService.get('WS-user')){
      this.router.navigate(['identification'],
      { queryParams:
        { ss:true,
          id: window.location.href.split("id=")[1].split("&")[0],
          r: window.location.href.split("r=")[1].split("&")[0]
        }
      });
    }
    this.friendOptionSelected=+window.location.href.split("r=")[1].split("&")[0].slice(-1);
    this.idSharedSurvey = window.location.href.split("id=")[1].split("&")[0];
    this.surveyManagementService.getOneSurvey(this.idSharedSurvey);
    this.oneSurveySubscription = this.surveyManagementService.oneSurveySubject.subscribe(
      (oneSurvey: Survey) => {
        this.oneSurvey = oneSurvey;
      }
    );
    this.surveyManagementService.emitOneSurveySubject();
  }
}
