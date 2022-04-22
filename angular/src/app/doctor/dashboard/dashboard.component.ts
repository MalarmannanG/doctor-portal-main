import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexFill,
} from "ng-apexcharts";
import { Router } from "@angular/router";
import { DoctorModel } from "src/app/admin/doctors/model/doctor.model.service";
import { AppoinemtModel } from "src/app/admin/appointment/model/appointmentt.model";
import { PatientMasterService } from "src/app/admin/patients/service/patient.service";
import { DoctorService } from "src/app/admin/doctors/service/doctor.service";
import { AppoinementsService } from "src/app/admin/appointment/service/Appointmentt.service";
import { Subject, takeUntil } from "rxjs";
import * as moment from "moment";
import { PatientModel } from "src/app/admin/patients/model/patient.model";
import { AccountService } from "src/app/authentication/service/auth.service";

export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

export type linechartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
};

export type radialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
};
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent;
  public areaChartOptions: Partial<areaChartOptions>;
  public radialChartOptions: Partial<radialChartOptions>;
  public linechartOptions: Partial<linechartOptions>;
  patients = [1, 2, 3, 4, 5, 6]
  appointments: AppoinemtModel[] = [];
  todayPatientsCount: number = 0;
  totalPatientsCount: number = 0;
  appointmentsCount: number = 0;
  procedureCount: number = 0;
  user: any;
  pro;
  unsubscribe$ = new Subject();
  femaleUrl = "/assets/images/avatar-female.svg";
  maleUrl = "/assets/images/avatar-male.svg";
  selectedDoctor: any;
  selectedPatient: string;
  todayPatients: boolean;
  toDate: any;
  fromDate: any;
  todaysAppointments: boolean = false;
  isProcedure?: boolean;
  patientOptions: PatientModel[] = [];
  doctorOptions: DoctorModel[] = [];
  patientList: PatientModel[] = [];
  doctorList: DoctorModel[] = [];
  selected: string;

  constructor(private router: Router,
    private patientsService: PatientMasterService,
    private doctorService: DoctorService,
    private appoinementsService: AppoinementsService,
    private accountService: AccountService) {

  }

  getColor(input: number) {
    let index: number = input > 6 ? input % 6 : input;
    if (index == 0) {
      return "profile-header bg-dark";
    } else if (index == 1) {
      return "profile-header bg-cyan";
    } else if (index == 2) {
      return "profile-header l-bg-orange";
    } else if (index == 3) {
      return "profile-header bg-green";
    } else if (index == 4) {
      return "profile-header l-bg-red";
    } else if (index == 5) {
      return "profile-header bg-indigo";
    } else {
      return "profile-header l-bg-purple-dark";
    }
  }

  gotoProfile(id) {
    console.log('gotoProfile');
    this.router.navigateByUrl(`/doctor/patient-profile/${id}`);
  }


  selectedColor(code) {
    if (this.selected == code) {
      return "background-color: #99e2f4"
    } else {
      return "";
    }
  }

  selection(code) {
    this.selected = code;
    if (this.selected == 'Appointments') {
      this.todayPatients = false;
      this.isProcedure = null;
      this.getAppointments()
    } else if (this.selected == 'Procedures') {
      this.todayPatients = false;
      this.isProcedure = true;
      this.getAppointments()
    } else if (this.selected == 'Visits') {
      this.todayPatients = false;
      this.isProcedure = false;
      this.getAppointments()
    } else {
      this.todayPatients = false;
      this.isProcedure = null;
      this.getAppointments()
    }
  }

  clear() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.todayPatients = false;
    this.isProcedure = null;
    this.selectedPatient = "";
    this.selectedDoctor = "";
    this.getAppointments()
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement, isProcedure = null) {
    //console.log(dateRangeStart.value);
    //console.log(dateRangeEnd.value);
    this.fromDate = dateRangeStart.value;
    this.toDate = dateRangeEnd.value;
    this.isProcedure = isProcedure;
    this.getAppointments();
  }
  getAppointments(isInit?: boolean) {
    let query = "";

    if (this.selectedPatient) {
      query = `?patientName=${this.selectedPatient}`
    }
    if (this.selectedDoctor) {
      query = query ? query + `&doctorName=${this.selectedDoctor}` : `?doctorName=${this.selectedDoctor}`
    }

    if (this.todayPatients) {
      query = query ? query + `&todayPatients=${this.todayPatients}` : `?todayPatients=${this.todayPatients}`
    }

    if (this.isProcedure != null && this.isProcedure != undefined) {
      query = query ? query + `&isProcedure=${this.isProcedure}` : `?isProcedure=${this.isProcedure}`
    }

    if (this.fromDate) {
      this.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
      query = query ? query + `&fromDate=${this.fromDate}` : `?fromDate=${this.fromDate}`
    }

    if (this.toDate) {
      this.toDate = moment(this.toDate).format('YYYY-MM-DD');
      query = query ? query + `&toDate=${this.toDate}` : `?toDate=${this.toDate}`
    }

    if (this.fromDate && this.toDate) {
      let today = moment().format('YYYY-MM-DD')
      this.todaysAppointments = today == this.fromDate && today == this.toDate;
    }

    this.appoinementsService.getAll(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.appointments = resp.result;
        if (isInit) {
          this.procedureCount = resp?.result?.filter(a => a.visitType == 'Procedure')?.length ?? 0;
          this.appointmentsCount = resp?.result?.filter(a => a.visitType != 'Procedure')?.length ?? 0;
        }
      });
  }

  getDoctors() {
    const user = this.accountService.currentUserValue;
    this.doctorService.getAllUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.doctorList = resp.result?.filter(a => a.userType == "Doctor");
        this.doctorOptions = this.doctorList;
        if (user.role.toLocaleLowerCase() == "doctor")
          this.selectedDoctor = user.username;
        this.getAppointments(true);
      });
  }

  doDoctorFilter(filter) {
    filter = filter;
    this.doctorOptions = [];
    this.doctorList.forEach(element => {
      if (element.name.toLocaleLowerCase().includes(filter?.toLocaleLowerCase())) {
        this.doctorOptions.push(element)
      }
    });
  }


  doFilter(filter) {
    filter = filter;
    this.patientOptions = [];
    this.patientList.forEach(element => {
      if (element.patientName.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()) || element.mobileNumber?.includes(filter)) {
        this.patientOptions.push(element)
      }
    });
  }

  filterChange(isProcedure = null) {
    this.isProcedure = isProcedure;
    this.getAppointments();
  }

  getPatinets() {
    this.patientsService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.patientList = resp.result;
        this.patientOptions = this.patientList;
        this.totalPatientsCount = resp?.total ?? 0;
      });
  }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.fromDate = moment().startOf('day');
    this.toDate = moment().endOf('day');

    this.getPatinets();
    this.getDoctors();


    // if(user.role == "Doctor")
    //   this.selectedDoctor = user.username 
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}