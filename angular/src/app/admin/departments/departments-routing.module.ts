import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Page404Component } from "src/app/authentication/page404/page404.component";
import { AddDepartmentComponent } from "./add-department/add-department.component";
import { DepartmentListComponent } from "./department-list/department-list.component";

const routes: Routes = [
  {
    path: "department-list",
    component: DepartmentListComponent,
  },
  {
    path: "add-department",
    component: AddDepartmentComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
