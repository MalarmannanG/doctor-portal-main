import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AmbulanceRoutingModule } from "./ambulance-routing.module";
import { AmbulanceCallListComponent } from "./ambulance-call-list/ambulance-call-list.component";
import { AmbulanceListComponent } from "./ambulance-list/ambulance-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormDialogComponent } from "./ambulance-call-list/dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./ambulance-call-list/dialog/delete/delete.component";
import { FormDialogComponent as AmbulanceListForm } from "./ambulance-list/dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent as AmbulanceListDelete } from "./ambulance-list/dialog/delete/delete.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatTabsModule } from "@angular/material/tabs";
import { AmbulanceCallListService } from "./ambulance-call-list/ambulance-call-list.service";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AmbulanceListService } from "./ambulance-list/ambulance-list.service";

@NgModule({
  declarations: [
    AmbulanceCallListComponent,
    AmbulanceListComponent,
    FormDialogComponent,
    DeleteDialogComponent,
    AmbulanceListForm,
    AmbulanceListDelete,
  ],
  imports: [
    CommonModule,
    AmbulanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MaterialFileInputModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [AmbulanceCallListService, AmbulanceListService],
})
export class AmbulanceModule {}
