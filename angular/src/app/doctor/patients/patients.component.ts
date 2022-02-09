import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { PrescriptionList } from "../model/prescription.model";


export class DiagModel {
  diagnosis: string;
  description: string;
}

export class SurgeryModel {
  surgery: string;
  description: string;
}

export class DrugAalergyModel {
  surgery: string;
  description: string;
}

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
})

export class PatientsComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  templateCtrl = new FormControl();
  filteredTemplate: Observable<string[]>;
  templates: string[] = ['Kidney Stone'];
  allTemplate: string[] = ['Abdominal Pain', 'UTI', 'Urinary Incontinence', 'BPH'];
  step = 0;

  @ViewChild('templateInput') templateInput: ElementRef<HTMLInputElement>;
  @ViewChild('lastElement') lastElement: ElementRef<HTMLInputElement>;

  diagList: DiagModel[] = [];
  surgeryList: SurgeryModel[] = [];
  drugList: DrugAalergyModel[] = [];
  inestigationList: DrugAalergyModel[] = [];
  prescriptionList: PrescriptionList[] = [];
  closeResult = '';
  isTemplateSelected: boolean = false;
  tomorrow = new Date();
  newMed: boolean = false;
  defaultValue = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.size = 'lg';
    config.scrollable = true
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.setFilterValue();
  }

  setFilterValue() {
    this.filteredTemplate = this.templateCtrl.valueChanges.pipe(
      startWith(null),
      map((template: string | null) => (template ? this._filter(template) : this.allTemplate.slice())),
    );
  }

  addDiag() {
    this.diagList.push(new DiagModel());
    setTimeout(() => this.focusInput(this.lastElement), 300);
  }

  focusInput(element: ElementRef) {
    element.nativeElement.focus();
  }

  removeDiag() {
    this.diagList.pop();
    setTimeout(() => this.focusInput(this.lastElement), 300);
  }

  addSurgery() {
    this.surgeryList.push(new SurgeryModel());
  }

  removeSurgery() {
    this.surgeryList.pop()
  }

  addDrug() {
    this.drugList.push(new DrugAalergyModel());
  }

  removeDrug() {
    this.drugList.pop()
  }

  addInestigation() {
    this.inestigationList.push(new DrugAalergyModel());
  }

  removeInestigation() {
    this.inestigationList.pop()
  }

  addPrescription() {
    this.prescriptionList.push(new PrescriptionList());
    this.newMed = false;
  }

  addMed() {
    this.newMed = true;
  }

  removePrescription() {
    this.prescriptionList.pop()
  }

  openModel(content) {
    this.modalService.open(content);
  }

  onSaveDiagnosis() {
    this.step = 1;
    window.scroll(0, 0);
  }


  addTemplate(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.templates.push(value);
    }
    event.chipInput!.clear();

    this.templateCtrl.setValue(null);
  }

  removeTemplate(template: string): void {
    const index = this.templates.indexOf(template);
    this.allTemplate.push(template);
    this.setFilterValue();
    if (index >= 0) {
      this.templates.splice(index, 1);
    }
  }

  selectedTemplate(event: MatAutocompleteSelectedEvent): void {
    this.templates.push(event.option.viewValue);
    this.allTemplate = this.allTemplate.filter(template => template !== event.option.viewValue)
    this.templateInput.nativeElement.value = '';
    this.templateCtrl.setValue(null);
  }

  changeTemplate() {
    this.isTemplateSelected = !this.isTemplateSelected;
  }

  SaveTemplate() {

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTemplate.filter(template => template.toLowerCase().includes(filterValue));
  }



  ngOnInit(): void {
    this.diagList.push(new DiagModel());
    this.surgeryList.push(new SurgeryModel());
    this.drugList.push(new DrugAalergyModel());
    this.inestigationList.push(new DrugAalergyModel());
    this.prescriptionList.push(new PrescriptionList());
  }
}