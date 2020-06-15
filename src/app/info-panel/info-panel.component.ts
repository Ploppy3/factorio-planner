import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'app/tree-node';
import { PlannerService } from 'app/planner.service';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit {

  @Input() node: TreeNode;

  constructor(
    public plannerService: PlannerService
  ) { }

  ngOnInit() {
  }

}
