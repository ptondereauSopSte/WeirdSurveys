import { Component, OnInit, Input } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/models/User';
import { Router } from '@angular/router';

@Component({
  selector: "app-identification",
  templateUrl: "./identification.component.html",
  styleUrls: ["./identification.component.scss"]
})

export class IdentificationComponent implements OnInit {
  sharedSurvey:boolean = false;
  listAge: any;
  user:User = new User();
  userValid:boolean=false;

  constructor(private router : Router, private cookieService: CookieService) { 

  }

  ngOnInit() {
    if (window.location.href.includes("ss=true")){
      this.sharedSurvey=true
    }

    if (this.cookieService.get('WS-user') && this.checkUserValidation(this.cookieService.get('WS-user'))){
      this.router.navigate(['home']);
    }
    this.listAge=["-18","18-30","30-40","40+"]
  }

  selectSex(sex : String){
    this.user.sex=sex;
    this.checkUserValidation(this.user);
  }

  selectAge(age : String){
    this.user.age=age;
    this.checkUserValidation(this.user);
  }

  checkUserValidation(user){
    this.userValid = this.listAge.indexOf(user.age) >-1 && ['H', 'F'].indexOf(user.sex)>-1;
    return this.userValid;
  }

  //On met l'user en session
  userSubmit(){
    this.cookieService.set('WS-user', JSON.stringify(this.user), 365);
    this.cookieService.set('WS-mapVote',"{}", 365);
    this.cookieService.set('WS-mapLike',"{}", 365);
    this.cookieService.set('WS-mapLike',"{}", 365);
    if(!this.sharedSurvey){
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['sharedSurvey'], { queryParams: { id: window.location.href.split("id=")[1].split("&")[0]} });
    }
  }
}
