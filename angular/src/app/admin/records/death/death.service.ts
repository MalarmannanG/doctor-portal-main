import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Death } from "./death.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class DeathService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/death.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<Death[]> = new BehaviorSubject<Death[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Death[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllDeaths(): void {
    this.subs.sink = this.httpClient.get<Death[]>(this.API_URL).subscribe(
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
  addDeath(death: Death): void {
    this.dialogData = death;

    /*  this.httpClient.post(this.API_URL, death).subscribe(data => {
      this.dialogData = death;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateDeath(death: Death): void {
    this.dialogData = death;

    /* this.httpClient.put(this.API_URL + death.id, death).subscribe(data => {
      this.dialogData = death;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteDeath(id: number): void {
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
