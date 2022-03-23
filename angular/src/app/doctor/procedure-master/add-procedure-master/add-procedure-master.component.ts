import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { TestMasterModel } from "../model/test-master.model.service";
import { TestMasterService } from "../service/test-master.service";

@Component({
  selector: "app-add-procedure-master",
  templateUrl: "./add-procedure-master.component.html",
  styleUrls: ["./add-procedure-master.component.sass"],
})

export class AddProcedureMasterComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new TestMasterModel();
  constructor(private router: Router,
    private testMasterService: TestMasterService,
    private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {

  }

  update() {
    this.testMasterService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        console.log(resp)
        if (resp.id == -1)
          this.showNotification(
            "snackbar-danger",
            "Test Name already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/doctor/all-test');
      });
  }

  onSubmit() {
    this.testMasterService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp == -1)
          this.showNotification(
            "snackbar-danger",
            "Test Name already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/doctor/all-test');
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
  get() {
    this.testMasterService.get(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
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
