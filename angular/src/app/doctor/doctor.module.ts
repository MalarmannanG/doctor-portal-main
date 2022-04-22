import { AllProcedureMasterComponent } from './procedure-master/all-procedure-master/all-procedure-master.component';
import { AddProcedureMasterComponent } from './procedure-master/add-procedure-master/add-procedure-master.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { NgApexchartsModule } from "ng-apexcharts";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatSliderModule } from "@angular/material/slider";
import { MatExpansionModule } from "@angular/material/expansion";

import { DoctorRoutingModule } from "./doctor-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { FormComponent } from "./appointments/form/form.component";
import { DoctorsComponent } from "./doctors/doctors.component";
//import { PatientsComponent } from "./patients/patients.component";
import { PatientsComponent } from "../doctor/patients/patients.component";
import { SettingsComponent } from "./settings/settings.component";
import { AppointmentsService } from "./appointments/appointments.service";
//import { MultiUploaderComponent } from '../multiuploader/multiuploader.component';
import { PrescriptionComponent } from './prescription/prescription.component';
import { AddTestMasterComponent } from "./test-master/add-test-master/add-test-master.component";
import { AllTestMasterComponent } from "./test-master/all-test-master/all-test-master.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddDiagnosisMasterComponent } from "./diagnosis-master/add-diagnosis-master/add-diagnosis-master.component";
import { AllDiagnosisMasterComponent } from "./diagnosis-master/all-diagnosis-master/all-diagnosis-master.component";
import { AddTemplateMasterComponent } from "./template-master/add-template-master/add-template-master.component";
import { AllTemplateMasterComponent } from "./template-master/all-template-master/all-template-master.component";
import { PatientProfileOldComponent } from "./patient-profile/add-patient-profile/patient-profile-old.component";
import { NgxMaskModule } from "ngx-mask";
import { PatientService } from "./patients/patient.service";
import { ViewPatientProfileComponent } from "./patient-profile/view-patient-profile/view-patient-profile.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import {PatientProfileComponent} from './patient-profile/patient-profile.component';
import { AllPatientProfileComponent } from './patients/patient-profiles/all-patient-profile.component';
import { PatientProfileController } from 'src/shared/service-proxies/service-proxies';
import { AutocompleteAutoActiveComponent } from "../shared/autocomplete/autocomplete-auto-active.component";
import { AllDrugMasterComponent } from './drug-master/all-drug-master/all-drug-master.component';
import { AddDrugMasterComponent } from './drug-master/add-drug-master/add-drug-master.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AppointmentsComponent,
    FormComponent,
    DoctorsComponent,
    PatientsComponent,
    SettingsComponent,
    //MultiUploaderComponent,
    PrescriptionComponent,
    AddTestMasterComponent,
    AllTestMasterComponent,
    AddDiagnosisMasterComponent,
    AllDiagnosisMasterComponent,
    AddTemplateMasterComponent,
    AllTemplateMasterComponent,
     PatientProfileOldComponent,
    ViewPatientProfileComponent,
    PatientProfileComponent,
    AddProcedureMasterComponent,
    AllProcedureMasterComponent,
    AllPatientProfileComponent,
    AutocompleteAutoActiveComponent,
    AddDrugMasterComponent,
    AllDrugMasterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DoctorRoutingModule,
    chartjsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgApexchartsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSortModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatTooltipModule,
    MatRadioModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgbModule,
    MatExpansionModule,
    NgxMaskModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ],
  providers: [AppointmentsService,PatientService, PatientProfileController],
})
export class DoctorModule {}
