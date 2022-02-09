import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { PatientProfileModel, PrescriptionModel } from "../patient-profile/model/patient-profile.model.service";
import { PatientProfileService } from "../patient-profile/service/patient-profile.service";

@Component({
  selector: "app-prescription-print",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.sass"],
})
export class SettingsComponent implements OnInit, OnDestroy {  
  id: any;
  model = new PatientProfileModel();
  unsubscribe$ = new Subject();
  constructor(private activatedRoute: ActivatedRoute, private patientProfileService: PatientProfileService) {

  }

  get() {
    this.patientProfileService.get(this.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((resp) => {
      this.model = resp; 
            
    });
  }

  printPrescrption() {
    

    var mywindow = window.open('A4', 'PRINT', 'height=400,width=1200');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    
    mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" media="all" crossorigin="anonymous">');
    mywindow.document.write('</head><body style="padding: 25px">');    
    
    mywindow.document.write(document.getElementById("section-to-print").innerHTML);
    mywindow.document.write('</body></html>');

     mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
    return true;
  }

  ngOnInit(): void {
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
