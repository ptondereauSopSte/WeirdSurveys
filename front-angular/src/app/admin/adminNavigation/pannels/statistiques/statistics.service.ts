import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { User } from 'src/models/User';

@Injectable()
export class StatisticsService {

  constructor(private httpClient : HttpClient) {}

  mapStats={};
  mapStatsSubject= new Subject<any>();
  
  getAllStats(){
    //Nbr utilisateurs
    this.httpClient.get<any>(environment.apiUrl + '/stats/nbrUsers').subscribe(
      (response) => {
        this.mapStats["nbrUsers"]=response["value"];
        this.emitMapStatsSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );

    //Nbr sondage
    this.httpClient.get<any>(environment.apiUrl + '/stats/nbrSurveys').subscribe(
      (response) => {
        this.mapStats["nbrSurveys"]=response["value"];
        this.emitMapStatsSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );

    //Nbr sondage
    this.httpClient.get<any>(environment.apiUrl + '/stats/surveyStats').subscribe(
      (response) => {
        this.mapStats["nbrVotes"]=response["nbrVote"];
        this.mapStats["nbrLikes"]=response["nbrLike"];
        this.emitMapStatsSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );

    //Evolution nbr utilisateurs sur 30j
    this.httpClient.get<any>(environment.apiUrl + '/stats/userEvolution').subscribe(
      (response) => {
        this.mapStats["evolutionUser"]=response["value"];
        this.emitMapStatsSubject();
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }
  
  addUser(user : User){
    this.httpClient.post<User>(environment.apiUrl + '/users/post', user).subscribe(
      (response) => {
          console.log('User ajouté avec succès')
      },
      (error) => {
          console.log('Erreur ! : ' + error);
      }
    );
  }

  emitMapStatsSubject(){
    this.mapStatsSubject.next(this.mapStats);
  }
}
