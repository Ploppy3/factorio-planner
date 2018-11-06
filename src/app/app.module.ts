import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { NodeComponent } from './node/node.component';
import { OutputNodeComponent } from './output-node/output-node.component';
import { UrlImgPipe } from './url-img.pipe';
import { GlobalSettingsDialogComponent } from './global-settings-dialog/global-settings-dialog.component';
import { DialogChangelogComponent } from './dialog-changelog/dialog-changelog.component';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';
import { VirtualOutputNodeComponent } from './virtual-output-node/virtual-output-node.component';
import { VirtualNodeComponent } from './virtual-node/virtual-node.component';

// Service Worker
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Overlay Theming
// import {OverlayContainer} from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    OutputNodeComponent,
    UrlImgPipe,
    GlobalSettingsDialogComponent,
    DialogChangelogComponent,
    DialogOverviewComponent,
    VirtualOutputNodeComponent,
    VirtualNodeComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    GlobalSettingsDialogComponent,
    DialogChangelogComponent,
    DialogOverviewComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
