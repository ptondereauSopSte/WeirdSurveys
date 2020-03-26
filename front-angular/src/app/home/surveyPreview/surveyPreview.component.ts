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
  @Input() admin:boolean;
  voted:boolean;
  liked:boolean=false;
  warned:boolean=false;
  optionVotedTxt:String;

  constructor(private sanitizer : DomSanitizer, private surveyManagementService:SurveyManagementService, private cookieService : CookieService) {}

  ngOnInit() {
    if (this.admin){
      this.voted=false;
    } else{
      this.survey.warnings=this.survey.warnings? this.survey.warnings : 0;
      if(this.cookieService.get('WS-mapVote')){
        let mapVote = JSON.parse(this.cookieService.get('WS-mapVote'));
        if(Object.keys(mapVote).indexOf(""+this.survey.id)>-1){
          this.voted=true;
          this.optionVotedTxt=mapVote[""+this.survey.id];
        }
      } else{
        this.voted=false;
      }

      if(this.cookieService.get('WS-mapLike')){
        let mapLike = JSON.parse(this.cookieService.get('WS-mapLike'));
        if(Object.keys(mapLike).indexOf(""+this.survey.id)>-1){
          this.liked=mapLike[""+this.survey.id];
        }
      }

      if(this.cookieService.get('WS-listWarning')){
        let listWarning = this.cookieService.get('WS-listWarning').split(",");
        if(listWarning.indexOf(""+this.survey.id)>-1){
          this.warned=true;
        }
      }
    }
  }

  vote(option:SurveyOption){
    this.voted=true;
    this.optionVotedTxt=option.text;
    this.survey.participations+=1;
    this.surveyManagementService.vote(this.survey, option);
  }

  like(){
    this.liked=!this.liked;
    if(this.liked){
      this.survey.likes+=1;
    } else {
      this.survey.likes-=1;
    }
    this.surveyManagementService.likeOrDislike(this.survey, this.liked);
  }

  warn(){
    this.warned=true;
    this.survey.warnings+=1;
    this.surveyManagementService.addWarning(this.survey);
  }
}
