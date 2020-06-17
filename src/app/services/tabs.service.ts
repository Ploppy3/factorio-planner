import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsService, Settings } from 'app/services/settings.service';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  public tabs$ = new BehaviorSubject([]);
  public idActiveTab$ = new BehaviorSubject(0);
  public tabsCount$ = new BehaviorSubject(0);

  constructor(
    private settingsService: SettingsService
  ) {
    console.log('constructor');
    const tabs = this.settingsService.get(Settings.TABS, ['automation-science-pack']);
    if (isArray(tabs)) {
      if (tabs.length > 0) {
        this.tabs$.next(tabs);
      } else {
        this.tabs$.next(['automation-science-pack']);
      }
    } else {
      this.tabs$.next(['automation-science-pack']);
    }
    this.updateTabsCount()
  }

  public getLastTabId(): number {
    return this.tabs$.value.length - 1;
  }

  public addTab(name: string) {
    this.tabs$.next([...this.tabs$.value, name]);
    this.updateTabsCount()
    this.idActiveTab$.next(this.tabs$.value.length - 1);
    this.saveTabs();
  }

  public selectTab(id: number) {
    this.idActiveTab$.next(id);
  }

  public removeTab(id: number) {
    const tabs = this.tabs$.value;
    tabs[id] = null;
    this.tabs$.next(tabs);
    this.updateTabsCount()
    if (id === this.idActiveTab$.value) {
      this.selectPreviousTab();
    }
    this.saveTabs();
  }

  public selectPreviousTab() {
    for (let i = this.idActiveTab$.value; i >= 0; i--) {
      if (this.tabs$.value[i] !== null) {
        this.idActiveTab$.next(i);
        return;
      }
    }
    for (let i = this.idActiveTab$.value + 1; i < this.tabs$.value.length; i++) {
      if (this.tabs$.value[i] !== null) {
        this.idActiveTab$.next(i);
        return;
      }
    }
    this.idActiveTab$.next(1);
  }

  public renameTab(id: number, name: string) {
    const tabs = this.tabs$.value;
    tabs[id] = name;
    this.tabs$.next(tabs);
    this.updateTabsCount()
    this.saveTabs();
  }

  public updateTabsCount() {
    let count = 0;
    this.tabs$.value.forEach(tab => {
      if (tab) {
        count++
      }
    })
    this.tabsCount$.next(count)
  }

  private saveTabs() {
    const tabs = [];
    this.tabs$.value.forEach(name => {
      if (name !== null) {
        tabs.push(name);
      }
    });
    this.settingsService.setValue(Settings.TABS, tabs);
  }

}
