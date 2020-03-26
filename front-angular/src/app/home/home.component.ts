import { SurveyManagementService } from './surveyManagement.service';
import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { Survey } from 'src/models/Survey';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})

export class HomeComponent implements OnInit {

  listSurveys:Survey[]=[];
  listSurveysSubscription: Subscription;

  sortedBy: String;
  isSortingPopupOpen: Boolean = false;

  constructor(private surveyManagementService : SurveyManagementService) {}

  ngOnInit() {
    this.sortedBy = 'time';
    this.surveyManagementService.getAllSurveys();
    this.listSurveysSubscription = this.surveyManagementService.listSurveysSubject.subscribe(
      (listSurveys: Survey[]) => {
        this.listSurveys = listSurveys.slice();
        this.listSurveys.reverse()
      }
    );
    this.surveyManagementService.emitListSurveysSubject();
  }

  openOrClosePopup() {
    this.isSortingPopupOpen = !this.isSortingPopupOpen;
  }

  changeSortBy(key: string) {
    if (key != this.sortedBy) {
      this.surveyManagementService.sortSurveys(key);
      this.sortedBy = key;
      this.isSortingPopupOpen = false;
    }
  }
}
