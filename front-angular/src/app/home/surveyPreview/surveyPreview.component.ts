import { CookieService } from 'ngx-cookie-service';
import { SurveyManagementService } from './../surveyManagement.service';
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Survey, SurveyOption } from 'src/models/Survey';
import { Chart } from 'chart.js';
import { User } from 'src/models/User';

@Component({
  selector: "app-surveyPreview",
  templateUrl: "./surveyPreview.component.html",
  styleUrls: ["./surveyPreview.component.scss"]
})

export class SurveyPreviewComponent implements OnInit, AfterViewInit {

  @Input() survey: Survey;
  @Input() admin: boolean;
  @Input() friendOptionSelected: Number;
  voted: boolean;
  liked: boolean = false;
  warned: boolean = false;
  optionVotedTxt: String;
  mapSelectedViewResult = {
    "list": true,
    "heatmap": false,
    "sex": false,
    "donut": false
  };

  mapDataSex = {
    "H": [],
    "F": []
  }

  mapDataDonut = {
    "dataFix": [],
  }

  mapDataHeat = {
  }
  maxValueHeat = 0;

  //GRAPHES
  @ViewChild('sexBarsGraph', null) sexBarsGraph: ElementRef;
  sexBarsChart = [];
  @ViewChild('donutGraph', null) donutGraph: ElementRef;
  donutChart = [];

  constructor(private sanitizer: DomSanitizer, private surveyManagementService: SurveyManagementService, private cookieService: CookieService, private elementRef: ElementRef) { }

  ngOnInit() {
    if (this.admin) {
      this.voted = false;
    } else {
      this.survey.warnings = this.survey.warnings ? this.survey.warnings : 0;
      if (this.cookieService.get('WS-mapVote')) {
        let mapVote = JSON.parse(this.cookieService.get('WS-mapVote'));
        if (Object.keys(mapVote).indexOf("" + this.survey.id) > -1) {
          this.voted = true;
          this.optionVotedTxt = mapVote["" + this.survey.id];
          this.computeStats();
        }
      } else {
        this.voted = false;
      }

      if (this.cookieService.get('WS-mapLike')) {
        let mapLike = JSON.parse(this.cookieService.get('WS-mapLike'));
        if (Object.keys(mapLike).indexOf("" + this.survey.id) > -1) {
          this.liked = mapLike["" + this.survey.id];
        }
      }

      if (this.cookieService.get('WS-listWarning')) {
        let listWarning = this.cookieService.get('WS-listWarning').split(",");
        if (listWarning.indexOf("" + this.survey.id) > -1) {
          this.warned = true;
        }
      }
    }
  }

  vote(option: SurveyOption) {
    this.voted = true;
    this.optionVotedTxt = option.text;
    this.survey.participations += 1;
    this.surveyManagementService.vote(this.survey, option);
    setTimeout(() => { this.computeStats() }, 1400);
  }

  like() {
    this.liked = !this.liked;
    if (this.liked) {
      this.survey.likes += 1;
    } else {
      this.survey.likes -= 1;
    }
    this.surveyManagementService.likeOrDislike(this.survey, this.liked);
  }

  warn() {
    this.warned = !this.warned;
    if (this.warned) {
      this.survey.warnings += 1;
    } else {
      this.survey.warnings -= 1;
    }

    this.surveyManagementService.addWarning(this.survey, this.warned);
  }

  computeStats() {
    let catAge = ["-18", "18-30", "30-40", "40+"]
    this.survey.options.forEach((oneOption) => {
      this.mapDataDonut["dataFix"].push(oneOption.number);
      let oneDataHeat = [0, 0, 0, 0]
      let numberH = 0;
      let numberF = 0;
      oneOption.users.forEach((user) => {
        if (user.sex == 'H') {
          numberH += 1
        } else {
          numberF += 1
        }
        //On ajoute le pourcentage
        oneDataHeat[catAge.indexOf("" + user.age)] += 100 / (this.survey.participations);
      })
      this.mapDataSex["H"].push(numberH);
      this.mapDataSex["F"].push(numberF);
      let oneDataHeatPer = []
      oneDataHeat.forEach((percent) => {
        oneDataHeatPer.push(Math.floor(percent * 10) / 10);
      })
      this.mapDataHeat[["A", "B", "C", "D", "E", "F"][Object.keys(this.mapDataHeat).length]] = oneDataHeatPer;
      this.maxValueHeat = Math.max(Math.max(...oneDataHeat), this.maxValueHeat);
    })
  }

  selectViewResult(key: string) {
    this.mapSelectedViewResult = {
      "list": false,
      "heatmap": false,
      "sex": false,
      "donut": false
    };
    this.mapSelectedViewResult[key] = true;
    this.ngAfterViewInit();
  }

  copyShareLink() {
    let idxAnswer = 0
    for (var k = 0; k < this.survey.options.length; k++) {
      if (this.survey.options[k].text == this.optionVotedTxt) {
        idxAnswer = k
      }
    }
    var str = window.location.host + "/#/sharedSurvey?id=" + this.survey.id + "&r=" + String(Math.floor(Math.random() * 9999)) + String(idxAnswer);
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
  }

  copyToClipboard() {
    let textarea;
    let result;

    let idxAnswer = 0
    for (var k = 0; k < this.survey.options.length; k++) {
      if (this.survey.options[k].text == this.optionVotedTxt) {
        idxAnswer = k
      }
    }
    var string = window.location.host + "/#/sharedSurvey?id=" + this.survey.id + "&r=" + String(Math.floor(Math.random() * 9999)) + String(idxAnswer);
    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', true);
      textarea.setAttribute('contenteditable', true);
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = string;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand('copy');
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }
    return true;
  }

  ngAfterViewInit() {
    // sexChart
    if (this.mapSelectedViewResult['sex']) {
      this.sexBarsChart.push(new Chart(this.sexBarsGraph.nativeElement.getContext('2d'),
        {
          type: 'bar',
          data: {
            labels: ['A', 'B', "C", "D", "E", "F"].slice(0, this.survey.options.length),
            datasets: [
              {
                label: "H",
                backgroundColor: "#0D6EA3",
                data: this.mapDataSex["H"]
              },
              {
                label: "F",
                backgroundColor: "#F8FF42",
                data: this.mapDataSex["F"]
              }
            ]
          },

          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              xAxes: [{
                gridLines: {
                  display: false,
                },
                stacked: true
              }],
              yAxes: [{
                gridLines: {
                  display: false,
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

    // donutChart
    if (this.mapSelectedViewResult['donut']) {
      this.donutChart.push(new Chart(this.donutGraph.nativeElement.getContext('2d'),
        {
          type: 'doughnut',
          data: {
            labels: ['A', 'B', "C", "D", "E", "F"].slice(0, this.survey.options.length),
            datasets: [{
              data: this.mapDataDonut["dataFix"],
              backgroundColor: ["#B9B9BA", "#2A2A2A", "#C4E5FF", "#FDFFC4", "#85ffc1", "#d085ff"].slice(0, this.survey.options.length)
            }]
          },

          options: {
            scales: {
              xAxes: [{
                gridLines: {
                  display: false,
                },
                ticks: {
                  display: false
                }
              }],
              yAxes: [{
                gridLines: {
                  display: false,
                },
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