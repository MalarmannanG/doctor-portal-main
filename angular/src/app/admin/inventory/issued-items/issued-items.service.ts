import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IssuedItems } from "./issued-items.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class IssuedItemsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/issuedItems.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<IssuedItems[]> = new BehaviorSubject<
    IssuedItems[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): IssuedItems[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllIssuedItemss(): void {
    this.subs.sink = this.httpClient.get<IssuedItems[]>(this.API_URL).subscribe(
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
  addIssuedItems(issuedItems: IssuedItems): void {
    this.dialogData = issuedItems;

    /*  this.httpClient.post(this.API_URL, issuedItems).subscribe(data => {
      this.dialogData = issuedItems;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateIssuedItems(issuedItems: IssuedItems): void {
    this.dialogData = issuedItems;

    /* this.httpClient.put(this.API_URL + issuedItems.id, issuedItems).subscribe(data => {
      this.dialogData = issuedItems;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteIssuedItems(id: number): void {
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
