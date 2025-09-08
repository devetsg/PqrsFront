import { NgModule, OnInit,ChangeDetectionStrategy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgxFileDropModule } from 'ngx-file-drop';
//picker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
//pdf viewer
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    // otros componentes
  ],
  imports: [
    NgxExtendedPdfViewerModule,
    // otros módulos
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


//MATERIAL MODULES
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';

//NGX

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgxMatNativeDateModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AppComponent } from '../app.component';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatGridListModule,
    NgxFileDropModule,
    NgxMaterialTimepickerModule,
    MatMenuModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    //NgxMatTimepickerModule,
    //NgxMatDatetimePickerModule,
    //NgxMatNativeDateModule,
    NgxExtendedPdfViewerModule,
    MatBadgeModule,
    



  ],
  exports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatGridListModule,
    NgxFileDropModule,
    NgxMaterialTimepickerModule,
    MatMenuModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    //NgxMatTimepickerModule,
    //NgxMatDatetimePickerModule,
    //NgxMatNativeDateModule,
    NgxExtendedPdfViewerModule,
    MatBadgeModule,
    
    


  ],
  
})
export class SharedModule { 
}
