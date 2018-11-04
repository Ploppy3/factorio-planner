import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';

import { VirtualOutputNodeComponent } from './virtual-output-node/virtual-output-node.component';
import { DataService } from './data.service';
import { PlannerService } from './planner.service';
import { DialogChangelogComponent } from './dialog-changelog/dialog-changelog.component';

import { OverlayContainer } from '@angular/cdk/overlay';
import { SettingsService, Settings } from 'app/settings-service.service';

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataService, PlannerService],
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
        }))
      ])
    ])
  ],
})
export class AppComponent implements OnInit {

  @HostBinding('class.dark-theme') darkTheme = false;
  @ViewChild('outputNode') outputNode: VirtualOutputNodeComponent;

  public showTips = true;
  public dataVersion: string = this.dataService.dataVersions[0].name;

  constructor(
    public dataService: DataService,
    private dialog: MatDialog,
    private overlayContainer: OverlayContainer,
    private settingsService: SettingsService,
  ) {
    this.darkTheme = settingsService.getBoolean(Settings.DARK_THEME, false);
    this.setThemeToOverlay();
  }

  ngOnInit() {
    this.dataService.outputNode = this.outputNode;
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

  public reloadData() {
    this.dataService.selectVersion(this.dataVersion);
  }

  public showChangelog() {
    this.dialog.open(DialogChangelogComponent);
  }
}
