import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { DrugMasterService } from './../service/drug-master.service';
import { DrugMasterModel } from './../model/drug-master.model.service';

@Component({
  selector: "app-add-drug-master",
  templateUrl: "./add-drug-master.component.html",
  styleUrls: ["./add-drug-master.component.sass"],
})

export class AddDrugMasterComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new DrugMasterModel();
  constructor(private router: Router,
    private drugMasterService: DrugMasterService,
    private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {

  }

  update() {
    this.drugMasterService.put(this.model)
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
          this.router.navigateByUrl('/doctor/all-drug');
      });
  }

  onSubmit() {
    this.drugMasterService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp == -1)
          this.showNotification(
            "snackbar-danger",
            "Drug already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/doctor/all-drug');
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
    this.drugMasterService.get(this.id)
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
