import { AdminService } from './../../../admin.service';
import { Component, OnInit } from "@angular/core";
import { Survey } from 'src/models/Survey';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-surveyGestion",
  templateUrl: "./surveyGestion.component.html",
  styleUrls: ["./surveyGestion.component.scss"]
})

export class SurveyGestionComponent implements OnInit {
  
  listSuspendedSurveys:Survey[]=[];
  listSuspendedSurveysSubscription: Subscription;

  listNotSuspendedSurveys:Survey[]=[];
  listNotSuspendedSurveysSubscription: Subscription;

  constructor(private adminService : AdminService) {}

  ngOnInit() {
    this.adminService.getSuspendedSurveys();
    this.listSuspendedSurveysSubscription = this.adminService.listSuspendedSurveysSubject.subscribe(
      (listSuspendedSurveys: Survey[]) => {
        this.listSuspendedSurveys = listSuspendedSurveys.slice();
        this.listSuspendedSurveys.reverse()
      }
    );
    this.adminService.emitListSuspendedSurveysSubject();

    this.adminService.getNotSuspendedSurveys();
    this.listNotSuspendedSurveysSubscription = this.adminService.listNotSuspendedSurveysSubject.subscribe(
      (listNotSuspendedSurveys: Survey[]) => {
        this.listNotSuspendedSurveys = listNotSuspendedSurveys.slice();
        this.listNotSuspendedSurveys.reverse()
      }
    );
    this.adminService.emitListNotSuspendedSurveysSubject();
  }
}
