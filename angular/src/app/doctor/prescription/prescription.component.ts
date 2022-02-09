import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrescriptionList } from '../model/prescription.model';
import { TemplatePrescriptionModel } from '../template-master/model/template-master.model.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {

  @Input() medList: TemplatePrescriptionModel[];
  @Input() readyOnly: boolean = false;
  @Output() editMode = new EventEmitter<any>();

  constructor() { }

  removeMed(index: number) {
    this.medList.filter((data, i) => i == index)[0].isDeleted = true;
  }

  edit(index: number) {    
    let data = this.medList.filter((data, i) => i == index)[0];
    this.editMode.emit(data);
  }

  ngOnInit(): void {
  }

}