import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AppUserModel } from "../model/user.model";
import { UserMasterService } from "../service/user.service";
@Component({
  selector: "app-add-staff",
  templateUrl: "./add-staff.component.html",
  styleUrls: ["./add-staff.component.sass"],
})
export class AddStaffComponent implements OnInit, OnDestroy {
  staffForm: FormGroup;
  hide3 = true;
  agree3 = false;
  unsubscribe$ = new Subject();
  model: AppUserModel = new AppUserModel();
  confirmPassword: string;
  selectedSpecialization: string
  specializationOptions: any[] = [];
  specializationOption: any = {};
  constructor(private userMasterService: UserMasterService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  public objectComparisonFunction = function (option, item): boolean {
    return option.id === item.id;
  }
  onSubmit() {
    this.model.specializationId = this.specializationOption?.id;
    this.model.specializationId = this.model.specializationId == -1 ? null : this.model.specializationId;
    this.userMasterService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.showNotification(
          "snackbar-success",
          "Record Added Successfully...!!!",
          "bottom",
          "center"
        );
        this.router.navigateByUrl('/admin/staff/all-staff')
      });
  }

  update() {
    this.model.specializationId = this.specializationOption?.id;
    this.model.specializationId = this.model.specializationId == -1 ? null : this.model.specializationId;
    this.userMasterService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.showNotification(
          "snackbar-success",
          "Record Updated Successfully...!!!",
          "bottom",
          "center"
        );
        this.router.navigateByUrl('/admin/staff/all-staff')
      });
  }

  get() {
    this.userMasterService.get(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
        this.getAllSpecialization(this.model.specializationId);
      });
  }


  id: any;
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.get();
    }
    else
      this.getAllSpecialization(-1);
  }
  getAllSpecialization(value) {
   
    this.userMasterService.getAllSpecialization(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.specializationOptions = resp;
        this.specializationOptions.splice(0, 0, { name: 'Select Specilization', id: -1 });
        this.specializationOption = this.specializationOptions.filter(a => a.id == value)[0];
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
