import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { IssuedItemsService } from "../../issued-items.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { IssuedItems } from "../../issued-items.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  issuedItemsForm: FormGroup;
  issuedItems: IssuedItems;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public issuedItemsService: IssuedItemsService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.issuedItems.i_name;
      this.issuedItems = data.issuedItems;
    } else {
      this.dialogTitle = "New Item Issue";
      this.issuedItems = new IssuedItems({});
    }
    this.issuedItemsForm = this.createContactForm();
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
      id: [this.issuedItems.id],
      i_name: [this.issuedItems.i_name],
      category: [this.issuedItems.category],
      issue_date: [
        formatDate(this.issuedItems.issue_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      return_date: [
        formatDate(this.issuedItems.return_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      issue_to: [this.issuedItems.issue_to],
      qty: [this.issuedItems.qty],
      status: [this.issuedItems.status],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.issuedItemsService.addIssuedItems(this.issuedItemsForm.getRawValue());
  }
}
