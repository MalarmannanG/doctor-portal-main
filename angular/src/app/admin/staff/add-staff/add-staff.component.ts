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

  onSubmit() {
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
    });
  }

  
  id: any;
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.id = id;
      this.get();
    }     
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
