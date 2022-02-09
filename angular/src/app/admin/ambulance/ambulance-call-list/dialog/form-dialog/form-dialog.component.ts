import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { AmbulanceCallListService } from "../../ambulance-call-list.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { AmbulanceCallList } from "../../ambulance-call-list.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  ambulanceCallListForm: FormGroup;
  ambulanceCallList: AmbulanceCallList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ambulanceCallListService: AmbulanceCallListService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.ambulanceCallList.patient_name;
      this.ambulanceCallList = data.ambulanceCallList;
    } else {
      this.dialogTitle = "Add Ambulance Call";
      this.ambulanceCallList = new AmbulanceCallList({});
    }
    this.ambulanceCallListForm = this.createContactForm();
  }
  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.ambulanceCallList.id],
      case_no: [this.ambulanceCallList.case_no],
      patient_name: [this.ambulanceCallList.patient_name],
      gender: [this.ambulanceCallList.gender],
      date: [
        formatDate(this.ambulanceCallList.date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      vehicle_no: [this.ambulanceCallList.vehicle_no],
      driver_name: [this.ambulanceCallList.driver_name],
      driver_no: [this.ambulanceCallList.driver_no],
      patient_address: [this.ambulanceCallList.patient_address],
      note: [this.ambulanceCallList.note],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.ambulanceCallListService.addAmbulanceCallList(
      this.ambulanceCallListForm.getRawValue()
    );
  }
}
