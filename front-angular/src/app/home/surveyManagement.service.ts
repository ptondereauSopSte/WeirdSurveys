import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Survey, SurveyOption } from 'src/models/Survey';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { summaryFileName } from '@angular/compiler/src/aot/util';

@Injectable()
export class SurveyManagementService {

  listSurveys: Survey[] = [];
  listSurveysDisplayed: Survey[] = [];
  listSurveysDisplayedSubject = new Subject<Survey[]>();

  oneSurvey: Survey;
  oneSurveySubject = new Subject<Survey>();

  keySort: string = 'time';
  keyCat: string = 'all';
  keyStatut: string = 'all';

  

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
        this.sortSurveys(this.keySort);
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
    } else if (key == "variance") {
      this.listSurveys.sort(function (a: Survey, b: Survey) {
        let varA=0
        let varB=0
        let percentA=[]
        let percentB=[]
        a.options.forEach((option)=>{
          percentA.push(option.percent)
        })
        b.options.forEach((option)=>{
          percentB.push(option.percent)
        })
        for (var k=0; k<percentA.length; k++){
          varA+=Math.sqrt(Math.pow(percentA[k] - (100/a.options.length), 2))
        }
        for (var k=0; k<percentB.length; k++){
          varB+=Math.sqrt(Math.pow(percentB[k] - (100/b.options.length), 2))
        }
        return varB-varA;
      });
    } else if (key == "random") {
      this.listSurveys.sort(function (a: Survey, b: Survey) {
        return Math.random() - Math.random();
      });
    }
    this.filterByStatut(this.keyStatut);
  }

  filterByCat(keyCat: string) {
    this.keyCat = keyCat;
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
        this.sortSurveys(this.keySort);
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  filterByStatut(statutKey:string){
    this.keyStatut = statutKey;
    console.log(this.keyStatut)
    if (statutKey!='all'){
      const mapVote = JSON.parse(this.cookieService.get('WS-mapVote'));
      console.log(Object.keys(mapVote))
      let tempList = [];
      this.listSurveys.forEach((survey)=>{
        if(Object.keys(mapVote).indexOf(''+survey.id)>-1 && statutKey=='voted'){
          //Le sondage a déja été voté et on filtre les votés
            tempList.push(survey);
        } else if(Object.keys(mapVote).indexOf(''+survey.id)==-1 && statutKey=='nonVoted'){
          //Le sondage n'a pas déja été voté et on filtre les non votés
            tempList.push(survey);
        }
      })
      this.listSurveysDisplayed = tempList.slice();
    } else {
      this.listSurveysDisplayed = this.listSurveys.slice();
    }
    this.emitlistSurveysDisplayedSubject();
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
            this.emitlistSurveysDisplayedSubject();
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

  emitlistSurveysDisplayedSubject() {
    this.listSurveysDisplayedSubject.next(this.listSurveysDisplayed.length !== 0 ? this.listSurveysDisplayed.slice() : []);
  }

  emitOneSurveySubject() {
    this.oneSurveySubject.next(this.oneSurvey);
  }
}
