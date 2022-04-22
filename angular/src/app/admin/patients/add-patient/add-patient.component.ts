import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
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
  today = new Date();
  constructor(private router: Router,
    private patientService: PatientMasterService,
    private activatedRoute: ActivatedRoute,
    private doctorService: DoctorService, private snackBar: MatSnackBar) {

  }

  public objectComparisonFunction = function (option, item): boolean {
    return option.value === item.value;
  }

  onSubmit() {
    this.model.referedBy = this.doctorOption.value;
    this.patientService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        console.log(resp)
        if (resp.id == -1)
          this.showNotification(
            "snackbar-danger",
            "Patient already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/admin/patients/all-patients');
      });
  }

  update() {
    this.model.referedBy = this.doctorOption.value;
    this.patientService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp == -1)
          this.showNotification(
            "snackbar-danger",
            "Patient already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/admin/patients/all-patients')
      });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  getDoctors() {
    this.doctorService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.doctorOptions = resp?.result?.map(a => {
          return { name: a.name, value: a.id };
        })

        if (this.id && this.model.referedBy) {
          this.doctorOption = this.doctorOptions.filter(a => a.value == this.model.referedBy)[0];
          console.log(this.doctorOption);
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
    if (id) {
      this.id = id;
      this.get();
    } else {
      this.getDoctors();
    }

  }
  dboChange() {
    var today = new Date();
    var birthDate = new Date(this.model.dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.model.age = age;
  }


  calculateAge() {
    var today = new Date();
    var birthDate = new Date(this.model.dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
      console.log(age);
    }
    console.log(age);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
