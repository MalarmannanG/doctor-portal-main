import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { DiagnosisMasterModel } from "../model/diagnosis-master.model.service";
import { DiagnosisMasterService } from "../service/diagnosis-master.service";

@Component({
  selector: "app-add-diagnosis-master",
  templateUrl: "./add-diagnosis-master.component.html",
  styleUrls: ["./add-diagnosis-master.component.sass"],
})

export class AddDiagnosisMasterComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new DiagnosisMasterModel();
  constructor(private router: Router,
    private diagnosisMasterService: DiagnosisMasterService,
    private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {

  }

  update() {
    this.diagnosisMasterService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        console.log(resp)
        if (resp.id == -1)
          this.showNotification(
            "snackbar-danger",
            "Diagnosis Name already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/doctor/all-diagnosis');
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
  onSubmit() {
    this.diagnosisMasterService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        console.log(resp)
        if (resp == -1)
          this.showNotification(
            "snackbar-danger",
            "Diagnosis Name already available!!!",
            "bottom",
            "center"
          );
        else
        this.router.navigateByUrl('/doctor/all-diagnosis')
      });
  }

  get() {
    this.diagnosisMasterService.get(this.id)
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
