import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Survey, SurveyOption } from 'src/models/Survey';

@Component({
  selector: "app-surveyPreview",
  templateUrl: "./surveyPreview.component.html",
  styleUrls: ["./surveyPreview.component.scss"]
})

export class SurveyPreviewComponent implements OnInit {
  
  survey:Survey;
  voted:boolean;
  liked:boolean;
  mapBarStyle=[];

  constructor(private sanitizer : DomSanitizer) {}

  ngOnInit() {
    if(false){
      this.voted=true;
    } else{
      this.voted=false;
    }

    this.survey = new Survey();
    this.survey.text="Est-il préférable de voir la vie en rose ou de voir la vie en bleu ?";
    let surveyOpt1 = new SurveyOption();
    surveyOpt1.text='Voir la vie en rose';
    surveyOpt1.percent=43;
    surveyOpt1.number=86;

    let surveyOpt2 = new SurveyOption();
    surveyOpt2.text='Voir la vie en bleu';
    surveyOpt2.percent=57;
    surveyOpt2.number=114;
    this.survey.options=[surveyOpt1, surveyOpt2];
    this.survey.likes=34;
    this.survey.participations=67;

    this.computeMapBarStyle();
  }

  vote(option:SurveyOption){
    console.log(option)
    this.voted=true;
  }

  computeMapBarStyle(){
    this.survey.options.forEach((option)=>{
      const percentWidth = option.percent*20/100;
      const strStyleBar=this.sanitizer.bypassSecurityTrustStyle("width:"+percentWidth+"vw");
      this.mapBarStyle.push(strStyleBar);
    })
  }
}
