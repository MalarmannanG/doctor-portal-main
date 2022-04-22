import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subject, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { DiagnosisMasterModel, DiagnosisMasterModelList } from "../../diagnosis-master/model/diagnosis-master.model.service";
import { DiagnosisMasterService } from "../../diagnosis-master/service/diagnosis-master.service";
import { TemplateMasterModel } from "../../template-master/model/template-master.model.service";
import { TemplateMasterService } from "../../template-master/service/template-master.service";
import { TestMasterModel } from "../../test-master/model/test-master.model.service";
import { TestMasterService } from "../../test-master/service/test-master.service";
import { PatientDiagnosisModel, PatientProfileModel, PatientTestModel, PrescriptionMasterModel, PrescriptionModel } from "../model/patient-profile.model.service";
import { PatientProfileService } from "../service/patient-profile.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VitalsReportService } from "src/app/admin/dashboard/service/vitals.service";
import { saveAs } from 'file-saver';
import { PatientProcedureModel } from "src/app/admin/patients/model/procedureModel";
import { ProcedureMasterModel } from "src/shared/service-proxies/service-proxies";
import { ProcedureMasterService } from "../../procedure-master/service/procedure-master.service";
import { DoctorService } from "src/app/admin/doctors/service/doctor.service";
import { AccountService } from "src/app/authentication/service/auth.service";

@Component({
  selector: "app-view-patient-profile",
  templateUrl: "./view-patient-profile.component.html",
  styleUrls: ["./view-patient-profile.component.scss"],
	providers: [NgbModalConfig, NgbModal]
})

export class ViewPatientProfileComponent implements OnInit, OnDestroy {
  docForm: FormGroup;
  hide3 = true;
  step: number = 0;
  isTemplateSelected = false;
  isDiagSelected = false;
  isTestSelected = true;
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
  doctorOption: any;
  user: any = {};
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
 
  onSelectionChanged(event, obj: PatientTestModel) {
    if (event.option.value) {
      obj.testMasterId = this.testMaster.filter(a => a.name == event.option.value)[0].id;
    }
  }
   
   
  templateSelected() {
    this.model.templateMasterId = this.selectedTemplateObj?.id;
    this.model.compliants = this.selectedTemplateObj?.compliants ?? "";
    this.model.examination = this.selectedTemplateObj?.examination ?? "";
    this.model.impression = this.selectedTemplateObj?.impression ?? "";
    this.model.plan = this.selectedTemplateObj?.plan ?? "";
    this.model.advice = this.selectedTemplateObj?.advice ?? "";
    this.model.followUp = this.selectedTemplateObj?.followUp ?? null;
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
    this.model.procedureModel.name = this.selectedProcedureObj?.procedurename ?? "";

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
            this.procedureSelected();
          
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
    let appointmentDate = moment(this.model.appointment.appointmentDateTime).format('YYYY-MM-DD');
    let query = `?patientId=${this.model.patientId}&appointmentDate=${appointmentDate}`
    this.patientProfileService.GetAllInActive(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.pastHistoryList = resp?.filter(a => a.appointmentId != this.model.appointmentId);
        this.pastHistoryList.forEach(function(item){
            item.appointment.isOpened = false;
        })
      });
  }
 

  get() {
    this.patientProfileService.get(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.model = resp;
        this.populateTemplateList();
        this.populatePrescriptionMaster();
        this.populateProcedureList();
        this.getDoctors();
      });
  }

  openModel(content) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
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
  ngOnDestroy(): void {

    this.unsubscribe$.complete();
  }
}
