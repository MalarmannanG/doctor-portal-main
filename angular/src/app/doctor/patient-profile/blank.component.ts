import { COMMA, ENTER } from "@angular/cdk/keycodes";
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

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class BlankComponent implements OnInit {
  docForm: FormGroup;
  hide3 = true;
  step: number = 0;
  isTemplateSelected = false;
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
  selectedInvestigation: any;
  pastHistoryList: PatientProfileModel[] = [];
  selectedprescrptionObj: PrescriptionMasterModel = new PrescriptionMasterModel();
  prescriptionOptions: PrescriptionMasterModel[] = [];
  prescriptionList: PrescriptionMasterModel[] = [];
  complaintsOptions: string[] = [];
  selectedTemplateName: string;
  selectedDiagName: string;
  selectedTestName: string;
  templateLoading = true;
  selectedMedicine = '';
  selectedComplaint = '';
  today = new Date();
  // constructor() {}
  constructor(config: NgbModalConfig, private router: Router,
    private patientProfileService: PatientProfileService,
    private templateMasterService: TemplateMasterService,
    private testMasterSerice: TestMasterService,
    private diagnosisMasterService: DiagnosisMasterService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public vitalsReportService: VitalsReportService) {
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
      this.complaintsList = this.complaintsOptions = res;
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

    // this.diagOptions = this.diagOptions ?? [];
    // this.diagOptions.push({ model: this.diagosisList });
    this.isTestSelected = !this.isTestSelected;
  }

  addMoreDigs() {

    // this.diagOptions = this.diagOptions ?? [];
    // this.diagOptions.push({ model: this.diagosisList });
    this.isDiagSelected = !this.isDiagSelected;
  }

  addMore() {
    this.selectedTemplateObjsTemp = JSON.parse(JSON.stringify(this.selectedTemplateObjs));
    this.isTemplateSelected = !this.isTemplateSelected;
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

  addTemplate(event) {
    if (this.selectedTemplateName) {
      let selectedTemplateObj = this.templateList.filter(a => a.name == this.selectedTemplateName)[0];
      this.selectedTemplateObjsTemp.push(selectedTemplateObj);
      this.templateSelected();
    }
  }
  addDiag(event) {
    if (this.selectedDiagName) {
      let selectedTemplateObj = this.diagosisList.filter(a => a.name == this.selectedDiagName)[0];
      var _patientDiag = new PatientDiagnosisModel();
      _patientDiag.diagnosisMasterName = selectedTemplateObj.name;
      _patientDiag.description = selectedTemplateObj.description;
      _patientDiag.diagnosisMasterId = selectedTemplateObj.id;
      if (this.model.patientDiagnosisModel == null) {
        this.model.patientDiagnosisModel = [];
      }
      this.model.patientDiagnosisModel.push(_patientDiag);
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
    this.model.followUp = this.selectedTemplateObj?.followUp ?? null;
    this.selectedComplaint = this.model.compliants;
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
    this.selectedMedicine  = this.activePrescription.medicineName;
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
    Swal.fire({
      title: "Are you sure to close this appoinment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, close this appoinment!",
      cancelButtonText: "No, Update patient",
    }).then((result) => {

      if (result.value)
        this.model.appointment.isActive = false;
      else
        this.model.appointment.isActive = true;
      this.model.patientDiagnosisModel = this.model?.patientDiagnosisModel?.filter(a => a.id || a.diagnosisMasterName)
      this.patientProfileService.put(this.model)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          //this.router.navigateByUrl('/doctor/dashboard')
        });
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
        this.isDiagSelected = this.model.patientDiagnosisModel?.length > 0;
        this.isDiagSelected = this.model.patientDiagnosisModel?.length > 0;
        this.isTestSelected = this.model.patientTestModel?.length > 0;
        this.populateTestMaster();
        this.populateTemplateList();
        this.populateDiagnosis();
        this.getPastHistories();
        this.populatePrescriptionMaster();
        if (this.model.procedureModel == null)
          this.model.procedureModel = new PatientProcedureModel();

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
    this.isDiagSelected = !this.isDiagSelected;
  }
  saveTest() {
    //this.model.patientDiagnosisModel.push(new PatientDiagnosisModel());
    //this.diagOptions = this.diagOptions ?? [];
    //this.diagOptions.push({ model: this.diagosisList });
    this.isTestSelected = !this.isTestSelected;
    this.modalService.dismissAll();
  }
  saveTemplate() {
    this.selectedTemplateObjs = JSON.parse(JSON.stringify(this.selectedTemplateObjsTemp));
    this.selectedTemplateObj = this.selectedTemplateObjs[0];
    this.isTemplateSelected = !this.isTemplateSelected;
    this.templateSelected();
  }
  doComplaintFilter(filter) {
    this.model.compliants = filter;
    this.complaintsOptions = [];
    this.complaintsOptions = this.complaintsList.filter(a => a.toLowerCase().includes(filter.toLowerCase()));
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
    this.getAllComplaints();
  }

  printPrescrption() {
    // this.router.navigateByUrl(`/doctor/prescription-print/${this.id}`)

    let Pagelink = "about:blank";
    var pwa = window.open(Pagelink, "_new");
    //pwa.document.open();

    pwa.document.write(this.prepareQRForPrint());
    pwa.document.close();

    // var mywindow = window.open('A4', 'PRINT');

    // mywindow.document.write('<html><head><title>' + document.title + '</title>');

    // mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" media="all" crossorigin="anonymous">');
    // mywindow.document.write('<style>@page { size: A4; margin: 0; }</style>');
    // mywindow.document.write('</head><body>');
    // mywindow.document.write('<script> function printing() {  document.getElementById("print-btn").remove(); document.getElementsByTagName("img").remove(); window.print(); window.close(); } </script>');
    // mywindow.document.write(document.getElementById("section-to-print").innerHTML);
    // mywindow.document.write('</body></html>');
    // mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/
    // return true;
  }
  prepareQRForPrint() {
    var ddsf = document.getElementById("section-to-print");

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
