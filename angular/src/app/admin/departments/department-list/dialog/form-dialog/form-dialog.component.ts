import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { DepartmentListService } from "../../department-list.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { DepartmentList } from "../../department-list.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  departmentListForm: FormGroup;
  departmentList: DepartmentList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public departmentListService: DepartmentListService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.departmentList.d_name;
      this.departmentList = data.departmentList;
    } else {
      this.dialogTitle = "New DepartmentList";
      this.departmentList = new DepartmentList({});
    }
    this.departmentListForm = this.createContactForm();
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
      id: [this.departmentList.id],
      d_no: [this.departmentList.d_no],
      d_name: [this.departmentList.d_name],
      description: [this.departmentList.description],
      d_date: [
        formatDate(this.departmentList.d_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      d_head: [this.departmentList.d_head],
      status: [this.departmentList.status],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.departmentListService.addDepartmentList(
      this.departmentListForm.getRawValue()
    );
  }
}
