import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-department",
  templateUrl: "./add-department.component.html",
  styleUrls: ["./add-department.component.sass"],
})
export class AddDepartmentComponent {
  departForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.departForm = this.fb.group({
      d_no: ["", [Validators.required]],
      d_name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      d_date: ["", [Validators.required]],
      d_head: ["", [Validators.required]],
      status: ["Active", [Validators.required]],
    });
  }
  onSubmit() {
    console.log("Form Value", this.departForm.value);
  }
}
