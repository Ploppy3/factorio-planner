import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from "./material/material.module";
import { AppComponent } from './app.component';
import { NodeComponent } from './node/node.component';
import { OutputNodeComponent } from './output-node/output-node.component';
import { UrlImgPipe } from './url-img.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    OutputNodeComponent,
    UrlImgPipe
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
