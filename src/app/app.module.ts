// Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Service Worker
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { UrlImgPipe } from './url-img.pipe';
import { GlobalSettingsDialogComponent } from './global-settings-dialog/global-settings-dialog.component';
import { DialogChangelogComponent } from './dialog-changelog/dialog-changelog.component';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';
import { VirtualOutputNodeComponent } from './virtual-output-node/virtual-output-node.component';
import { VirtualNodeComponent } from './virtual-node/virtual-node.component';
import { AppInstallComponent } from './app-install/app-install.component';
import { TabComponent } from './tab/tab.component';
import { DialogSupportComponent } from './dialog-support/dialog-support.component';
import { IconsModule } from 'app/icons/icons.module';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    AppComponent,
    UrlImgPipe,
    GlobalSettingsDialogComponent,
    DialogChangelogComponent,
    DialogOverviewComponent,
    VirtualOutputNodeComponent,
    VirtualNodeComponent,
    AppInstallComponent,
    TabComponent,
    DialogSupportComponent,
    UpdateComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IconsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [
    GlobalSettingsDialogComponent,
    DialogChangelogComponent,
    DialogOverviewComponent,
    AppInstallComponent,
    DialogSupportComponent,
    UpdateComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
