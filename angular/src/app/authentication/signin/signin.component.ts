import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { AccountService } from "../service/auth.service";
import { LoginRequestModel } from "../model/auth.model";
import { catchError, Subject, throwError } from "rxjs";
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService
  ) {
    super();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["admin@pisystems.com", Validators.required],
      password: ["123456", Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get("username").setValue("admin@pisystems.com");
    this.authForm.get("password").setValue("123456");
  }
  doctorSet() {
    this.authForm.get("username").setValue("doctor@pisystems.com");
    this.authForm.get("password").setValue("123456");
  }
  patientSet() {
    this.authForm.get("username").setValue("patient@hospital.org");
    this.authForm.get("password").setValue("patient@123");
  }

  errorMsg: string;
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = "";
    let model: LoginRequestModel = { email: this.f.username.value, password: this.f.password.value }
    this.accountService.login(model)
      .pipe(
        catchError(error => {
          this.loading = false;
          this.errorMsg = "Invalid Credentials";
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = "Some error occurred";
          }

          return throwError(errorMsg);
        })
      )
      .subscribe(
        (res) => {
          if (res) {
            localStorage.setItem("token", res.token)
            let role = res.role;
            localStorage.setItem("role", role);
            let email = "admin@pisystems.com";
            let password = "123456";
            if (role == "Doctor") {
              email = "doctor@pisystems.com";
              password = "123456";
            }
            setTimeout(() => {
              const role = this.accountService.currentUserValue.role;
              if (role === Role.All || role === Role.Admin) {
                this.router.navigate(["/admin/dashboard/main"]);
              } else if (role === Role.Doctor) {
                this.router.navigate(["/doctor/dashboard"]);
              } else if (role === Role.Patient) {
                this.router.navigate(["/patient/dashboard"]);
              } else {
                this.router.navigate(["/authentication/signin"]);
              }
              this.loading = false;
            }, 1000);
          }
          else {
            this.loading = false;
            this.error = "Invalid Login";
          }
          // this.subs.sink = this.authService
          //   .login(email, password)
          //   .subscribe(
          //     (resp) => {
          //       if (resp) {
          //         setTimeout(() => {
          //           const role = this.authService.currentUserValue.role;
          //           if (role === Role.All || role === Role.Admin) {
          //             this.router.navigate(["/admin/dashboard/main"]);
          //           } else if (role === Role.Doctor) {
          //             this.router.navigate(["/doctor/dashboard"]);
          //           } else if (role === Role.Patient) {
          //             this.router.navigate(["/patient/dashboard"]);
          //           } else {
          //             this.router.navigate(["/authentication/signin"]);
          //           }
          //           this.loading = false;
          //         }, 1000);
          //       } else {
          //         this.loading = false;
          //         this.error = "Invalid Login";
          //       }
          //     }
          //   );
        });
  }
}
