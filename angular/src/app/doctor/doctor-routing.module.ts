import { AddProcedureMasterComponent } from './procedure-master/add-procedure-master/add-procedure-master.component';
import { AllProcedureMasterComponent } from './procedure-master/all-procedure-master/all-procedure-master.component';
import { Page404Component } from "./../authentication/page404/page404.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { DoctorsComponent } from "./doctors/doctors.component";
//import { PatientsComponent } from "./patients/patients.component";
import { PatientsComponent } from "../doctor/patients/patients.component";
import { SettingsComponent } from "./settings/settings.component";
import { AllTestMasterComponent } from "./test-master/all-test-master/all-test-master.component";
import { AddTestMasterComponent } from "./test-master/add-test-master/add-test-master.component";
import { AllDiagnosisMasterComponent } from "./diagnosis-master/all-diagnosis-master/all-diagnosis-master.component";
import { AddTemplateMasterComponent } from "./template-master/add-template-master/add-template-master.component";
import { AllTemplateMasterComponent } from "./template-master/all-template-master/all-template-master.component";
import { AddDiagnosisMasterComponent } from "./diagnosis-master/add-diagnosis-master/add-diagnosis-master.component";
import { PatientProfileOldComponent } from "./patient-profile/add-patient-profile/patient-profile-old.component";
import { ViewPatientProfileComponent } from "./patient-profile/view-patient-profile/view-patient-profile.component";
import {PatientProfileComponent} from './patient-profile/patient-profile.component';
import { AllpatientsComponent } from '../admin/patients/allpatients/allpatients.component';
import { AllPatientProfileComponent } from './patients/patient-profiles/all-patient-profile.component';
const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "patients",
    component: PatientsComponent,
  },
  {
    path: "all-test",
    component: AllTestMasterComponent,
  },
  {
    path: "add-test",
    component: AddTestMasterComponent,
  },
  {
    path: "edit-test/:id",
    component: AddTestMasterComponent,
  },
  {
    path: "all-template",
    component: AllTemplateMasterComponent,
  },
  {
    path: "add-template",
    component: AddTemplateMasterComponent,
  },
  {
    path: "edit-template/:id",
    component: AddTemplateMasterComponent,
  },
  {
    path: "all-diagnosis",
    component: AllDiagnosisMasterComponent,
  },
  {
    path: "add-diagnosis",
    component: AddDiagnosisMasterComponent,
  },
  {
    path: "edit-diagnosis/:id",
    component: AddDiagnosisMasterComponent,
  },  
  {
    path: "appointments",
    component: AppointmentsComponent,
  },
  {
    path: "doctors",
    component: DoctorsComponent,
  },
  {
    path: "patient-profile/:id",
    component: ViewPatientProfileComponent,
  },
  {
    path: "patients/:id",
    component: AllPatientProfileComponent,
  },
  {
    path: "patient-profile1/:id",
    component:  PatientProfileOldComponent,
  },
   {
    path: "patient-profile/:id",
    component: PatientProfileComponent,
  },
  {
    path: "prescription-print/:id",
    component: SettingsComponent,
  },
  {
    path: "all-procedure",
    component: AllProcedureMasterComponent,
  },
  {
    path: "add-procedure",
    component: AddProcedureMasterComponent,
  },
  {
    path: "edit-procedure/:id",
    component: AddProcedureMasterComponent,
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorRoutingModule {}
