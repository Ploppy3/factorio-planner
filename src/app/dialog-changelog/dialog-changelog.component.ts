import { Component, OnInit, VERSION } from '@angular/core';
import { Version, Versions } from 'changelog';
import { FormControl } from '@angular/forms';
import { SettingsService, Settings } from 'app/services/settings.service';

const { version } = require('../../../package.json');

@Component({
  selector: 'app-dialog-changelog',
  templateUrl: './dialog-changelog.component.html',
  styleUrls: ['./dialog-changelog.component.css']
})
export class DialogChangelogComponent implements OnInit {

  public angularVersion = VERSION.full;
  public appVersion: string = version;
  public versions = Versions;
  public controlShowTips = new FormControl(this.settingsService.get(Settings.SHOW_TIPS_ON_STARTUP, true))

  constructor(
    public settingsService: SettingsService,
  ) { }

  ngOnInit() {
    this.controlShowTips.valueChanges.subscribe(value => {
      this.settingsService.setValue(Settings.SHOW_TIPS_ON_STARTUP, value);
    }
    )
  }
}
