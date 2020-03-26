import { Component, OnInit } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/models/User';
import { Router } from '@angular/router';

@Component({
  selector: "app-identification",
  templateUrl: "./identification.component.html",
  styleUrls: ["./identification.component.scss"]
})

export class IdentificationComponent implements OnInit {
  listAge: any;
  user:User = new User();
  userValid:boolean=false;
  constructor(private router : Router, private cookieService: CookieService) { 

  }

  ngOnInit() {
    if (this.cookieService.get('WS-user')){
      this.router.navigate(['home']);
    }
    this.listAge=["-18","18-30","30-40","40+"]
  }

  selectSex(sex : String){
    this.user.sex=sex;
    this.checkUserValidation();
  }

  selectAge(age : String){
    this.user.age=age;
    this.checkUserValidation();
  }

  checkUserValidation(){
    this.userValid = this.user.age !== '' && this.user.sex !== '';
  }

  //On met l'user en session
  userSubmit(){
    this.cookieService.set('WS-user', JSON.stringify(this.user));
    this.cookieService.set('WS-mapVote',"{}")
    this.cookieService.set('WS-mapLike',"{}")
    this.cookieService.set('WS-mapLike',"{}")
    this.router.navigate(['home']);
  }
}
