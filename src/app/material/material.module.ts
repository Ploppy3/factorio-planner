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
  MdMenuModule,
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
    MdMenuModule,
  ],
  declarations: []
})
export class MaterialModule { }