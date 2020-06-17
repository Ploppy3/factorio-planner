import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-version',
  templateUrl: './add-version.component.html',
  styleUrls: ['./add-version.component.scss']
})
export class AddVersionComponent implements OnInit {

  @ViewChild('inputFile', { static: true }) inputFile: ElementRef<HTMLInputElement>

  public controlFile = new FormControl()

  constructor(
    private dialogRef: MatDialogRef<AddVersionComponent>,
    private snackbarService: MatSnackBar,
  ) { }

  ngOnInit() {
    this.controlFile.valueChanges.subscribe(path => {
      if (path) {
        const reader = new FileReader()
        reader.readAsText(this.inputFile.nativeElement.files[0], 'UTF-8')
        reader.onload = (event) => {
          // console.log(event.target.result)
          try {
            const json = JSON.parse(event.target.result as string)
            this.dialogRef.close(json)
          } catch (error) {
            this.snackbarService.open('An error occured while loading the file!', 'OK')
          }
        }
      }
    })
  }

}
