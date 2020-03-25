import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Survey, SurveyOption } from 'src/models/Survey';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class SurveyManagementService {

  listSurveys: Survey[] = [];
  listSurveysSubject= new Subject<Survey[]>();

  constructor(private httpClient : HttpClient, private router : Router) {}

  getAllSurveys(){
    this.httpClient.get<any>(environment.apiUrl + '/surveys').subscribe(
      (response) => {
          this.listSurveys = [];
          console.log('Found ' + response.length + ' offers');
          response.forEach((surveyJson) => {
              const survey = new Survey();
              survey.fromHashMap(surveyJson);
              this.listSurveys.push(survey);
          });
          this.emitListSurveysSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }

  postSurvey(newSurvey : Survey){
    this.httpClient.post<Survey>(environment.apiUrl + '/surveys/post', newSurvey).subscribe(
      (response) => {
          console.log('Sondage ajouté avec succès')
          this.listSurveys.push(newSurvey);
          this.router.navigate(['home']);
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }

  vote(survey:Survey, option:SurveyOption){
    console.log(survey)
    console.log(option)
    this.httpClient.post<any>(environment.apiUrl + '/surveys/vote', {"surveyId":survey.id, "option":option}).subscribe(
      (response) => {
          console.log('Vote ajouté avec succès');
          const survey = new Survey();
          survey.fromHashMap(response);
          console.log(survey)
          this.listSurveys.forEach((oneSurvey)=>{
            if(oneSurvey.id==survey.id){
              oneSurvey.options = survey.options;
              this.emitListSurveysSubject();
            }
          })
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }

  emitListSurveysSubject(){
    console.log(this.listSurveys)
    this.listSurveysSubject.next(this.listSurveys.length!==0 ? this.listSurveys.slice() : []);
  }
}
