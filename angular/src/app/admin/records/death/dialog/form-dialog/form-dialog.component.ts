import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { DeathService } from "../../death.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Death } from "../../death.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  deathForm: FormGroup;
  death: Death;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public deathService: DeathService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.death.patient_name;
      this.death = data.death;
    } else {
      this.dialogTitle = "New Death";
      this.death = new Death({});
    }
    this.deathForm = this.createContactForm();
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
      id: [this.death.id],
      case_no: [this.death.case_no],
      patient_name: [this.death.patient_name],
      gender: [this.death.gender],
      death_date: [
        formatDate(this.death.death_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      gaurdian_name: [this.death.gaurdian_name],
      mobile: [this.death.mobile],
      address: [this.death.address],
      note: [this.death.note],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.deathService.addDeath(this.deathForm.getRawValue());
  }
}
