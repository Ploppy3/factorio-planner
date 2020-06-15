import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

// import { Node } from "../node";
import { TreeNode } from '../tree-node';
import { DataService } from '../data.service';
import { PlannerService } from '../planner.service';
import { reveal } from '../animations';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css'],
  animations: [
    reveal,
    trigger('nodeVisibility', [
      state('visible', style({ display: '*' })),
      state('invisible', style({ display: 'none' })),
    ]),
  ],
})
export class TreeNodeComponent implements OnInit, OnChanges {

  @Input() nodeId: number = -1;

  public showChilds = true;
  public node: TreeNode;

  constructor(
    public plannerService: PlannerService,
  ) { }

  ngOnInit() {
    this.init();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  public init(){
    if (!this.plannerService.virtualTree[this.nodeId]) {
      console.log('can\'t find node with id', this.nodeId);
    } else {
      this.node = this.plannerService.virtualTree[this.nodeId];
      this.node.calculate();
    }
  }
}
