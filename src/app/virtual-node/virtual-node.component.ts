import { Component, OnInit, Input } from '@angular/core';

import { Observable } from "rxjs/Observable";

//import { Node } from "../node";
import { VirtualNode } from "../virtual-node";
import { DataService } from "../data.service";
import { PlannerService } from "../planner.service";

@Component({
  selector: 'app-virtual-node',
  templateUrl: './virtual-node.component.html',
  styleUrls: ['./virtual-node.component.css']
})
export class VirtualNodeComponent implements OnInit {

  @Input() nodeId: number;
  
  public showChilds: boolean = true;
  public node: VirtualNode;

  constructor(
    public dataService: DataService,
    public plannerService : PlannerService,
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
