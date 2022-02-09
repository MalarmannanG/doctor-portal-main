import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { ItemStockListService } from "../../item-stock-list.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { ItemStockList } from "../../item-stock-list.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  itemStockListForm: FormGroup;
  itemStockList: ItemStockList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public itemStockListService: ItemStockListService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.itemStockList.i_name;
      this.itemStockList = data.itemStockList;
    } else {
      this.dialogTitle = "New ItemStockList";
      this.itemStockList = new ItemStockList({});
    }
    this.itemStockListForm = this.createContactForm();
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
      id: [this.itemStockList.id],
      i_name: [this.itemStockList.i_name],
      category: [this.itemStockList.category],
      qty: [this.itemStockList.qty],
      date: [
        formatDate(this.itemStockList.date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      price: [this.itemStockList.price],
      details: [this.itemStockList.details],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.itemStockListService.addItemStockList(
      this.itemStockListForm.getRawValue()
    );
  }
}
