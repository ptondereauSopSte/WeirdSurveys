import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'NewProject';
  isLoaded=false;
  isAnimationClosed=false;

  constructor(private router : Router){}
  ngOnInit(){
    setTimeout(()=>{
      this.isLoaded=true
      setTimeout(()=>{
        this.isAnimationClosed=true;
      },400);
    },3000)
  }
}
