import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-app-install',
  templateUrl: './app-install.component.html',
  styleUrls: ['./app-install.component.scss']
})
export class AppInstallComponent implements OnInit {

  public installEvent;

  constructor(
    public snackbarRef: MatSnackBarRef<AppInstallComponent>,
    @Inject(MAT_SNACK_BAR_DATA) data: Event,
  ) {
    this.installEvent = data;
  }

  ngOnInit() {
  }

}
