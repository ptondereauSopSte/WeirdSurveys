import { Component, OnInit } from "@angular/core";
import { AdminService } from './admin.service';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})

export class AdminComponent implements OnInit {
  
  login:String;
  mdp:String;

  wrongInfo:boolean=false;

  constructor(private adminService : AdminService) {}

  ngOnInit() {}

  connect(){
    if(!this.adminService.connect(this.login, this.mdp)){
      this.wrongInfo=true;
    }  
  }
}
