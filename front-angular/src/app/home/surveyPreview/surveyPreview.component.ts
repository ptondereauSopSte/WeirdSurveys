import { SurveyManagementService } from './../surveyManagement.service';
import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Survey, SurveyOption } from 'src/models/Survey';

@Component({
  selector: "app-surveyPreview",
  templateUrl: "./surveyPreview.component.html",
  styleUrls: ["./surveyPreview.component.scss"]
})

export class SurveyPreviewComponent implements OnInit {
  
  @Input() survey:Survey;
  voted:boolean;
  liked:boolean;
  mapBarStyle=[];

  constructor(private sanitizer : DomSanitizer, private surveyManagementService:SurveyManagementService) {}

  ngOnInit() {
    if(false){
      this.voted=true;
    } else{
      this.voted=false;
    }
  }

  vote(option:SurveyOption){
    this.voted=true;
    this.surveyManagementService.vote(this.survey, option);
  }
}
