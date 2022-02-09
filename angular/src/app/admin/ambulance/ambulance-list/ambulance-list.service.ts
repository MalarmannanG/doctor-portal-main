import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AmbulanceList } from "./ambulance-list.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class AmbulanceListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/ambulanceList.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<AmbulanceList[]> = new BehaviorSubject<
    AmbulanceList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): AmbulanceList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAmbulanceLists(): void {
    this.subs.sink = this.httpClient
      .get<AmbulanceList[]>(this.API_URL)
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
  addAmbulanceList(ambulanceList: AmbulanceList): void {
    this.dialogData = ambulanceList;

    /*  this.httpClient.post(this.API_URL, ambulanceList).subscribe(data => {
      this.dialogData = ambulanceList;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateAmbulanceList(ambulanceList: AmbulanceList): void {
    this.dialogData = ambulanceList;

    /* this.httpClient.put(this.API_URL + ambulanceList.id, ambulanceList).subscribe(data => {
      this.dialogData = ambulanceList;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteAmbulanceList(id: number): void {
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
