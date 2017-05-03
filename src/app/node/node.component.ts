import { Component, OnInit, Input } from '@angular/core';

import { Node } from "../node";
import { fadeInOut, reveal } from "../animations";
import { DataService } from "../data.service";

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
  animations: [fadeInOut, reveal],
})
export class NodeComponent extends Node implements OnInit {

  @Input() node: Node;

  constructor(
    public dataService: DataService,
  ) {
    super();
  }

  ngOnInit() {
    this.node.findRecipeByName(this.dataService);
    //this.findRecipeByName(this.node.name);
  }

  public deleteNode() {
    let index = this.node.parent.childs.indexOf(this.node);
    if (index > -1) {
      this.node.parent.childs.splice(index, 1);
    } else {
      console.warn("can't find node to delete in parent");
    }
  }

}
