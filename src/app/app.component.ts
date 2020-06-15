import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogChangelogComponent } from './dialog-changelog/dialog-changelog.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppInstallComponent } from 'app/app-install/app-install.component';
import { TabsService } from 'app/tabs.service';
import { DialogSupportComponent } from 'app/dialog-support/dialog-support.component';
import { fadeInOut } from 'app/animations';
import { SwUpdate } from '@angular/service-worker';
import { UpdateComponent } from 'app/update/update.component';
import { SettingsService, Settings } from 'app/services/settings.service';

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

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    if (this.update.isEnabled) {
      console.log('checking for update');
      this.update.checkForUpdate();
    }
  }

  constructor(
    private dialog: MatDialog,
    private overlayContainer: OverlayContainer,
    private settingsService: SettingsService,
    private snackbarService: MatSnackBar,
    public tabsService: TabsService,
    private update: SwUpdate,
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
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt fired')
      event.preventDefault();
      this.snackbarService.openFromComponent(AppInstallComponent, { data: event });
    });
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
    this.tabsService.addTab('automation-science-pack');
  }

  public switchTheme() {
    this.darkTheme = !this.darkTheme;
    this.settingsService.setValue(Settings.DARK_THEME, this.darkTheme);
    this.setThemeToOverlay();
  }

  // public selectPreviousTab() {
  //   for (let i = this.activeTabId; i >= 0; i--) {
  //     if (this.tabs[i] != null) {
  //       this.activeTabId = i;
  //       return;
  //     }
  //   }
  //   for (let i = this.activeTabId + 1; i < this.tabs.length; i++) {
  //     if (this.tabs[i] != null) {
  //       this.activeTabId = i;
  //       return;
  //     }
  //   }
  //   this.activeTabId = -1;
  //   this.noTabs = true;
  // }
}
