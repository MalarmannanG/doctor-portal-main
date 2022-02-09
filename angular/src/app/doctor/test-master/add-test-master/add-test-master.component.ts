import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { TestMasterModel } from "../model/test-master.model.service";
import { TestMasterService } from "../service/test-master.service";

@Component({
  selector: "app-add-test-master",
  templateUrl: "./add-test-master.component.html",
  styleUrls: ["./add-test-master.component.sass"],
})

export class AddTestMasterComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new TestMasterModel();
  constructor(private router: Router, 
    private testMasterService: TestMasterService,
    private activatedRoute: ActivatedRoute) {
    
  }

  update() {
    this.testMasterService.put(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      console.log(resp)
      this.router.navigateByUrl('/doctor/all-test')
    });
  } 
  
  onSubmit() {
    this.testMasterService.post(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      console.log(resp)
      this.router.navigateByUrl('/doctor/all-test')
    });
  }

  get() {
    this.testMasterService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.model = resp;
    });
  }

  id: any;
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.id = id;
      this.get();
    } 
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
