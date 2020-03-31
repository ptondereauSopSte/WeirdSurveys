import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Survey, SurveyOption } from 'src/models/Survey';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class SurveyManagementService {

  listSurveys: Survey[] = [];
  listSurveysSubject = new Subject<Survey[]>();

  oneSurvey: Survey;
  oneSurveySubject = new Subject<Survey>();

  keySort: string = 'time';

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  getAllSurveys() {
    this.httpClient.get<any>(environment.apiUrl + '/surveys').subscribe(
      (response) => {
        this.listSurveys = [];
        console.log('Found ' + response.length + ' surveys');
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

  getOneSurvey(idSharedSurvey: String) {
    this.httpClient.post<any>(environment.apiUrl + '/surveys/getById', { "idSurvey": idSharedSurvey }).subscribe(
      (response) => {
        const survey = new Survey();
        survey.fromHashMap(response);
        this.oneSurvey = survey
        this.emitOneSurveySubject();
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  sortSurveys(key: string) {
    this.keySort = key;
    if (key == "time") {
      this.listSurveys.sort(function (a: Survey, b: Survey) {
        return +new Date(a.date).getTime() - +new Date(b.date).getTime();
      });
    } else if (key == "likes") {
      this.listSurveys.sort(function (a: Survey, b: Survey) {
        return +a.likes - b.likes;
      });
    } else if (key == "participations") {
      this.listSurveys.sort(function (a: Survey, b: Survey) {
        return +a.participations - b.participations;
      });
    }
    this.emitListSurveysSubject();
  }

  filterByCat(keyCat: string) {
    console.log(keyCat)
    if (keyCat == 'all') {
      this.getAllSurveys();
      return;
    }
    this.httpClient.post<any>(environment.apiUrl + '/surveys/filteredByCat', { "cat": keyCat }).subscribe(
      (response) => {
        this.listSurveys = [];
        console.log('Found ' + response.length + ' surveys');
        response.forEach((surveyJson) => {
          const survey = new Survey();
          survey.fromHashMap(surveyJson);
          this.listSurveys.push(survey);
        });
        this.sortSurveys(this.keySort)
        this.emitListSurveysSubject();
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  postSurvey(newSurvey: Survey) {
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

  vote(survey: Survey, option: SurveyOption) {
    let user = this.cookieService.get("WS-user")
    this.httpClient.post<any>(environment.apiUrl + '/surveys/vote', { "surveyId": survey.id, "option": option, "user": user }).subscribe(
      (response) => {
        console.log('Vote ajouté avec succès');
        const survey = new Survey();
        survey.fromHashMap(response);
        console.log(survey)
        this.listSurveys.forEach((oneSurvey) => {
          if (oneSurvey.id == survey.id) {
            oneSurvey.options = survey.options;
            this.emitListSurveysSubject();
          }
        })
        //On met en session le vote
        let mapVote = JSON.parse(this.cookieService.get('WS-mapVote'));
        mapVote["" + survey.id] = option.text;
        this.cookieService.set('WS-mapVote', JSON.stringify(mapVote), 365);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  likeOrDislike(survey: Survey, isLike: boolean) {
    this.httpClient.post<any>(environment.apiUrl + '/surveys/likedislike', { "surveyId": survey.id, "isLike": isLike }).subscribe(
      (response) => {
        console.log('Like ou dislike ajouté avec succès');
        //On met le like en session
        let mapLike = JSON.parse(this.cookieService.get('WS-mapLike'));
        mapLike["" + survey.id] = isLike;
        this.cookieService.set('WS-mapLike', JSON.stringify(mapLike), 365);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  addWarning(survey: Survey) {
    this.httpClient.post<any>(environment.apiUrl + '/surveys/addwarning', { "surveyId": survey.id }).subscribe(
      (response) => {
        console.log('Warning ajouté avec succès');
        //On met le warning en session
        let listWarning = this.cookieService.get('WS-listWarning');
        listWarning += "," + survey.id
        this.cookieService.set('WS-listWarning', listWarning, 365);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  emitListSurveysSubject() {
    this.listSurveysSubject.next(this.listSurveys.length !== 0 ? this.listSurveys.slice() : []);
  }

  emitOneSurveySubject() {
    this.oneSurveySubject.next(this.oneSurvey);
  }
}
