import { AdminService } from './../../../../admin.service';
import { Component, OnInit, Input } from "@angular/core";
import { Survey } from 'src/models/Survey';

@Component({
  selector: "app-surveyAdminPreview",
  templateUrl: "./surveyAdminPreview.component.html",
  styleUrls: ["./surveyAdminPreview.component.scss"]
})

export class SurveyAdminPreviewComponent implements OnInit {
  
  @Input() survey : Survey;
  surveyOpen:Boolean=false;
  isDeleted:boolean=false;

  constructor(private adminService : AdminService) {}

  ngOnInit() {}

  openSurvey(){
    this.surveyOpen = !this.surveyOpen;
  }

  safe(){
    this.survey.warnings=0;
    this.adminService.safe(this.survey);
  }

  delete(){
    this.isDeleted=true;
    this.adminService.delete(this.survey);
  }
}
