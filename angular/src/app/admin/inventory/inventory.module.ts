import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InventoryRoutingModule } from "./inventory-routing.module";
import { ItemStockListComponent } from "./item-stock-list/item-stock-list.component";
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
import { FormDialogComponent } from "./item-stock-list/dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./item-stock-list/dialog/delete/delete.component";
import { FormDialogComponent as IssuedItemForm } from "./issued-items/dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent as IssuedItemDelete } from "./issued-items/dialog/delete/delete.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MatTabsModule } from "@angular/material/tabs";
import { ItemStockListService } from "./item-stock-list/item-stock-list.service";
import { IssuedItemsService } from "./issued-items/issued-items.service";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { IssuedItemsComponent } from "./issued-items/issued-items.component";

@NgModule({
  declarations: [
    ItemStockListComponent,
    FormDialogComponent,
    DeleteDialogComponent,
    IssuedItemsComponent,
    IssuedItemForm,
    IssuedItemDelete,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
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
  providers: [ItemStockListService, IssuedItemsService],
})
export class InventoryModule {}
