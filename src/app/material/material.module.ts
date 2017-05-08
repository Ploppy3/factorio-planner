import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonModule,
  MdIconModule,
  MdAutocompleteModule,
  MdInputModule,
  MdSelectModule,
  MdCheckboxModule,
  MdDialogModule,
} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MdButtonModule,
    MdIconModule,
    MdAutocompleteModule,
    MdInputModule,
    MdSelectModule,
    MdCheckboxModule,
    MdDialogModule,
  ],
  declarations: []
})
export class MaterialModule { }