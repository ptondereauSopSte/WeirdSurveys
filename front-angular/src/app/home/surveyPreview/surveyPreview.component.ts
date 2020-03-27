import { CookieService } from 'ngx-cookie-service';
import { SurveyManagementService } from './../surveyManagement.service';
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef} from "@angular/core";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Survey, SurveyOption } from 'src/models/Survey';
import { Chart } from 'chart.js';

@Component({
  selector: "app-surveyPreview",
  templateUrl: "./surveyPreview.component.html",
  styleUrls: ["./surveyPreview.component.scss"]
})

export class SurveyPreviewComponent implements OnInit, AfterViewInit {
  
  @Input() survey:Survey;
  @Input() admin:boolean;
  voted:boolean;
  liked:boolean=false;
  warned:boolean=false;
  optionVotedTxt:String;
  mapSelectedViewResult={
    "list":false,
    "heatmap":false,
    "sex":true,
    "donut":false
  };

  //GRAPHES
  @ViewChild('sexBarsGraph',null) sexBarsGraph: ElementRef;
  sexBarsChart =[];

  constructor(private sanitizer : DomSanitizer, private surveyManagementService:SurveyManagementService, private cookieService : CookieService, private elementRef : ElementRef) {}

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

  selectViewResult(key:string){
    this.mapSelectedViewResult={
      "list":false,
      "heatmap":false,
      "sex":false,
      "donut":false
    };
    this.mapSelectedViewResult[key]=true;
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    // sexChart
    if(this.mapSelectedViewResult['sex']){
      let data= [[5,6], [-3,-6]]
      this.sexBarsChart.push(new Chart(this.sexBarsGraph.nativeElement.getContext('2d'),
        {
          type: 'bar',
          data:{
            labels: ['Option A','Option B',"Option C"],
            datasets: [
              {
                  label: "H",
                  backgroundColor: "#0D6EA3",
                  data: [2,5,1]
              },
              {
                  label: "F",
                  backgroundColor: "#F8FF42",
                  data: [3,8,4]
              }
            ]
          },

          options: {
              scales: {
                  xAxes: [{
                    gridLines : {
                      display:false,
                    },
                    stacked: true
                  }],
                  yAxes: [{
                    gridLines : {
                      display:false,
                    },
                    stacked: true,
                    ticks: {
                      display: false
                    }
                  }]
              }
          }
        }));
      }
    }
    
}