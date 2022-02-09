import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Page404Component } from "src/app/authentication/page404/page404.component";
import { BirthComponent } from "./birth/birth.component";
import { DeathComponent } from "./death/death.component";

const routes: Routes = [
  {
    path: "birth",
    component: BirthComponent,
  },
  {
    path: "death",
    component: DeathComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsRoutingModule {}
