import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Survey } from 'src/models/Survey';
import { Subject } from 'rxjs';

@Injectable()
export class AdminService {

  isConnected:boolean=false;

  listSuspendedSurveys: Survey[] = [];
  listSuspendedSurveysSubject= new Subject<Survey[]>();

  listNotSuspendedSurveys: Survey[] = [];
  listNotSuspendedSurveysSubject= new Subject<Survey[]>();

  constructor(private router : Router, private httpClient : HttpClient) {}

  connect(login, mdp){
    if(login=='admins' && mdp=='goldenMdp'){
      this.isConnected=true;
      this.router.navigate(['adminPannels']);
      return true;
    } else{
      return false;
    }
  }

  getSuspendedSurveys(){
    this.httpClient.get<any>(environment.apiUrl + '/surveys/suspended').subscribe(
      (response) => {
          this.listSuspendedSurveys = [];
          response.forEach((surveyJson) => {
              const survey = new Survey();
              survey.fromHashMap(surveyJson);
              this.listSuspendedSurveys.push(survey);
          });
          this.emitListSuspendedSurveysSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }

  getNotSuspendedSurveys(){
    this.httpClient.get<any>(environment.apiUrl + '/surveys').subscribe(
      (response) => {
          this.listNotSuspendedSurveys = [];
          response.forEach((surveyJson) => {
              const survey = new Survey();
              survey.fromHashMap(surveyJson);
              this.listNotSuspendedSurveys.push(survey);
          });
          this.emitListNotSuspendedSurveysSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }

  emitListSuspendedSurveysSubject(){
    this.listSuspendedSurveysSubject.next(this.listSuspendedSurveys.length!==0 ? this.listSuspendedSurveys.slice() : []);
  }

  emitListNotSuspendedSurveysSubject(){
    this.listNotSuspendedSurveysSubject.next(this.listNotSuspendedSurveys.length!==0 ? this.listNotSuspendedSurveys.slice() : []);
  }

  delete(survey:Survey) {
    return this.httpClient.delete<String>(environment.apiUrl + '/surveys/deleteById/' + survey.id).subscribe(
        (response) => {
            console.log('Sondage ' + survey.id + ' supprimé')
            return true
        },
        (error) => {
            console.log('Erreur ! : ' + error);
            return false
        }
    );
  }

  safe(survey:Survey) {
      this.httpClient.post<Survey>(environment.apiUrl + '/surveys/safe', {"surveyId": survey.id}).subscribe(
          (response) => {
              console.log('Sondage ' + survey.id + ' déclaré safe')
              //Si le sondage faisait partie des sondages suspendus on le remet dans les sondages safe
              let newListSuspended : Survey[] = []
              this.listSuspendedSurveys.forEach((oneSurvey)=>{
                if(oneSurvey.id!=survey.id){
                  newListSuspended.push(oneSurvey)
                } else{
                  this.listNotSuspendedSurveys.push(oneSurvey)
                }
              })
              this.listSuspendedSurveys=newListSuspended.slice()
              this.emitListSuspendedSurveysSubject();
              this.emitListNotSuspendedSurveysSubject();
          },
          (error) => {
              console.log('Erreur ! : ' + error);
          }
      );
  }
}
