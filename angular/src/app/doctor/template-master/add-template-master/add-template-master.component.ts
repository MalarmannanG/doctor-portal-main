import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { PrescriptionMasterModel } from "../../patient-profile/model/patient-profile.model.service";
import { PatientProfileService } from "../../patient-profile/service/patient-profile.service";
import { TemplateMasterModel, TemplatePrescriptionModel } from "../model/template-master.model.service";
import { TemplateMasterService } from "../service/template-master.service";

@Component({
  selector: "app-add-template-master",
  templateUrl: "./add-template-master.component.html",
  styleUrls: ["./add-template-master.component.sass"],
})

export class AddTemplateMasterComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  step: number = 0;
  isTemplateSelected = false;
  agree3 = false;
  unsubscribe$ = new Subject();
  model = new TemplateMasterModel();
  newMed: boolean = false;
  editing: boolean = false;
  activePrescription = new TemplatePrescriptionModel();
  prescriptionOptions: PrescriptionMasterModel[] = [];
  prescriptionList: PrescriptionMasterModel[] =[];
  genericName: string;
  constructor(private router: Router, 
    private patientProfileService: PatientProfileService,
    private templateMasterService: TemplateMasterService,
    private activatedRoute: ActivatedRoute) {
    
  }

  cancelPrescription() {
    this.activePrescription = new TemplatePrescriptionModel();
    this.prescriptionOptions = this.prescriptionList;
    this.newMed = false;
  }

  addPrescription() {
    if(!this.editing) {
      this.model.templatePrescriptionModel?.push(this.activePrescription);
    } else {
      this.editablePrescription.medicinName = this.activePrescription.medicinName;
      this.editablePrescription.strength = this.activePrescription.strength;
      this.editablePrescription.genericName = this.activePrescription.genericName;
      this.editablePrescription.morning = this.activePrescription.morning;
      this.editablePrescription.noon = this.activePrescription.noon;
      this.editablePrescription.night = this.activePrescription.night;
      this.editablePrescription.beforeFood = this.activePrescription.beforeFood;
      this.editablePrescription.description = this.activePrescription.description;
      this.editablePrescription.noOfDays = this.activePrescription.noOfDays;
    }
    this.activePrescription = new TemplatePrescriptionModel();
    this.prescriptionOptions = this.prescriptionList;
    this.newMed = false;
    this.editing = false;
  }

  editablePrescription = new TemplatePrescriptionModel();
  edit(event) {
    this.editablePrescription = event;
    this.activePrescription = JSON.parse(JSON.stringify(this.editablePrescription));
    this.editing = true;
    this.newMed = true;
  }


  addMed() {
    this.newMed = true;
  }

  update() {
    this.templateMasterService.put(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      console.log(resp)
      this.router.navigateByUrl('/doctor/all-template')
    });
  } 
  
  onSubmit() {
    this.templateMasterService.post(this.model)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      console.log(resp)
      this.router.navigateByUrl('/doctor/all-template')
    });
  }

  get() {
    this.templateMasterService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.model = resp;
    });
  }

  onMedSelectionChanged(event) {
    if(event.option.value) {
      let selected = this.prescriptionList.filter(a => a.medicinName == event.option.value)[0];
      this.activePrescription.medicinName = selected.medicinName;
      this.activePrescription.strength = selected.strength;
      this.activePrescription.genericName = selected.genericName;
    }
  }

  doMedFilter(filter) {
    filter = filter;
    this.prescriptionOptions = [];  
    this.prescriptionList.forEach(element => {
      if(element.medicinName.toLocaleLowerCase().includes(filter?.toLocaleLowerCase())) {
        this.prescriptionOptions.push(element)
      }
    });     
  } 
  
  populatePrescriptionMaster() {    
    this.patientProfileService.getMedicines()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {      
      this.prescriptionList = resp?.result;
      this.prescriptionOptions = this.prescriptionList;
    });
  }

  id: any;
  ngOnInit() {
    this.populatePrescriptionMaster();
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
