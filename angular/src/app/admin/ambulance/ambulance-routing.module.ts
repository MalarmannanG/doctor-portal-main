import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Page404Component } from "src/app/authentication/page404/page404.component";
import { AmbulanceCallListComponent } from "./ambulance-call-list/ambulance-call-list.component";
import { AmbulanceListComponent } from "./ambulance-list/ambulance-list.component";

const routes: Routes = [
  {
    path: "call-list",
    component: AmbulanceCallListComponent,
  },
  {
    path: "list",
    component: AmbulanceListComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmbulanceRoutingModule {}
