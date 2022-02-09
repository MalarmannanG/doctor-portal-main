import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ItemStockList } from "./item-stock-list.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
@Injectable()
export class ItemStockListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "assets/data/itemStockList.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<ItemStockList[]> = new BehaviorSubject<
    ItemStockList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): ItemStockList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllItemStockLists(): void {
    this.subs.sink = this.httpClient
      .get<ItemStockList[]>(this.API_URL)
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
  addItemStockList(itemStockList: ItemStockList): void {
    this.dialogData = itemStockList;

    /*  this.httpClient.post(this.API_URL, itemStockList).subscribe(data => {
      this.dialogData = itemStockList;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateItemStockList(itemStockList: ItemStockList): void {
    this.dialogData = itemStockList;

    /* this.httpClient.put(this.API_URL + itemStockList.id, itemStockList).subscribe(data => {
      this.dialogData = itemStockList;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteItemStockList(id: number): void {
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
