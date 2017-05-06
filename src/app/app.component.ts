import { Component, OnInit, ViewChild } from '@angular/core';

import { OutputNodeComponent } from "./output-node/output-node.component";
import { DataService } from "./data.service";
import { PlannerService } from "./planner.service";

declare var require: any;
const { version } = require('../../package.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataService, PlannerService]
})
export class AppComponent implements OnInit {

  @ViewChild('outputNode') outputNode: OutputNodeComponent;

  public appVersion: string = version;
  public dataVersionId: number = this.dataService.dataVersions.length - 1;

  private readonly OPEN_BRACE: number = 0;
  private readonly CLOSE_BRACE: number = 1;

  constructor(
    private dataService: DataService,
    private plannerService: PlannerService,
  ){}

  ngOnInit() {
  }

  public reloadData() {
    this.dataService.loadData(this.dataVersionId);
    this.outputNode.reload();
  }
}