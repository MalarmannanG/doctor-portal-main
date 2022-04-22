import { COMMA, ENTER, I } from "@angular/cdk/keycodes";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { DiagnosisMasterModel, DiagnosisMasterModelList } from "../diagnosis-master/model/diagnosis-master.model.service";
import { DiagnosisMasterService } from "../diagnosis-master/service/diagnosis-master.service";
import { TemplateMasterModel } from "../template-master/model/template-master.model.service";
import { TemplateMasterService } from "../template-master/service/template-master.service";
import { TestMasterModel } from "../test-master/model/test-master.model.service";
import { TestMasterService } from "../test-master/service/test-master.service";
import { PatientDiagnosisModel, PatientProfileModel, PatientTestModel, PrescriptionMasterModel, PrescriptionModel } from "./model/patient-profile.model.service";
import { PatientProfileService } from "./service/patient-profile.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VitalsReportService } from "src/app/admin/dashboard/service/vitals.service";
import { saveAs } from 'file-saver';
import { PatientProcedureModel } from "src/app/admin/patients/model/procedureModel";
import { PatientModel } from "src/app/admin/patients/model/patient.model";
import { DoctorService } from "src/app/admin/doctors/service/doctor.service";
import { ProcedureMasterService } from "../procedure-master/service/procedure-master.service";
import { ProcedureMasterModel } from "../procedure-master/model/procedure-master.model.service";
import { AccountService } from "src/app/authentication/service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";
import { VitalsReportModel } from "src/app/admin/dashboard/model/vitals.model";
import { AppoinemtModel } from "src/app/admin/appointment/model/appointmentt.model";

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class PatientProfileComponent implements OnInit {
  docForm: FormGroup;
  hide3 = true;
  step: number = 0;
  isTemplateSelected = false;
  isProcedureSelected = false;
  isDiagSelected = false;
  isTestSelected = false;
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
  temptemplateList: TemplateMasterModel[] = [];
  procedureList: ProcedureMasterModel[] = [];
  tempProcedureList: ProcedureMasterModel[] = [];
  selectedProcedureObjs: ProcedureMasterModel[] = [];
  selectedProcedureObjsTemp: ProcedureMasterModel[] = [];
  selectedProcedureObj: ProcedureMasterModel = new ProcedureMasterModel();
  diagosisList: DiagnosisMasterModel[] = [];
  selectedTemplate: string;
  selectedTemplateObjs: TemplateMasterModel[] = [];
  selectedTemplateObjsTemp: TemplateMasterModel[] = [];
  selectedTemplateObj: TemplateMasterModel = new TemplateMasterModel();
  selectedDiags: DiagnosisMasterModel[] = [];
  diagOptions: DiagnosisMasterModelList[] = [];
  inestigationOptions: TestMasterModel[] = [];
  testMaster: TestMasterModel[] = [];
  complaintsList: string[] = [];
  adviceList: string[] = [];
  selectedInvestigation: any;
  pastHistoryList: PatientProfileModel[] = [];
  selectedprescrptionObj: PrescriptionMasterModel = new PrescriptionMasterModel();
  prescriptionOptions: PrescriptionMasterModel[] = [];
  prescriptionList: PrescriptionMasterModel[] = [];
  complaintsOptions: string[] = [];
  adviceOptions: string[] = [];
  selectedTemplateName: string;
  selectedProcedureName: string;
  selectedDiagName: string;
  selectedTestName: string;
  templateLoading = true;
  procedureLoading = true;
  selectedMedicine = '';
  selectedComplaint = '';
  selectedAdvice = '';
  today = new Date();
  doctorOptions: any[] = [];
  patientDiagnosisModel: PatientDiagnosisModel[] = [];
  doctorOption: any;
  user: any = {};
  vitalsModel = new VitalsReportModel();
  appointmentModel = new AppoinemtModel();
  // constructor() {}
  constructor(config: NgbModalConfig, private router: Router,
    private patientProfileService: PatientProfileService,
    private templateMasterService: TemplateMasterService,
    private testMasterSerice: TestMasterService,
    private diagnosisMasterService: DiagnosisMasterService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public vitalsReportService: VitalsReportService,
    public procedureMasterService: ProcedureMasterService,
    public accountService: AccountService,
    private snackBar: MatSnackBar,
    private doctorService: DoctorService) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openLg(content) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  open(content) {
    this.modalService.open(content);
  }
  getAllComplaints() {
    this.patientProfileService.getAllComplaints().subscribe(res => {
      this.complaintsList = this.complaintsOptions = res.complaints;
      this.adviceList = this.adviceOptions = res.advices;
    });
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
  addMoreTest() {
    this.isTestSelected = !this.isTestSelected;
  }

  addMoreDigs() {
    this.isDiagSelected = !this.isDiagSelected;
  }

  addMore() {
    this.selectedTemplateObjsTemp = JSON.parse(JSON.stringify(this.selectedTemplateObjs));
    this.isTemplateSelected = !this.isTemplateSelected;
  }
  addMoreProcedure() {
    this.selectedProcedureObjsTemp = JSON.parse(JSON.stringify(this.selectedProcedureObjs));
    this.isProcedureSelected = !this.isProcedureSelected;
  }
  cancel() {
    this.isTemplateSelected = !this.isTemplateSelected;
  }
  cancelDiags() {

    this.isDiagSelected = !this.isDiagSelected;
  }
  cancelTest() {
    this.isTestSelected = !this.isTestSelected;
    this.modalService.dismissAll();
  }
  onMedSelectionChanged(event) {

    if (event.option.value) {
      let selected = this.prescriptionList.filter(a => a.id == event.option.value)[0];
      this.activePrescription.medicineName = selected.medicineName;
      this.activePrescription.strength = selected.strength;
      this.activePrescription.genericName = selected.genericName;
      this.activePrescription.categoryName = selected.categoryName;
      this.activePrescription.units = selected.units;
      var strength = selected.strength != null ? '- ' + selected.strength : '';
      var categoryName = selected.categoryName != null ? '- ' + selected.categoryName : '';
      var units = selected.units != null ? '- ' + selected.units : '';
      this.activePrescription.remarks = selected.remarks;
      this.selectedMedicine = selected.medicineName + categoryName + strength + units;

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
  onTemplateSelected(selectedTemplateName) {
    //console.log(event);
    this.selectedTemplateName = selectedTemplateName;
    if (this.selectedTemplateName) {
      let selectedTemplateObj = this.templateList.filter(a => a.name == this.selectedTemplateName)[0];
      //this.selectedTemplateObjsTemp.push(selectedTemplateObj);

      this.selectedTemplateObj = selectedTemplateObj;
      this.templateSelected();
    }
  }
  onTemplateRemoved(selectedTemplateName) {
    var removeIndex = this.selectedTemplateObjsTemp?.findIndex((a) => a.name == selectedTemplateName);
    //this.model.patientDiagnosisModel = this.model.patientDiagnosisModel?.filter((a, i) => i != removeIndex);
    this.selectedTemplateObjsTemp = this.selectedTemplateObjsTemp?.filter((a, i) => i != removeIndex);
  }
  addTemplate(event) {
    if (this.selectedTemplateName) {
      let selectedTemplateObj = this.templateList.filter(a => a.name == this.selectedTemplateName)[0];
      this.selectedTemplateObjsTemp.push(selectedTemplateObj);
      this.templateSelected();
    }
  }
  addProcedure(event) {

    if (this.selectedProcedureName) {
      let selectedProcedureObj = this.procedureList.filter(a => a.name == this.selectedProcedureName)[0];
      this.selectedProcedureObjsTemp.push(selectedProcedureObj);
      this.procedureSelected();
    }
  }
  addDiag(event) {
    this.selectedDiagName = event;
    if (this.selectedDiagName) {
      let selectedTemplateObj = this.diagosisList.filter(a => a.name == this.selectedDiagName)[0];
      var _patientDiag = new PatientDiagnosisModel();
      _patientDiag.name = selectedTemplateObj.name;
      _patientDiag.description = selectedTemplateObj.description;
      _patientDiag.diagnosisMasterId = selectedTemplateObj.id;
      _patientDiag.patientProfileId = this.id;
      if (this.model.patientDiagnosisModel == null) {
        this.model.patientDiagnosisModel = [];
      }
      var index = this.model.patientDiagnosisModel.findIndex(x => x.name == event);
      if (index === -1)
        this.model.patientDiagnosisModel.push(_patientDiag);
      console.log(this.model.patientDiagnosisModel.length);
      //this.templateSelected();
    }
  }
  addTest(event) {
    if (this.selectedTestName) {
      let selectedTemplateObj = this.inestigationOptions.filter(a => a.name == this.selectedTestName)[0];
      var _patientDiag = new PatientTestModel();
      _patientDiag.testMasterName = selectedTemplateObj.name;
      _patientDiag.remarks = selectedTemplateObj.remarks;
      _patientDiag.testMasterId = selectedTemplateObj.id;
      if (this.model.patientTestModel == null)
        this.model.patientTestModel = [];
      this.model.patientTestModel.push(_patientDiag);

      //this.templateSelected();
    }
  }
  templateSelected() {
    this.model.templateMasterId = this.selectedTemplateObj?.id;
    this.model.compliants = this.selectedTemplateObj?.compliants ?? "";
    this.model.examination = this.selectedTemplateObj?.examination ?? "";
    this.model.impression = this.selectedTemplateObj?.impression ?? "";
    this.model.plan = this.selectedTemplateObj?.plan ?? "";
    this.model.advice = this.selectedTemplateObj?.advice ?? "";
    this.selectedComplaint = this.model.compliants;
    this.selectedAdvice = this.model.advice;
    this.model.prescriptionModel = this.selectedTemplateObj?.templatePrescriptionModel;
  }
  procedureSelected() {
    this.model.procedureMasterId = this.selectedProcedureObj?.id
    this.model.procedureModel.actualCost = this.selectedProcedureObj?.actualCost;
    this.model.procedureModel.anesthesia = this.selectedProcedureObj?.anesthesia ?? "";
    this.model.procedureModel.complication = this.selectedProcedureObj?.complication ?? "";
    this.model.procedureModel.description = this.selectedProcedureObj?.description ?? "";
    this.model.procedureModel.diagnosis = this.selectedProcedureObj?.diagnosis ?? "";
    this.model.procedureModel.others = this.selectedProcedureObj?.others ?? "";
    this.model.procedureModel.name = this.selectedProcedureObj?.name ?? "";

    // this.model.examination = this.selectedTemplateObj?.examination ?? "";
    // this.model.impression = this.selectedTemplateObj?.impression ?? "";
    // this.model.plan = this.selectedTemplateObj?.plan ?? "";
    // this.model.advice = this.selectedTemplateObj?.advice ?? "";
    // this.model.followUp = this.selectedTemplateObj?.followUp ?? null;
    // this.selectedComplaint = this.model.compliants;
    // this.selectedAdvice =  this.model.advice;
    // this.model.prescriptionModel = this.selectedTemplateObj?.templatePrescriptionModel;
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
      this.selectedMedicine = '';
    } else {
      this.editablePrescription.medicineName = this.activePrescription.medicineName;
      this.editablePrescription.strength = this.activePrescription.strength;
      this.editablePrescription.genericName = this.activePrescription.genericName;
      this.editablePrescription.morning = this.activePrescription.morning;
      this.editablePrescription.noon = this.activePrescription.noon;
      this.editablePrescription.night = this.activePrescription.night;
      this.editablePrescription.beforeFood = this.activePrescription.beforeFood;
      this.editablePrescription.remarks = this.activePrescription.remarks;
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
    this.selectedMedicine = this.activePrescription.medicineName;
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
  changeOpened(item) {
    item.appointment.isOpened = !item.appointment.isOpened;
  }
  populateProcedureList() {
    this.procedureMasterService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.procedureLoading = false;
        this.procedureList = resp?.result;
        if (this.model.procedureMasterId) {
          let template = this.procedureList?.filter(a => a.id == this.model.procedureMasterId);
          if (template?.length > 0) {
            this.selectedProcedureObj = template[0];
            this.selectedProcedureObjs.push(template[0]);
            this.selectedProcedureObjsTemp.push(template[0]);
            this.isProcedureSelected = true;
          }
        }
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
            this.isTemplateSelected = true;
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
        this.model.patientDiagnosisModel?.forEach((element, index) => {
          this.diagOptions.push({ model: this.diagosisList });
          this.isDiagSelected = true;
        });
      });
  }

  addMed() {
    this.selectedMedicine = "";
    this.newMed = true;
  }
  update() {
    this.model.procedureModel.referedBy = this.doctorOption.value;
    this.model.appointment.isActive = true;
    this.savePatientProfile(false);
  }
  finish() {
    this.model.procedureModel.referedBy = this.doctorOption.value;
    this.model.appointment.isActive = false;
    Swal.fire({
      title: "Are you sure to close this appoinment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Finish this appoinment!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value)
        this.savePatientProfile(true);
      else
        return false;
    });
  }
  savePatientProfile(result: boolean) {
    var message = result ? "Patient's Appoinment Completed!!" : "Patient's Profile Saved Successfully!!";
    this.model.patientDiagnosisModel = this.model?.patientDiagnosisModel?.filter(a => a.id || a.name);
    if (this.model.isfollowUpNeed) {
      var datetime = moment(this.model.followUp).utcOffset(0, true).toLocaleString();
      const datetimearray = datetime.split(' GMT');
      this.model.followUpDate = datetimearray[0];
    }
    this.patientProfileService.put(this.model)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.showNotification("snackbar-success", message);
        if (result)
          this.router.navigateByUrl('/doctor/dashboard');
      });
  }
  showNotification(colorName, text) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: "bottom",
      horizontalPosition: "center",
      panelClass: colorName,
    });
  }
  public objectComparisonFunction = function (option, item): boolean {
    return option.value === item.value;
  }
  getDoctors() {
    this.doctorService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.doctorOptions = resp?.result?.map(a => {
          return { name: a.name, value: a.id };
        })
        this.doctorOptions.splice(0, 0, { name: 'Select Facility', value: -1 });
        if (this.id && this.model.procedureModel?.referedBy) {
          this.doctorOption = this.doctorOptions.filter(a => a.value == this.model.procedureModel.referedBy)[0];
          console.log(this.doctorOption);
        }
        else {
          this.doctorOption = this.doctorOptions[0];
        }
      });
  }
  getPastHistories() {
    let query = `?patientId=${this.model.patientId}&appointmentDate=${this.model.appointment.appointmentDateTime}`
    this.patientProfileService.getAll(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.pastHistoryList = resp?.filter(a => a.appointmentId != this.model.appointmentId);
        this.pastHistoryList.forEach(function (item) {
          item.appointment.isOpened = false;
        })
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
        this.model.prescriptionModel = this.model.prescriptionModel.filter(item => !item.isDeleted)
        this.selectedComplaint = this.model.compliants;
        this.selectedAdvice = this.model.advice;
        this.isDiagSelected = this.model.patientDiagnosisModel?.length > 0;
        if (this.model.appointment.vitalsReportModel == null)
          this.model.appointment.vitalsReportModel = new VitalsReportModel();
        //this.patientDiagnosisModel = this.model.patientDiagnosisModel?.length > 0 ? this.model.patientDiagnosisModel : [];
        this.model.patientDiagnosisModel.forEach(item => {
          this.patientDiagnosisModel.push(item);
        })
        this.isTestSelected = this.model.patientTestModel?.length > 0;
        this.populateTestMaster();
        this.populateTemplateList();
        this.populateProcedureList();
        this.populateDiagnosis();
        this.getPastHistories();
        this.populatePrescriptionMaster();
        this.getDoctors();
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
  onRemoveDiagChip(name) {
    var removeIndex = this.model.patientDiagnosisModel?.findIndex((a) => a.name == name);
    this.model.patientDiagnosisModel = this.model.patientDiagnosisModel?.filter((a, i) => i != removeIndex);
  }


  removeDiagChip(removeIndex: number, edit = false) {
    if (edit) {
      this.model.patientDiagnosisModel = this.model.patientDiagnosisModel?.filter((a, i) => i != removeIndex);
      if (this.model.patientDiagnosisModel?.length > 0)
        this.isDiagSelected = !this.isDiagSelected;
    } else {
      this.model.patientDiagnosisModel = this.model.patientDiagnosisModel?.filter((a, i) => i != removeIndex);
      if (this.model.patientDiagnosisModel?.length < 1)
        this.isDiagSelected = !this.isDiagSelected;

    }
  }
  removeTestChip(removeIndex: number, edit = false) {
    if (edit) {
      this.model.patientTestModel = this.model.patientTestModel?.filter((a, i) => i != removeIndex);
      if (this.model.patientTestModel?.length > 0)
        this.isTemplateSelected = !this.isTemplateSelected;
    } else {
      this.model.patientTestModel = this.model.patientTestModel?.filter((a, i) => i != removeIndex);
      if (this.model.patientTestModel?.length < 1)
        this.isTemplateSelected = !this.isTemplateSelected;

    }
  }
  removeProcedureChip(name) {
    var removeIndex = this.selectedProcedureObjsTemp?.findIndex((a) => a.name == name);
    this.selectedProcedureObjsTemp = this.selectedProcedureObjsTemp?.filter((a, i) => i != removeIndex);
  }
  removeProcedureChip1(removeIndex: number, edit = false) {
    if (edit) {
      this.selectedProcedureObjsTemp = this.selectedProcedureObjsTemp?.filter((a, i) => i != removeIndex);
    } else {
      this.selectedProcedureObjs = this.selectedProcedureObjs?.filter((a, i) => i != removeIndex);
      if (this.selectedProcedureObjs?.length > 0) {
        this.selectedProcedureObj = this.selectedProcedureObjs[0];
        this.procedureSelected();
      } else {
        this.selectedProcedureObj = new ProcedureMasterModel();
        this.model.procedureMasterId = null;
        this.model.procedureModel = new PatientProcedureModel();
      }
    }
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
    let patientDiagsCount = this.model?.patientDiagnosisModel?.filter(a => !a.isDeleted)?.length ?? 0;
    return patientDiagsCount == 0;
  }

  showDiagnosisDelete(index) {
    let patientDiagsCount = this.model?.patientDiagnosisModel?.filter(a => !a.isDeleted)?.length ?? 0;
    return index == (patientDiagsCount - 1);
  }

  showInvestigationDelete(index) {
    let investcationsCount = this.model?.patientTestModel?.filter(a => !a.isDeleted)?.length ?? 0;
    return index == (investcationsCount - 1);
  }
  saveDiags() {
    //this.model.patientDiagnosisModel.push(new PatientDiagnosisModel());
    //this.diagOptions = this.diagOptions ?? [];
    //this.diagOptions.push({ model: this.diagosisList });
    this.patientDiagnosisModel = [];
    this.patientDiagnosisModel = this.model.patientDiagnosisModel;
    this.isDiagSelected = !this.isDiagSelected;
  }
  saveTest() {
    this.isTestSelected = !this.isTestSelected;
    this.modalService.dismissAll();
  }
  saveTemplate() {
    this.selectedTemplateObjs = JSON.parse(JSON.stringify(this.selectedTemplateObjsTemp));
    this.selectedTemplateObj = this.selectedTemplateObjs[0];
    this.isTemplateSelected = !this.isTemplateSelected;
    this.templateSelected();
  }
  saveProcedure() {
    this.selectedProcedureObjs = JSON.parse(JSON.stringify(this.selectedProcedureObjsTemp));
    this.selectedProcedureObj = this.selectedProcedureObjs[0];
    this.isProcedureSelected = !this.isProcedureSelected;
    this.procedureSelected();
  }
  doComplaintFilter(filter) {
    this.model.compliants = filter;
    this.complaintsOptions = [];
    this.complaintsOptions = this.complaintsList.filter(a => a.toLowerCase().includes(filter.toLowerCase()));
  }
  doAdviceFilter(filter) {
    this.model.advice = filter;
    this.adviceOptions = [];
    this.adviceOptions = this.adviceList.filter(a => a.toLowerCase().includes(filter.toLowerCase()));
  }
  doMedFilter(filter) {
    if (Number.parseInt(filter)) {
      this.prescriptionOptions = [];
      this.prescriptionList.forEach(element => {
        if (element.id == filter) {
          this.prescriptionOptions.push(element);
          var strength = element.strength == null ? '- ' + element.strength : '';
          var categoryName = element.categoryName == null ? '- ' + element.categoryName : '';
          var units = element.units == null ? '- ' + element.units : '';
          this.selectedMedicine = element.medicineName + categoryName + strength + units;
        }
      });
    }
    else {
      var _filter = filter?.toLocaleLowerCase();
      this.prescriptionOptions = [];
      this.prescriptionList.forEach(element => {
        if (element.medicineName?.toLocaleLowerCase().includes(_filter)) {
          this.prescriptionOptions.push(element)
        }
      });
    }
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
    this.user = this.accountService.currentUserValue;
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
      this.populateProcedureList();
      this.getDoctors();
    }

    this.getAllComplaints();
  }

  printPrescrption() {

    let Pagelink = "about:blank";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.write(this.prepareQRForPrint());
    pwa.document.close();
  }

  prepareQRForPrint() {
    return "<html><head><title>" + document.title + "</title><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' media='all' crossorigin='anonymous'><style type='text/css' media='print'>@media print { @page { size: auto; margin: 0;} body { margin:1.6cm; } }</style><script>function step1(){\n" +
      "setTimeout('step2()', 2);}\n" +
      "function step2(){window.print();window.close()}\n" +
      "</script></head><body onload='step1()'>\n" + document.getElementById("section-to-print").innerHTML + "</body></html>"
  }

  printPreviewQR() {
    let Pagelink = "about:blank";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.open();
    pwa.document.write(this.prepareQRForPrint());
    pwa.document.close();
  }

  downloadFile(input) {
    var fileObj = { "fileName": input.fileName, "filePath": input.filePath }
    this.vitalsReportService.getFile(fileObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        var blob = new Blob([result]);
        let file = input.fileName;
        saveAs(blob, file);
      }, error => {
        console.log("Something went wrong");
      });
  }

  saveVitals() {
    /* this.vitalsModel.patientNewFiles = this.newFiles; */
    this.model.appointment.vitalsReportModel.appointmentID = this.model.appointment.id;;
    this.model.appointment.vitalsReportModel.patientID = this.model.appointment.patientId;
    this.vitalsReportService.post(this.model.appointment.vitalsReportModel)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        console.table(this.model.appointment.vitalsReportModel);
      });
  }

  updateVitals() {
    /* this.model.patientNewFiles = this.newFiles; */
    if (this.model.appointment.vitalsReportModel.appointmentID > 0) {
      this.vitalsReportService.put(this.model.appointment.vitalsReportModel)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          console.table(this.model.appointment.vitalsReportModel);
          this.modalService.dismissAll();
        });
    }
    else {
      this.model.appointment.vitalsReportModel.appointmentID = this.model.appointment.id;;
      this.model.appointment.vitalsReportModel.patientID = this.model.appointment.patientId;
      this.vitalsReportService.post(this.model.appointment.vitalsReportModel)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          console.table(this.model.appointment.vitalsReportModel);
          this.modalService.dismissAll();
        });
    }
  }

  ngOnDestroy(): void {

    this.unsubscribe$.complete();
  }
}
