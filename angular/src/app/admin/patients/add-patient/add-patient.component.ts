import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { DoctorService } from "../../doctors/service/doctor.service";
import { PatientModel } from "../model/patient.model";
import { PatientMasterService } from "../service/patient.service";

@Component({
  selector: "app-add-patient",
  templateUrl: "./add-patient.component.html",
  styleUrls: ["./add-patient.component.sass"],
})
export class AddPatientComponent implements OnInit, OnDestroy {
  model = new PatientModel();
  unsubscribe$ = new Subject();
  doctorOption: any;
  doctorOptions: any[] = [];
  constructor(private router: Router, 
    private patientService: PatientMasterService,
    private activatedRoute: ActivatedRoute,
    private doctorService: DoctorService) {
    
  }

  public objectComparisonFunction = function( option, value ) : boolean {
    return option.id === value.id;
  }

  onSubmit() {
    this.model.referedBy = this.doctorOption.value;
    this.patientService.post(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      console.log(resp)
      this.router.navigateByUrl('/admin/patients/all-patients')
    });
  }

  update() {
    this.model.referedBy = this.doctorOption.value;
    this.patientService.put(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      console.log(resp)
      this.router.navigateByUrl('/admin/patients/all-patients')
    });
  }

  getDoctors() {
    this.doctorService.getAll()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
     this.doctorOptions = resp?.result?.map(a => {
      return {name: a.name, value: a.id};
     })

     if(this.id && this.model.referedBy) {
      this.doctorOption = this.doctorOptions.filter(a => a.value == this.model.referedBy)[0];
     }
    });
  }

  get() {
    this.patientService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.model = resp;
      this.getDoctors();      
    });
  }

  id: any;
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.id = id;
      this.get();
    } else {
      this.getDoctors();
    }
    
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
