import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-identification",
  templateUrl: "./identification.component.html",
  styleUrls: ["./identification.component.scss"]
})

export class IdentificationComponent implements OnInit {
  listAge: any;
  constructor() { 

  }

  ngOnInit() {
    this.listAge=[
      {
        "id":1,
        "text":"-18",
      },
      {
        "id":2,
        "text":"18-30",
      },
      {
        "id":3,
        "text":"30-40",
      },
      {
        "id":4,
        "text":"40+",
      }
    ]
  }
}
