import { Component, Inject, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { DoctorService } from "../../doctors/service/doctor.service";
import { PatientMasterService } from "../../patients/service/patient.service";
import { AppoinemtModel } from "../model/appointmentt.model";
import { AppoinementsService } from "../service/Appointmentt.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PatientModel } from "../../patients/model/patient.model";
import { DoctorModel } from "../../doctors/model/doctor.model.service";
import * as moment from "moment";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-bookappointment",
  templateUrl: "./bookappointment.component.html",
  styleUrls: ["./bookappointment.component.sass"],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class BookappointmentComponent {
  bookingForm: FormGroup;
  hide3 = true;
  agree3 = false;
  doctorOptions: DoctorModel[] = [];
  doctorList: DoctorModel[] = [];
  patientOptions:  PatientModel[] =[];
  patientList: PatientModel[] =[];
  options: any = ["a", "b"];
  doctorOption: DoctorModel = new DoctorModel();
  patientOption: PatientModel = new PatientModel();
  option = ""
  timeOptions = []
  myControl = new FormControl();
  action: string;
  model = new AppoinemtModel();
  unsubscribe$ = new Subject();
  patient = new PatientModel();
  id: any;
  doctorRequired: boolean;
  patientRequired: boolean;
  constructor(private appoinementService: AppoinementsService,
    private doctorService: DoctorService,    
    private patientService: PatientMasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      
  }
  
  public objectComparisonFunction = function( option, value ) : boolean {
    return option.id === value.id;
  }

  getAppointment() {
    this.action = "edit";   
    this.appoinementService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.model = resp;
      this.getDoctors();
      this.getPatients();
    });
  }

  onSubmit() {   
    if(!this.doctorOption?.id) {
      this.doctorRequired = true;
    }
    if(!this.patientOption?.id) {
      this.patientRequired = true;
    }
    if(this.patientOption?.id && this.doctorOption?.id) {
      this.model.consultingDoctorID = this.doctorOption.id;
      this.model.patientId = this.patientOption.id;
      
      this.appoinementService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.router.navigateByUrl('/admin/appointment/viewAppointment');
      });
    }   
  }

  dateChange(event) {
    
    
  }

  update() {
  
    //this.model.appointmentDateTime = moment(this.model.appointmentDateTime).format('YYYY-MM-DD HH:mm:ss');  
    
    //this.model.appointmentDateTime = moment(this.model.appointmentDateTime).toLocaleString();
    this.model.appointmentISOString = moment(this.model.appointmentDateTime).toISOString();
    console.log(this.model.appointmentDateTime);
    console.log(this.model.appointmentISOString);
    if(!this.doctorOption?.id) {
      this.doctorRequired = true;
    }
    if(!this.patientOption?.id) {
      this.patientRequired = true;
    }
    if(this.patientOption?.id && this.doctorOption?.id) {
      this.model.consultingDoctorID = this.doctorOption.id;
      this.model.patientId = this.patientOption.id;
    this.appoinementService.put(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.router.navigateByUrl('/admin/appointment/viewAppointment');
    });  
  }  
  }

  today = new Date();
  doctorsLoading = false;
  getDoctors() {
    this.doctorsLoading = true;
    this.doctorService.getAllUsers()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
     this.doctorList = resp?.result?.filter(a => a.userType == 'Doctor');   
     this.doctorOptions = this.doctorList;  
     if (this.action == 'edit') {
      let filtered = this.doctorOptions?.filter(a => a.id == this.model.consultingDoctorID);
      this.doctorOption = filtered[0];
    }
    this.doctorsLoading = false;
    });
  }
  
  patientsLoading = false;
  getPatients() {
    this.patientsLoading = true;
    this.patientService.getAll()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
     this.patientList = resp?.result;
     this.patientOptions = this.patientList;
     if (this.action == 'edit') {
      let filtered = this.patientList?.filter(a => a.id == this.model.patientId);
       this.patientOption = filtered[0];
       let id = filtered[0]?.id;
       this.getPatient(id)
     }
     this.patientsLoading = false;
    });
  }

  getPatient(id){
    id = this.patientOption?.id ? this.patientOption?.id : id;
    if(id){
      this.patientService.get(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.patient = resp;
      });
    } else {
      this.patient = new PatientModel();
    }    
  }

  doDoctorFilter(filter) {
    filter = filter;
    this.doctorOptions = [];  
    this.doctorList.forEach(element => {
      if(element.name.toLocaleLowerCase().includes(filter?.toLocaleLowerCase())) {
        this.doctorOptions.push(element)
      }
    });     
  } 

  onSelectionChanged(event) {
    this.patientOption = this.patientList.filter(a => a.patientName == event.option.value)[0];
    if(this.patientOption?.id) {
      this.getPatient(this.patientOption?.id);
    }
  }

  onDoctorSelectionChanged(event) {
    this.doctorOption = this.doctorList.filter(a => a.name == event.option.value)[0];
  }
  
  doFilter(filter) {
    filter = filter;
    this.patientOptions = [];  
    this.patientList.forEach(element => {
      if(element.patientName.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()) || element.mobileNumber?.includes(filter)) {
        this.patientOptions.push(element)
      }
    });     
  }  


  ngOnInit() {
    let timeList = [10, 20, 30, 40, 50, 0]
    for (let index = 1; index <= 12; index++) {
      let element = "";
      if (index < 10)
      {
        element = "0" + index;
        for (let index = 0; index < timeList.length; index++) {
          const time = timeList[index];
          let result = element +": " + (time == 0? "00" : time);
          this.timeOptions.push(result);
        }
      } else {
        element = index.toString();
        for (let index = 0; index < timeList.length; index++) {
          const time = timeList[index];
          let result = element +": " + (time == 0? "00" : time);
          this.timeOptions.push(result);
        }
      }
    }
    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.getAppointment()
    } else {
      this.getDoctors();
    this.getPatients();
    }
    
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
