import { SurveyManagementService } from './surveyManagement.service';
import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { Survey } from 'src/models/Survey';
import { FormControl, NgModel } from '@angular/forms';
import { StatisticsService } from '../admin/adminNavigation/pannels/statistiques/statistics.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})

export class HomeComponent implements OnInit {

  listSurveys: Survey[] = [];
  listSurveysSubscription: Subscription;

  sortedBy: String;
  isSortingPopupOpen: Boolean = false;

  sortKey = 'time';
  sortingOptions = [
    {
      value: "time",
      display: "Date de publication"
    },
    {
      value: "participations",
      display: "Nombre de participants"
    },
    {
      value: "likes",
      display: "Nombre de likes"
    },
    {
      value: "variance",
      display: "Les plus controversés"
    },
    {
      value: "random",
      display: "Aléatoire"
    },
  ]

  categorieKey = 'all';
  categorieFiltered = 'all';
  categories = [
    {
      value: "all",
      display: "Toutes"
    },
    {
      value: "love",
      display: "Amour"
    },
    {
      value: "society",
      display: "Société"
    },
    {
      value: "useless",
      display: "Inutile"
    },
    {
      value: "sport",
      display: "Sport"
    },
    {
      value: "news",
      display: "Actualité"
    },
    {
      value: "art",
      display: "Art"
    },
    {
      value: "life",
      display: "Vie quotidienne"
    },
    {
      value: "music",
      display: "Musique"
    },
    {
      value: "sex",
      display: "Sexe"
    },
    {
      value: "science",
      display: "Science"
    },
    {
      value: "film",
      display: "Film/Séries"
    },
  ]

  statutKey: string = 'all';
  oldStatutKey = 'all';

  constructor(private surveyManagementService: SurveyManagementService, private statisticsService: StatisticsService) { }

  ngOnInit() {
    this.surveyManagementService.getAllSurveys();
    this.listSurveysSubscription = this.surveyManagementService.listSurveysDisplayedSubject.subscribe(
      (listSurveys: Survey[]) => {
        this.listSurveys = listSurveys.slice();
        this.listSurveys.reverse()
      }
    );
    this.surveyManagementService.emitlistSurveysDisplayedSubject();

    this.statisticsService.addImpression();
  }

  changeSortBy(key: string) {
    if (!key || key != this.sortedBy) {
      this.surveyManagementService.sortSurveys(key);
      this.sortedBy = key;
      this.isSortingPopupOpen = false;
    }
  }

  categorieFilter(keyCat: string) {
    if (keyCat != this.categorieFiltered) {
      this.surveyManagementService.filterByCat(keyCat);
      this.categorieFiltered = keyCat;
    }
  }

  statutFilter(statutKey: string) {
    if (statutKey != this.oldStatutKey) {
      this.surveyManagementService.filterByStatut(statutKey);
      this.oldStatutKey = statutKey;
    }
  }
}
