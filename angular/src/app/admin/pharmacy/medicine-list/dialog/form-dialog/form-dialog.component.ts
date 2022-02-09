import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { MedicineListService } from "../../medicine-list.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { MedicineList } from "../../medicine-list.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  medicineListForm: FormGroup;
  medicineList: MedicineList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public medicineListService: MedicineListService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.medicineList.m_name;
      this.medicineList = data.medicineList;
    } else {
      this.dialogTitle = "New MedicineList";
      this.medicineList = new MedicineList({});
    }
    this.medicineListForm = this.createContactForm();
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
      id: [this.medicineList.id],
      m_no: [this.medicineList.m_no],
      m_name: [this.medicineList.m_name],
      category: [this.medicineList.category],
      company: [this.medicineList.company],
      p_date: [
        formatDate(this.medicineList.p_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      price: [this.medicineList.price],
      e_date: [
        formatDate(this.medicineList.e_date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      stock: [this.medicineList.stock],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.medicineListService.addMedicineList(
      this.medicineListForm.getRawValue()
    );
  }
}
