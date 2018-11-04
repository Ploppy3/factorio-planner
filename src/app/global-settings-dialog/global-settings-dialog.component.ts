import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-global-settings-dialog',
  templateUrl: './global-settings-dialog.component.html',
  styleUrls: ['./global-settings-dialog.component.scss']
})
export class GlobalSettingsDialogComponent implements OnInit {

  public machines: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<GlobalSettingsDialogComponent>,
  ) { }

  ngOnInit() {

  }

  public setMachines(machines: any[]) {
    // *
    machines.forEach(machine => {
      this.machines.push(Object.create(machine));
    });
    // */
  }

  public saveAndClose() {
    this.dialogRef.close(this.machines);
  }

}
