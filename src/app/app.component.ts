import { Component, OnInit, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogChangelogComponent } from './dialog-changelog/dialog-changelog.component';

import { OverlayContainer } from '@angular/cdk/overlay';
import { SettingsService, Settings } from 'app/settings-service.service';
import { AppInstallComponent } from 'app/app-install/app-install.component';
import { TabsService } from 'app/tabs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('tips', [
      state('hidden', style({
        display: 'none',
      })),
      transition('visible => hidden', [
        animate('.5s ease-in-out', style({
          height: 0,
          margin: 0,
          paddingTop: 0,
          paddingBottom: 0,
          opacity: 0,
        })),
      ]),
    ]),
    trigger('tabButton', [
      transition(':enter', [
        style({
          width: 0,
          opacity: 0,
        }),
        animate('.25s ease-in-out', style({
          width: '*',
        })),
        animate('.25s ease-in-out', style({
          opacity: 1,
        })),
      ]),
      transition(':leave', [
        animate('.25s ease-in-out', style({
          opacity: 0,
        })),
        animate('.25s ease-in-out', style({
          width: 0,
        })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {

  @HostBinding('class.dark-theme') darkTheme = false;

  public showTips = true;
  public tabs: string[] = [];
  public activeTabId = 0;

  constructor(
    private dialog: MatDialog,
    private overlayContainer: OverlayContainer,
    private settingsService: SettingsService,
    private matSnackbar: MatSnackBar,
    private tabsService: TabsService,
  ) {
    this.darkTheme = settingsService.getBoolean(Settings.DARK_THEME, false);
    this.setThemeToOverlay();
  }

  ngOnInit() {
    this.tabsService.tabName$.subscribe(change => {
      this.tabs[change.index] = change.name;
    });
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt fired')
      event.preventDefault();
      this.matSnackbar.openFromComponent(AppInstallComponent, { data: event });
    });
    this.tabs.push('science-pack-1');
    this.tabsService.setTabs(this.tabs);
  }

  public onThemeChange(darkTheme: boolean) {
    this.settingsService.setValue(Settings.DARK_THEME, darkTheme);
    this.setThemeToOverlay();
  }

  private setThemeToOverlay() {
    if (this.darkTheme) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }

  public showChangelog() {
    this.dialog.open(DialogChangelogComponent);
  }

  public trackByTabButton(id: number, item) {
    return id;
  }

  public onClick_addTabButton() {
    this.tabs.push('science-pack-1');
    this.tabsService.setTabs(this.tabs);
    this.activeTabId = this.tabs.length - 1
  }

  public selectPreviousTab() {
    for (let i = this.activeTabId; i >= 0; i--) {
      if (this.tabs[i] != null) {
        this.activeTabId = i;
        return;
      }
    }
    for (let i = this.activeTabId + 1; i < this.tabs.length; i++) {
      if (this.tabs[i] != null) {
        this.activeTabId = i;
        return;
      }
    }
    this.activeTabId = -1;
  }
}
