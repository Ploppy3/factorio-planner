import { Component, OnInit, Input } from '@angular/core';

import { Observable } from "rxjs/Observable";

import { Node } from "../node";
import { DataService } from "../data.service";
import { PlannerService } from "../planner.service";

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @Input() node: Node;
  
  public showChilds: boolean = true;

  constructor(
    public dataService: DataService,
    public plannerService : PlannerService,
  ) { }

  ngOnInit() {
    this.node.findRecipeByName();
    //this.findRecipeByName(this.node.name);
  }

}
