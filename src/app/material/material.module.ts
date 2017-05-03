import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonModule,
  MdIconModule,
  MdAutocompleteModule,
  MdInputModule,
  MdSelectModule,
  MdTooltipModule,
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
    MdTooltipModule,
  ],
  declarations: []
})
export class MaterialModule { }
