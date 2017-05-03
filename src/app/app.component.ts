import { Component, OnInit } from '@angular/core';

import { DataService } from "./data.service";

declare var require: any;
const { version } = require('../../package.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent implements OnInit {

  public version: string = version;

  private readonly OPEN_BRACE: number = 0;
  private readonly CLOSE_BRACE: number = 1;

  constructor(
  ){}

  ngOnInit() {
  }
}