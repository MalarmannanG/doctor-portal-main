import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { PrescriptionMasterModel } from "../../patient-profile/model/patient-profile.model.service";
import { PatientProfileService } from "../../patient-profile/service/patient-profile.service";
import { TemplateMasterModel, TemplatePrescriptionModel } from "../model/template-master.model.service";
import { TemplateMasterService } from "../service/template-master.service";

@Component({
  selector: "app-add-template-master",
  templateUrl: "./add-template-master.component.html",
  styleUrls: ["./add-template-master.component.sass"],
})

export class AddTemplateMasterComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  step: number = 0;
  isTemplateSelected = false;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new TemplateMasterModel();
  newMed: boolean = false;
  editing: boolean = false;
  activePrescription = new TemplatePrescriptionModel();
  prescriptionOptions: PrescriptionMasterModel[] = [];
  prescriptionList: PrescriptionMasterModel[] = [];
  genericName: string;
  selectedMedicine = '';
  constructor(private router: Router,
    private patientProfileService: PatientProfileService,
    private templateMasterService: TemplateMasterService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) {

  }

  cancelPrescription() {
    this.activePrescription = new TemplatePrescriptionModel();
    this.prescriptionOptions = this.prescriptionList;
    this.newMed = false;
  }

  addPrescription() {
    if (!this.editing) {
      this.model.templatePrescriptionModel?.push(this.activePrescription);
    } else {
      this.editablePrescription.medicineName = this.activePrescription.medicineName;
      this.editablePrescription.strength = this.activePrescription.strength;
      this.editablePrescription.genericName = this.activePrescription.genericName;
      this.editablePrescription.morning = this.activePrescription.morning;
      this.editablePrescription.noon = this.activePrescription.noon;
      this.editablePrescription.night = this.activePrescription.night;
      this.editablePrescription.beforeFood = this.activePrescription.beforeFood;
      this.editablePrescription.description = this.activePrescription.description;
      this.editablePrescription.noOfDays = this.activePrescription.noOfDays;
    }
    this.activePrescription = new TemplatePrescriptionModel();
    this.prescriptionOptions = this.prescriptionList;
    this.selectedMedicine = '';
    this.newMed = false;
    this.editing = false;
  }

  editablePrescription = new TemplatePrescriptionModel();
  edit(event) {
    this.editablePrescription = event;
    this.activePrescription = JSON.parse(JSON.stringify(this.editablePrescription));
    this.editing = true;
    this.newMed = true;
  }


  addMed() {
    this.newMed = true;
  }

  update() {
    this.templateMasterService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        console.log(resp)
        if (resp.id == -1)
          this.showNotification(
            "snackbar-danger",
            "Template Name already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/doctor/all-template');
      });
  }

  onSubmit() {
    this.templateMasterService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        if (resp == -1)
          this.showNotification(
            "snackbar-danger",
            "Template Name already available!!!",
            "bottom",
            "center"
          );
        else
          this.router.navigateByUrl('/doctor/all-template');
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
    this.templateMasterService.get(this.id)

      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
      });
  }

  onMedSelectionChanged(event) {
    if (event.option.value) {
      let selected = this.prescriptionList.filter(a => a.id == event.option.value)[0];
      this.activePrescription.medicineName = selected.medicineName;
      this.activePrescription.strength = selected.strength;
      this.activePrescription.genericName = selected.genericName;
      this.activePrescription.categoryName = selected.categoryName;
      this.activePrescription.units = selected.units;
      console.log(selected.strength + '' + selected.remarks);
      this.activePrescription.remarks = selected.remarks;
      var _strength = selected.strength = null ? '-' + selected.strength : '';
      var _units = selected.units = null ? '-' + selected.units : '';
      this.selectedMedicine = selected.medicineName + '-' + selected.categoryName + _strength + _units;

    }
  }

  doMedFilter(filter) {
    if (Number.parseInt(filter)) {
      this.prescriptionOptions = [];
      this.prescriptionList.forEach(element => {
        if (element.id == filter) {
          this.prescriptionOptions.push(element);
          this.selectedMedicine = element.medicineName + '-' + element.categoryName + '-' + element.strength + '' + element.units;
        }
      });
    }
    else {
      var _filter = filter?.toLocaleLowerCase();
      this.prescriptionOptions = [];
      this.prescriptionList.forEach(element => {
        if (element.medicineName?.toLocaleLowerCase().includes(_filter)) {
          this.prescriptionOptions.push(element)
        }
      });
    }
  }


  populatePrescriptionMaster() {
    this.patientProfileService.getMedicines()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.prescriptionList = resp?.result;
        this.prescriptionOptions = this.prescriptionList;
      });
  }

  id: any;
  ngOnInit() {
    this.populatePrescriptionMaster();
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
