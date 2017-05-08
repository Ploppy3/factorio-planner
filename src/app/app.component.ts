import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog } from "@angular/material";

import { OutputNodeComponent } from "./output-node/output-node.component";
import { DataService } from "./data.service";
import { PlannerService } from "./planner.service";
import { DialogChangelogComponent } from "./dialog-changelog/dialog-changelog.component";

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
  public dataVersionId: number = 0;

  private readonly OPEN_BRACE: number = 0;
  private readonly CLOSE_BRACE: number = 1;

  constructor(
    public dataService: DataService,
    private plannerService: PlannerService,
    private mdDialog: MdDialog,
  ){}

  ngOnInit() {
  }

  public reloadData() {
    this.dataService.loadData(0);
    this.outputNode.fullRefresh();
  }

  public showChangelog() {
    this.mdDialog.open(DialogChangelogComponent);
  }
}