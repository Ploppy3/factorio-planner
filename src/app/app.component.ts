import { Component, OnInit } from '@angular/core';

import { DataService } from "./data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent implements OnInit {

  private readonly OPEN_BRACE: number = 0;
  private readonly CLOSE_BRACE: number = 1;

  constructor(
  ){}

  ngOnInit() {
  }
}