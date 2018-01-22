import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material";

import { VirtualOutputNodeComponent } from "./virtual-output-node/virtual-output-node.component";
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

  @ViewChild('outputNode') outputNode: VirtualOutputNodeComponent;

  public appVersion: string = version;
  public dataVersion: string = this.dataService.dataVersions[0].name;

  constructor(
    public dataService: DataService,
    private plannerService: PlannerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  public reloadData() {
    this.dataService.selectVersion(this.dataVersion);
    this.outputNode.fullRefresh();
  }

  public showChangelog() {
    this.dialog.open(DialogChangelogComponent);
  }
}