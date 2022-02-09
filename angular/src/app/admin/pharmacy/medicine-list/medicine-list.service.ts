import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MedicineList } from "./medicine-list.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class MedicineListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/medicineList.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<MedicineList[]> = new BehaviorSubject<
    MedicineList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): MedicineList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllMedicineLists(): void {
    this.subs.sink = this.httpClient
      .get<MedicineList[]>(this.API_URL)
      .subscribe(
        (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + " " + error.message);
        }
      );
  }
  addMedicineList(medicineList: MedicineList): void {
    this.dialogData = medicineList;

    /*  this.httpClient.post(this.API_URL, medicineList).subscribe(data => {
      this.dialogData = medicineList;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateMedicineList(medicineList: MedicineList): void {
    this.dialogData = medicineList;

    /* this.httpClient.put(this.API_URL + medicineList.id, medicineList).subscribe(data => {
      this.dialogData = medicineList;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteMedicineList(id: number): void {
    console.log(id);

    /*  this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(id);
      },
      (err: HttpErrorResponse) => {
         // error code here
      }
    );*/
  }
}
