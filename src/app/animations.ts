import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', animate('500ms ease-out', keyframes([
    style({ opacity: 0, height: 0, width: 0, padding: 0, offset: 0 }),
    style({ opacity: 0, height: '*', width: '*', padding: '*', offset: .5 }),
    style({ opacity: 1, offset: 1 }),
  ]))),
  transition(':leave', animate('500ms ease-out', keyframes([
    style({ opacity: 0, height: '*', width: '*', padding: '*', offset: .5 }),
    style({ height: 0, width: 0, padding: 0, offset: 1 }),
  ]))),
]);

export const reveal = trigger('reveal', [
  transition(':enter', [
    style({ paddingTop: 0, paddingBottom: 0, height: 0, overflow: 'hidden' }),
    animate('500ms ease-out', style({ paddingTop: '*', paddingBottom: '*', height: '*' }))
  ]),
  transition(':leave', [
    style({ overflow: 'hidden' }),
    animate('500ms ease-out', style({ paddingTop: 0, paddingBottom: 0, height: 0, overflow: 'hidden' }))
  ]),
]);

export const fadeInOut2 = trigger('fadeInOut', [
  state('void', style({
    opacity: '0',
  })),
  transition(':enter', animate('500ms ease-out', style({
    opacity: '1',
  }))),
  transition(':leave', animate('500ms ease-out', style({
    opacity: '0',
  }))),
]);