import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../config/date-formats';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndexPqrsComponent } from './components/index-pqrs/index-pqrs.component';
import { CreateUpdatePqrComponent } from './components/create-update-pqr/create-update-pqr.component';
import { AddServicesComponent } from './components/add-services/add-services.component';
import { IndexMeansComponent } from './components/index-means/index-means.component';
import { IndexTypesComponent } from './components/index-types/index-types.component';
import { IndexPrincipalComponent } from './components/index-principal/index-principal.component';
import { IndexSecundaryComponent } from './components/index-secundary/index-secundary.component';
import { CreateUpdateMeansComponent } from './components/create-update-means/create-update-means.component';
import { CreateUpdateTypesComponent } from './components/create-update-types/create-update-types.component';
import { CreateUpdatePrincipalComponent } from './components/create-update-principal/create-update-principal.component';
import { CreateUpdateSecundaryComponent } from './components/create-update-secundary/create-update-secundary.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { DialogContentComponent } from './components/dialog-content/dialog-content.component';
import { LoginComponent } from './components/login/login.component';
import { ResponsePqrComponent } from './components/response-pqr/response-pqr.component';
import { AprovedDirComponent } from './components/aproved-dir/aproved-dir.component';
import { IndexDirComponent } from './components/index-dir/index-dir.component';
import { HistoryComponent } from './components/history/history.component';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { FileViewerExcelComponent } from './components/file-viewer-excel/file-viewer-excel.component';
import { FileViewerWordComponent } from './components/file-viewer-word/file-viewer-word.component';
import { IndexSenderComponent } from './components/index-sender/index-sender.component';
import { CreateUpdateSenderComponent } from './components/create-update-sender/create-update-sender.component';
import { SelectAprovedComponent } from './components/select-aproved/select-aproved.component';
import { SignatureComponent } from './components/signature/signature.component';
import { IndexSendComponent } from './components/index-send/index-send.component';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { IndexCoorComponent } from './components/index-coor/index-coor.component';
import { IndexMinerComponent } from './components/index-miner/index-miner.component';
import { AddDataMinedComponent } from './components/add-data-mined/add-data-mined.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { ShowMinerComponent } from './components/show-miner/show-miner.component';
import { SelectMinnerComponent } from './components/select-minner/select-minner.component';
import { TestsComponent } from './components/tests/tests.component';
import { IndexDirgestionComponent } from './components/index-dirgestion/index-dirgestion.component';
import { IndexContralorComponent } from './components/index-contralor/index-contralor.component';
import { HistoryMinerComponent } from './components/history-miner/history-miner.component';
import { HistoryResponseComponent } from './components/history-response/history-response.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CopyMailsComponent } from './components/copy-mails/copy-mails.component';
import { CreateUpdateMailComponent } from './components/create-update-mail/create-update-mail.component';
import { SeeMailComponent } from './components/see-mail/see-mail.component';
// import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    IndexPqrsComponent,
    CreateUpdatePqrComponent,
    AddServicesComponent,
    IndexMeansComponent,
    IndexTypesComponent,
    IndexPrincipalComponent,
    IndexSecundaryComponent,
    CreateUpdateMeansComponent,
    CreateUpdateTypesComponent,
    CreateUpdatePrincipalComponent,
    CreateUpdateSecundaryComponent,
    InboxComponent,
    DialogContentComponent,
    LoginComponent,
    ResponsePqrComponent,
    AprovedDirComponent,
    IndexDirComponent,
    HistoryComponent,
    FileViewerComponent,
    FileViewerExcelComponent,
    FileViewerWordComponent,
    IndexSenderComponent,
    CreateUpdateSenderComponent,
    SelectAprovedComponent,
    SignatureComponent,
    IndexSendComponent,
    IndexCoorComponent,
    IndexMinerComponent,
    AddDataMinedComponent,
    SupervisorComponent,
    ShowMinerComponent,
    SelectMinnerComponent,
    TestsComponent,
    IndexDirgestionComponent,
    IndexContralorComponent,
    HistoryMinerComponent,
    HistoryResponseComponent,
    CopyMailsComponent,
    CreateUpdateMailComponent,
    SeeMailComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    EditorModule,
    CKEditorModule

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: TINYMCE_SCRIPT_SRC,useValue: 'tinymce/tinymce.min.js'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
