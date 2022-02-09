import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Page404Component } from "src/app/authentication/page404/page404.component";
import { AddBillComponent } from "./add-bill/add-bill.component";
import { BillListComponent } from "./bill-list/bill-list.component";
import { InvoiceComponent } from "./invoice/invoice.component";

const routes: Routes = [
  {
    path: "bill-list",
    component: BillListComponent,
  },
  {
    path: "add-bill",
    component: AddBillComponent,
  },
  {
    path: "invoice",
    component: InvoiceComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
