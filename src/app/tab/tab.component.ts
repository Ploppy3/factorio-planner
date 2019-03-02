import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'app/data.service';
import { PlannerService } from 'app/planner.service';
import { OutputTreeNodeComponent } from 'app/output-tree-node/output-tree-node.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  providers: [DataService, PlannerService],
})
export class TabComponent implements OnInit {

  @ViewChild('outputNode') outputNode: OutputTreeNodeComponent;

  public dataVersion = this.dataService.dataVersions[0].name;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.outputNode = this.outputNode;
  }

  public reloadData() {
    console.log('control_version.changes')
    this.dataService.selectVersion(this.dataVersion);
    // this.outputNode.getNode();
  }

}
