import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonModule,
  MdIconModule,
  MdAutocompleteModule,
  MdInputModule,
  MdSelectModule,
  MdCheckboxModule,
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
  ],
  declarations: []
})
export class MaterialModule { }