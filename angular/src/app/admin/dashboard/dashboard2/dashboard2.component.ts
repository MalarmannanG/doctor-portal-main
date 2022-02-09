import { Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AppoinemtModel } from "../../appointment/model/appointmentt.model";
import { AppoinementsService } from "../../appointment/service/Appointmentt.service";
import { PatientFilesModel, PatientNewFilesModel, VitalsReportModel } from "../model/vitals.model";
import { VitalsReportService } from "../service/vitals.service";


@Component({
  selector: "app-dashboard2",
  templateUrl: "./dashboard2.component.html",
  styleUrls: ["./dashboard2.component.scss"],
})
export class Dashboard2Component implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  model = new VitalsReportModel();
  appointment = new AppoinemtModel();
  patientFiles: any;
  newFiles = [];
  
  constructor(public appoinementsService: AppoinementsService,
    public activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    public router: Router,
    public vitalsReportService: VitalsReportService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

  fileChange() {
    this.patientFiles?._files?.forEach(element => {
      this.getBase64(element);
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && charCode != 46 &&  (charCode < 48 || charCode > 57 )) {
      return false;
    }
    return true;
  }

  prepareUrl(url) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  getBase64(file) {
    debugger
    let comp = this;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () { 
      debugger
      let newObj = new PatientNewFilesModel();
      let base64String = String(reader.result);
      newObj.base64String = base64String?.split(',')[1]
      newObj.fileName = file.name;
      comp.newFiles.push(newObj);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  onSubmit() {
    this.model.patientNewFiles = this.newFiles;
    this.model.appointmentID = this.appointment.id;
    this.model.patientID = this.appointment.patientId;
    this.vitalsReportService.post(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.router.navigateByUrl('/admin/dashboard/main');
    });
  }

  update() {
    this.model.patientNewFiles = this.newFiles;
    this.vitalsReportService.put(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.router.navigateByUrl('/admin/dashboard/main');
    });
    
  }

  get() {
    this.vitalsReportService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.model = resp;
    });
  }

  getAppointment() {
    this.appoinementsService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.appointment = resp;
    });
  }



  id: any;
  ngOnInit() {
    this.model.patientNewFiles = [];
    let appointementId = this.activatedRoute.snapshot.paramMap.get('id');
    if(appointementId){
      this.id = appointementId;
      this.get();
      this.getAppointment();
    }
  }

}
