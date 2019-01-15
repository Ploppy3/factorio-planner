import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'app/planner.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {

  constructor(
    private plannerService: PlannerService,
  ) { }

  ngOnInit() {

  }

}
