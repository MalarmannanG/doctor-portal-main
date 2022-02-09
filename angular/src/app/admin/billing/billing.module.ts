import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BillingRoutingModule } from "./billing-routing.module";
import { BillListComponent } from "./bill-list/bill-list.component";
import { AddBillComponent } from "./add-bill/add-bill.component";
import { InvoiceComponent } from "./invoice/invoice.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormDialogComponent } from "./bill-list/dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./bill-list/dialog/delete/delete.component";
import { BillListService } from "./bill-list/bill-list.service";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "./../../shared/shared.module";

@NgModule({
  declarations: [
    BillListComponent,
    AddBillComponent,
    InvoiceComponent,
    FormDialogComponent,
    DeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSortModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [BillListService],
})
export class BillingModule {}
