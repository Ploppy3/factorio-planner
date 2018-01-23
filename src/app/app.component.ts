import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
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
  providers: [DataService, PlannerService],
  animations: [
    trigger('tips',[
      state('hidden', style({
        display: 'none',
      })),
      transition('visible => hidden', [
        animate('.5s ease-in-out', style({
          height: 0,
          margin: 0,
          paddingTop: 0,
          paddingBottom: 0,
          opacity: 0,
        }))
      ])
    ])
  ],
})
export class AppComponent implements OnInit {

  @ViewChild('outputNode') outputNode: VirtualOutputNodeComponent;

  public showTips = true;
  public appVersion: string = version;
  public dataVersion: string = this.dataService.dataVersions[0].name;

  constructor(
    public dataService: DataService,
    private plannerService: PlannerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.dataService.outputNode = this.outputNode;
  }

  public reloadData() {
    this.dataService.selectVersion(this.dataVersion);
    //this.outputNode.fullRefresh();
  }

  public showChangelog() {
    this.dialog.open(DialogChangelogComponent);
  }
}