import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Birth } from "./birth.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class BirthService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/birth.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<Birth[]> = new BehaviorSubject<Birth[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Birth[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllBirths(): void {
    this.subs.sink = this.httpClient.get<Birth[]>(this.API_URL).subscribe(
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
  addBirth(birth: Birth): void {
    this.dialogData = birth;

    /*  this.httpClient.post(this.API_URL, birth).subscribe(data => {
      this.dialogData = birth;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateBirth(birth: Birth): void {
    this.dialogData = birth;

    /* this.httpClient.put(this.API_URL + birth.id, birth).subscribe(data => {
      this.dialogData = birth;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteBirth(id: number): void {
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
