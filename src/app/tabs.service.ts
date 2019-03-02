import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  public tabName$ = new Subject<{ tabId: number, name: string }>();

  private tabs: string[] = [];

  constructor() {
    console.log('constructor');
  }

  public setTabs(tabs: string[]) {
    this.tabs = tabs;
  }

  public getLastTabId(): number {
    return this.tabs.length - 1;
  }
}
