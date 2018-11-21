import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  public tabName$ = new Subject<{ index: number, name: string }>();

  private tabs: string[] = [];

  constructor() {
    console.log('constructor');
  }

  public setTabs(tabs: string[]) {
    this.tabs = tabs;
  }

  /**Returns the id of the last tab */
  public getLastTabId(): number {
    return this.tabs.length - 1;
  }
}
