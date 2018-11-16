import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDialogModule,
  MatMenuModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatRippleModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatRippleModule,
  ],
  providers: [
  ],
  declarations: []
})
export class MaterialModule { }
