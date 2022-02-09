import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { DiagnosisMasterModel, DiagnosisMasterModelList } from "../../diagnosis-master/model/diagnosis-master.model.service";
import { DiagnosisMasterService } from "../../diagnosis-master/service/diagnosis-master.service";
import { TemplateMasterModel } from "../../template-master/model/template-master.model.service";
import { TemplateMasterService } from "../../template-master/service/template-master.service";
import { TestMasterModel } from "../../test-master/model/test-master.model.service";
import { TestMasterService } from "../../test-master/service/test-master.service";
import { PatientDiagnosisModel, PatientProfileModel, PatientTestModel, PrescriptionMasterModel, PrescriptionModel } from "../model/patient-profile.model.service";
import { PatientProfileService } from "../service/patient-profile.service";

@Component({
  selector: "app-patient-profile",
  templateUrl: "./patient-profile.component.html",
  styleUrls: ["./patient-profile.component.scss"],
})

export class NewPatientProfileComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  step: number = 0;
  isTemplateSelected = false;
  @ViewChild('templateInput') templateInput: ElementRef<HTMLInputElement>;
  @ViewChild('lastElement') lastElement: ElementRef<HTMLInputElement>;
  agree3 = false;
  vitalStep: number = 0;
  unsubscribe$ = new Subject();
  model = new PatientProfileModel();
  newMed: boolean = false;
  editing: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  activePrescription = new PrescriptionModel();
  templateList: TemplateMasterModel[] = [];
  diagosisList: DiagnosisMasterModel[] = [];
  selectedTemplate: string;
  selectedTemplateObjs: TemplateMasterModel[] = [];
  selectedTemplateObjsTemp: TemplateMasterModel[] = [];
  selectedTemplateObj: TemplateMasterModel = new TemplateMasterModel();
  selectedDiags: DiagnosisMasterModel[] = [];
  diagOptions: DiagnosisMasterModelList[] = [];
  inestigationOptions: TestMasterModel[] = [];
  testMaster: TestMasterModel[] = [];
  selectedInvestigation: any;
  pastHistoryList: PatientProfileModel[] = [];
  selectedprescrptionObj: PrescriptionMasterModel = new PrescriptionMasterModel();
  prescriptionOptions: PrescriptionMasterModel[] = [];
  prescriptionList: PrescriptionMasterModel[] = [];
  selectedTemplateName: string;
  templateLoading = true;

  constructor(private router: Router,
    private patientProfileService: PatientProfileService,
    private templateMasterService: TemplateMasterService,
    private testMasterSerice: TestMasterService,
    private diagnosisMasterService: DiagnosisMasterService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) {

  }

  addDiag() {
    this.model.patientDiagnosisModel.push(new PatientDiagnosisModel());
    this.diagOptions = this.diagOptions ?? [];
    this.diagOptions.push({ model: this.diagosisList });
  }

  focusInput(element: ElementRef) {
    element.nativeElement.focus();
  }

  removeDiag(index) {
    if (this.model.patientDiagnosisModel?.length > 0) {
      this.model.patientDiagnosisModel[index].isDeleted = true;
    }
  }

  onSelectionChanged(event, obj: PatientTestModel) {
    if (event.option.value) {
      obj.testMasterId = this.testMaster.filter(a => a.name == event.option.value)[0].id;
    }
  }

  addMore() {
    this.selectedTemplateObjsTemp = JSON.parse(JSON.stringify(this.selectedTemplateObjs));
    this.isTemplateSelected = !this.isTemplateSelected;
  }

  cancel() {
    this.isTemplateSelected = !this.isTemplateSelected;
  }

  onMedSelectionChanged(event) {
    if (event.option.value) {
      let selected = this.prescriptionList.filter(a => a.medicinName == event.option.value)[0];
      this.activePrescription.medicinName = selected.medicinName;
      this.activePrescription.strength = selected.strength;
      this.activePrescription.genericName = selected.genericName;
    }
  }

  onDiagSelectionChanged(event, each) {
    if (event.option.value) {
      let selected = this.diagosisList.filter(a => a.name == event.option.value)[0];
      each.diagnosisMasterId = selected.id;
    } else {
      each.diagnosisMasterId = undefined;
    }
  }

  addTemplate(event) {
    if (this.selectedTemplateName) {
      let selectedTemplateObj = this.templateList.filter(a => a.name == this.selectedTemplateName)[0];
      this.selectedTemplateObjsTemp.push(selectedTemplateObj);
    }
  }

  templateSelected() {
    this.model.templateMasterId = this.selectedTemplateObj?.id;
    this.model.compliants = this.selectedTemplateObj?.compliants ?? "";
    this.model.examination = this.selectedTemplateObj?.examination ?? "";
    this.model.impression = this.selectedTemplateObj?.impression ?? "";
    this.model.plan = this.selectedTemplateObj?.plan ?? "";
    this.model.advice = this.selectedTemplateObj?.advice ?? "";
    this.model.followUp = this.selectedTemplateObj?.followUp ?? "";
    this.model.prescriptionModel = this.selectedTemplateObj?.templatePrescriptionModel;
  }

  clearTemplate() {
    this.selectedTemplateObj = null;
    this.templateSelected();
  }

  goto(appointmentId) {
    let url = `${environment.navUrl}/#/doctor/patient-profile/${appointmentId}`;
    window.open(url);
  }

  changeTemplate() {
    this.isTemplateSelected = !this.isTemplateSelected;
    this.selectedTemplateObj = new TemplateMasterModel();
    this.selectedDiags = [];
  }

  addPrescription() {
    if (!this.editing) {
      this.model.prescriptionModel?.push(this.activePrescription);
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
    this.activePrescription = new PrescriptionModel();
    this.prescriptionOptions = this.prescriptionList;
    this.newMed = false;
    this.editing = false;
  }

  editablePrescription = new PrescriptionModel();
  edit(event) {
    this.editablePrescription = event;
    this.activePrescription = JSON.parse(JSON.stringify(this.editablePrescription));
    this.editing = true;
    this.newMed = true;
  }

  populatePrescriptionMaster() {
    this.patientProfileService.getMedicines()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.prescriptionList = resp?.result;
        this.prescriptionOptions = this.prescriptionList;
      });
  }

  populateTemplateList() {
    this.templateMasterService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.templateLoading = false;
        this.templateList = resp?.result;
        if (this.model.templateMasterId) {
          let template = this.templateList?.filter(a => a.id == this.model.templateMasterId);
          if (template?.length > 0) {
            this.selectedTemplateObj = template[0];
            this.selectedTemplateObjs.push(template[0]);
            this.selectedTemplateObjsTemp.push(template[0]);
          }
        }
      });
  }

  diagLoading: boolean = true;
  populateDiagnosis() {
    this.diagLoading = true;
    this.diagnosisMasterService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.diagLoading = false;
        this.diagosisList = resp?.result;
        this.model.patientDiagnosisModel.forEach((element, index) => {
          this.diagOptions.push({ model: this.diagosisList });
        });
      });
  }

  addMed() {
    this.newMed = true;
  }

  update() {
    this.model.patientDiagnosisModel = this.model?.patientDiagnosisModel.filter(a => a.id || a.diagnosisMasterName)
    this.patientProfileService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.router.navigateByUrl('/doctor/dashboard')
      });
  }

  getPastHistories() {
    let query = `?patientId=${this.model.patientId}&appointmentDate=${this.model.appointment.appointmentDateTime}`
    this.patientProfileService.getAll(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.pastHistoryList = resp?.filter(a => a.appointmentId != this.model.appointmentId);
      });
  }

  onSubmit() {
    this.patientProfileService.post(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.router.navigateByUrl('/doctor/dashboard')
      });
  }

  get() {
    this.patientProfileService.get(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
        if (!(this.model.patientDiagnosisModel?.length > 0)) {
          this.model.patientDiagnosisModel = [];
          this.model.patientDiagnosisModel.push(new PatientDiagnosisModel());
        }
        this.isTemplateSelected = this.model.patientDiagnosisModel?.length > 0;
        this.populateTestMaster();
        this.populateTemplateList();
        this.populateDiagnosis();
        this.getPastHistories();
        this.populatePrescriptionMaster();
      });
  }

  getPrescriptionMaster() {
    this.patientProfileService.getMedicines()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
      });
  }

  addInestigation() {
    if (this.model.patientTestModel?.length > 0) {
      this.model.patientTestModel?.push(new PatientTestModel());
    } else {
      this.model.patientTestModel = [];
      this.model.patientTestModel?.push(new PatientTestModel());
    }
  }

  cancelPrescription() {
    this.activePrescription = new PrescriptionModel();
    this.prescriptionOptions = this.prescriptionList;
    this.newMed = false;
  }

  removeInestigation() {
    this.model.patientTestModel.pop()
  }

  openModel(content) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  doFilter(filter) {
    filter = filter;
    this.inestigationOptions = [];
    this.testMaster.forEach(element => {
      if (element.name.toLocaleLowerCase().includes(filter?.toLocaleLowerCase())) {
        this.inestigationOptions.push(element)
      }
    });
  }

  removeChip(removeIndex: number, edit = false) {
    if (edit) {
      this.selectedTemplateObjsTemp = this.selectedTemplateObjsTemp?.filter((a, i) => i != removeIndex);
    } else {
      this.selectedTemplateObjs = this.selectedTemplateObjs?.filter((a, i) => i != removeIndex);
      if (this.selectedTemplateObjs?.length > 0) {
        this.selectedTemplateObj = this.selectedTemplateObjs[0];
        this.templateSelected();
      } else {
        this.selectedTemplateObj = new TemplateMasterModel();
      }
    }
  }

  showDiagnosisAdd() {
    let patientDiagsCount = this.model.patientDiagnosisModel?.filter(a => !a.isDeleted)?.length ?? 0;    
    return patientDiagsCount == 0;
  }


showAddDiagnosis() {
let patientDiagsCount = this.model?.patientDiagnosisModel?.filter(a=> !a.isDeleted)?.length ?? 0;
return patientDiagsCount == 0; 
}

showDiagnosisDelete(index) {
let patientDiagsCount = this.model?.patientDiagnosisModel?.filter(a=> !a.isDeleted)?.length ?? 0;
return index == (patientDiagsCount - 1);
}

showInvestigationDelete(index) {
let investcationsCount = this.model?.patientTestModel?.filter(a=> !a.isDeleted)?.length ?? 0;
return index == (investcationsCount - 1);
}

  saveTemplate() {
    this.selectedTemplateObjs = JSON.parse(JSON.stringify(this.selectedTemplateObjsTemp));
    this.selectedTemplateObj = this.selectedTemplateObjs[0];
    this.isTemplateSelected = !this.isTemplateSelected;
    this.templateSelected();
  }

  doMedFilter(filter) {
    filter = filter;
    this.prescriptionOptions = [];
    this.prescriptionList.forEach(element => {
      if (element.medicinName.toLocaleLowerCase().includes(filter?.toLocaleLowerCase())) {
        this.prescriptionOptions.push(element)
      }
    });
  }

  doDiagFilter(filter, index) {
    filter = filter;
    this.diagOptions[index].model = [];
    this.diagosisList.forEach(element => {
      if (element.name.toLocaleLowerCase().includes(filter?.toLocaleLowerCase())) {
        this.diagOptions[index].model.push(element)
      }
    });
  }

  populateTestMaster() {
    this.testMasterSerice.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.testMaster = resp?.result;
        this.inestigationOptions = this.testMaster;
      });
  }

  id: any;
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.get();
    } else {
      if (!(this.model.patientDiagnosisModel?.length > 0)) {
        this.model.patientDiagnosisModel = [];
        this.model.patientDiagnosisModel.push(new PatientDiagnosisModel());
      }
      this.populatePrescriptionMaster();
      this.populateTestMaster()
      this.populateDiagnosis();
      this.populateTemplateList();

    }
  }

  printPrescrption() {
    // this.router.navigateByUrl(`/doctor/prescription-print/${this.id}`)


    var mywindow = window.open('A4', 'PRINT');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');

    mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" media="all" crossorigin="anonymous">');
    mywindow.document.write('<style>@page { size: A4; margin: 0; }</style>');
    mywindow.document.write('</head><body>');
    mywindow.document.write('<script> function printing() {  document.getElementById("print-btn").remove(); window.print(); window.close(); } </script>');
    mywindow.document.write(document.getElementById("section-to-print").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/   
    return true;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
