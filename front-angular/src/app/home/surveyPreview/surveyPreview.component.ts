import { CookieService } from 'ngx-cookie-service';
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
  optionVotedTxt:String;

  constructor(private sanitizer : DomSanitizer, private surveyManagementService:SurveyManagementService, private cookieService : CookieService) {}

  ngOnInit() {
    if(this.cookieService.get('WS-mapVote')){
      let mapVote = JSON.parse(this.cookieService.get('WS-mapVote'));
      if(Object.keys(mapVote).indexOf(""+this.survey.id)>-1){
        this.voted=true;
        this.optionVotedTxt=mapVote[""+this.survey.id];
      }
    } else{
      this.voted=false;
    }
  }

  vote(option:SurveyOption){
    this.voted=true;
    this.optionVotedTxt=option.text;
    this.surveyManagementService.vote(this.survey, option);
  }
}
