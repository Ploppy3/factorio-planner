import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { Observable } from "rxjs/Observable";

//import { Node } from "../node";
import { VirtualNode } from "../virtual-node";
import { DataService } from "../data.service";
import { PlannerService } from "../planner.service";
import { reveal } from "../animations";

@Component({
  selector: 'app-virtual-node',
  templateUrl: './virtual-node.component.html',
  styleUrls: ['./virtual-node.component.css'],
  animations: [
    reveal,
    trigger('nodeVisibility', [
      state('visible', style({ display: '*' })),
      state('invisible', style({ display: 'none' })),
    ]),
  ],
})
export class VirtualNodeComponent implements OnInit {

  @Input() nodeId: number;

  public showChilds: boolean = true;
  public node: VirtualNode;

  constructor(
    public dataService: DataService,
    public plannerService: PlannerService,
  ) {
  }

  ngOnInit() {
    //this.node.findRecipeByName();
    //this.findRecipeByName(this.node.name);
    if (!this.plannerService.virtualTree[this.nodeId]) {
      console.log("can't find node with id", this.nodeId);
    }
    this.node = this.plannerService.virtualTree[this.nodeId];
  }
}
