import { StatisticsService } from './statistics.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: "app-statistiques",
  templateUrl: "./statistiques.component.html",
  styleUrls: ["./statistiques.component.scss"]
})

export class StatistiquesComponent implements OnInit, AfterViewInit {
  
  mapStats:any = {};
  mapStatsSubscription: Subscription;

  //GRAPHES
  @ViewChild('userEvolutionGraph',null) userEvolutionGraph: ElementRef;
  userEvolutionChart =[];

  constructor(private statisticsService : StatisticsService) {}

  ngOnInit() {
    this.statisticsService.getAllStats();
    this.mapStatsSubscription = this.statisticsService.mapStatsSubject.subscribe(
      (mapStats: any) => {
        this.mapStats = mapStats;
        this.ngAfterViewInit();
      }
    );
    this.statisticsService.emitMapStatsSubject();
  }

  ngAfterViewInit() {
    // sexChart
    if(this.mapStats['evolutionUser']){
      let dates=[]
      let nbrUsers=[]
      this.mapStats['evolutionUser'].forEach((dataForOneDay)=>{
        dates.push((new Date(dataForOneDay["ts"]).getUTCDate())+"/"+(new Date(dataForOneDay["ts"]).getUTCMonth()+1))
        nbrUsers.push(dataForOneDay["value"])
      })
      
      this.userEvolutionChart.push(new Chart(this.userEvolutionGraph.nativeElement.getContext('2d'),
        {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{ 
                data: nbrUsers,
                borderColor: "#0D6EA3",
                fill: true,
                lineTension:0,
              }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
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
              }]
            }
          }
      }));
    }
  }
}
