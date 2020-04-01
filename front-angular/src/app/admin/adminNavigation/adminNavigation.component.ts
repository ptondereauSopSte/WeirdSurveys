import { Component, OnInit } from "@angular/core";
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-adminNavigation",
  templateUrl: "./adminNavigation.component.html",
  styleUrls: ["./adminNavigation.component.scss"]
})

export class AdminNavigationComponent implements OnInit {

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    if (!this.adminService.isConnected) {
      this.router.navigate(['admin'])
    }
  }
}
