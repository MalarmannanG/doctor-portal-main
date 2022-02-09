import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { BirthService } from "../../birth.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Birth } from "../../birth.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  birthForm: FormGroup;
  birth: Birth;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public birthService: BirthService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.birth.child_name;
      this.birth = data.birth;
    } else {
      this.dialogTitle = "New Birth";
      this.birth = new Birth({});
    }
    this.birthForm = this.createContactForm();
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
      id: [this.birth.id],
      case_no: [this.birth.case_no],
      child_name: [this.birth.child_name],
      gender: [this.birth.gender],
      birth_date: [
        formatDate(this.birth.birth_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      mother_name: [this.birth.mother_name],
      father_name: [this.birth.father_name],
      mobile: [this.birth.mobile],
      address: [this.birth.address],
      note: [this.birth.note],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.birthService.addBirth(this.birthForm.getRawValue());
  }
}
