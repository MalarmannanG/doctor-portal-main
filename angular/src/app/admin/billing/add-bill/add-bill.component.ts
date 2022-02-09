import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-bill",
  templateUrl: "./add-bill.component.html",
  styleUrls: ["./add-bill.component.sass"],
})
export class AddBillComponent {
  billForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.billForm = this.fb.group({
      bNo: ["", [Validators.required]],
      admissionID: ["", [Validators.required]],
      pName: ["", [Validators.required]],
      dName: ["", [Validators.required]],
      aDate: ["", [Validators.required]],
      dDate: ["", [Validators.required]],
      discount: [""],
      total: [""],
      pMethod: ["", [Validators.required]],
      pStatus: ["", [Validators.required]],
    });
  }
  onSubmit() {
    console.log("Form Value", this.billForm.value);
  }
}
