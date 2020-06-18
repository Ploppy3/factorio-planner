import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.scss']
})
export class HorizontalScrollerComponent implements OnInit {

  @Input() paddingLeft = 16;
  @Input() paddingRight = 16;

  constructor() { }

  ngOnInit() {
  }

}
