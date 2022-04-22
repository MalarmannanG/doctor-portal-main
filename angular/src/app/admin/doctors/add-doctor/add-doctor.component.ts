import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { DoctorModel } from "../model/doctor.model.service";
import { DoctorService } from "../service/doctor.service";

@Component({
  selector: "app-add-doctor",
  templateUrl: "./add-doctor.component.html",
  styleUrls: ["./add-doctor.component.sass"],
})

export class AddDoctorComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new DoctorModel();
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private doctorService: DoctorService,
    private activatedRoute: ActivatedRoute) {

  }

  update() {
    this.doctorService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp == -1)
          this.showNotification(
            "snackbar-danger",
            "Facility already available!!!",
            "bottom",
            "center"
          );
        else {
          this.showNotification(
            "snackbar-success",
            "Record Updated Successfully...!!!",
            "bottom",
            "center"
          );
          this.router.navigateByUrl('/admin/doctors/allDoctors')
        }
      });
  }

  onSubmit() {
    this.doctorService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp.id == -1)
          this.showNotification(
            "snackbar-danger",
            "Facility already available!!!",
            "bottom",
            "center"
          );
        else {
          this.showNotification(
            "snackbar-success",
            "Record Added Successfully...!!!",
            "bottom",
            "center"
          );
          this.router.navigateByUrl('/admin/doctors/allDoctors')
        }
      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  get() {
    this.doctorService.get(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
        if(this.model.pinCode < 1)
          this.model.pinCode = null;
      });
  }

  id: any;
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.get();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
