import { Component, OnInit } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dialog-support',
  templateUrl: './dialog-support.component.html',
  styleUrls: ['./dialog-support.component.scss'],
  animations: [
    trigger('revealImage', [
      state('notLoaded', style({
        height: 0,
        opacity: 0,
      })),
      state('loaded', style({
        height: '*',
        opacity: 1,
      })),
      transition('notLoaded -> loaded', [
        style({
          height: 0,
          opacity: 0,
        }),
        animate('.25s 0s ease', style({
          height: '*',
        })),
        animate('.25s 0s ease', style({
          opacity: 1,
        })),
      ]),
    ]),
  ]
})
export class DialogSupportComponent implements OnInit {

  public imageLoaded = false;

  constructor() { }

  ngOnInit() {
  }

}
