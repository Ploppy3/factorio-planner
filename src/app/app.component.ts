import { Component, OnInit, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogChangelogComponent } from './dialog-changelog/dialog-changelog.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SettingsService, Settings } from 'app/settings-service.service';
import { AppInstallComponent } from 'app/app-install/app-install.component';
import { TabsService } from 'app/tabs.service';
import { DialogSupportComponent } from 'app/dialog-support/dialog-support.component';
import { fadeInOut } from 'app/animations';
import { SwUpdate } from '@angular/service-worker';
import { UpdateComponent } from 'app/update/update.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInOut,
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
  public noTabs = false;

  constructor(
    private dialog: MatDialog,
    private overlayContainer: OverlayContainer,
    private settingsService: SettingsService,
    private snackbarService: MatSnackBar,
    private tabsService: TabsService,
    update: SwUpdate,
  ) {
    this.darkTheme = settingsService.getBoolean(Settings.DARK_THEME, false);
    this.setThemeToOverlay();

    // --- Update check
    update.available.subscribe(event => {
      console.log('available', event.available, 'current', event.current);
      this.snackbarService.openFromComponent(UpdateComponent);
    });
    update.activated.subscribe(event => {
      console.log('current', event.current, 'previous', event.previous);
    });
  }

  ngOnInit() {
    this.tabsService.tabName$.subscribe(change => {
      this.tabs[change.tabId] = change.name;
    });
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt fired')
      event.preventDefault();
      this.snackbarService.openFromComponent(AppInstallComponent, { data: event });
    });
    this.tabs.push('science-pack-1');
    this.tabsService.setTabs(this.tabs);
  }

  private setThemeToOverlay() {
    if (this.darkTheme) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }

  public openDialogSupport() {
    this.dialog.open(DialogSupportComponent);
  }

  public showChangelog() {
    this.dialog.open(DialogChangelogComponent);
  }

  public trackByTabButton(id: number, item) {
    return id;
  }

  public addTab() {
    this.noTabs = false;
    this.tabs.push('science-pack-1');
    this.tabsService.setTabs(this.tabs);
    this.activeTabId = this.tabs.length - 1
  }

  public switchTheme() {
    this.darkTheme = !this.darkTheme;
    this.settingsService.setValue(Settings.DARK_THEME, this.darkTheme);
    this.setThemeToOverlay();
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
    this.noTabs = true;
  }
}

/*
@Component({
  selector: 'app-update',
  template: `<div>Update available
  <button class="uppercase" (click)="restart()" mat-flat-button>
  <span>Restart</span>
  </button>
  </div>`,
  styles: ['button{ margin-left: 8px; }'],
})
export class UpdateComponent {
  public restart() {
    window.location.reload();
  }
}
*/
