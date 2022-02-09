import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { AmbulanceListService } from "../../ambulance-list.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { AmbulanceList } from "../../ambulance-list.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  ambulanceListForm: FormGroup;
  ambulanceList: AmbulanceList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ambulanceListService: AmbulanceListService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.ambulanceList.vehicle_no;
      this.ambulanceList = data.ambulanceList;
    } else {
      this.dialogTitle = "Add Ambulance Call";
      this.ambulanceList = new AmbulanceList({});
    }
    this.ambulanceListForm = this.createContactForm();
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
      id: [this.ambulanceList.id],
      vehicle_no: [this.ambulanceList.vehicle_no],
      vehicle_name: [this.ambulanceList.vehicle_name],
      year_made: [this.ambulanceList.year_made],
      driver_name: [this.ambulanceList.driver_name],
      driver_license_no: [this.ambulanceList.driver_license_no],
      driver_no: [this.ambulanceList.driver_no],
      vehicle_type: [this.ambulanceList.vehicle_type],
      note: [this.ambulanceList.note],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.ambulanceListService.addAmbulanceList(
      this.ambulanceListForm.getRawValue()
    );
  }
}
