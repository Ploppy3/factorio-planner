import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'app/services/planner.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {

  public virtualTree;
  public diagram = [];

  constructor(
    private plannerService: PlannerService,
  ) { }

  ngOnInit() {
    this.plannerService.virtualDiagram.subscribe(() => {
      // this.virtualTree = this.plannerService.virtualTree;
      // console.log(this.virtualTree);
      // this.computeDiagram();
    });
  }

  private computeDiagram() {
  }

}
