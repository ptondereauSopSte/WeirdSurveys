import { Component, OnInit } from "@angular/core";
import { Survey } from 'src/models/Survey';
import { SurveyManagementService } from '../surveyManagement.service';

@Component({
  selector: "app-AddSurvey",
  templateUrl: "./AddSurvey.component.html",
  styleUrls: ["./AddSurvey.component.scss"]
})

export class AddSurveyComponent implements OnInit {

  newSurvey: Survey = new Survey();
  newOptionTxt: String = new String();
  isAddingOption: boolean = false;
  isFull: boolean = false;
  isCorrect: boolean = false;

  constructor(private surveyManagementService: SurveyManagementService) { }

  ngOnInit() {
  }

  submitSurvey() {
    this.surveyManagementService.postSurvey(this.newSurvey);
  }

  addOption() {
    this.isAddingOption = false;
    this.newSurvey.addOption(this.newOptionTxt);
    this.newOptionTxt = "";
    this.checkIfSurveyIsCorrect();
    this.isFull = this.newSurvey.options.length == 6;
  }

  deleteOption(textOptionToDelete: String) {
    this.newSurvey.deleteOption(textOptionToDelete);
    this.isFull = false;
  }

  openNewOption() {
    this.isAddingOption = true;
  }

  checkIfSurveyIsCorrect() {
    const listCat = ["sex", "love", "society", "useless", "sport", "news", "art", "life", "music"]
    this.isCorrect = this.newSurvey.options.length >= 2 && this.newSurvey.text != "" && listCat.indexOf("" + this.newSurvey.category) > -1;
  }
}
