import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable, Subject, takeUntil } from "rxjs";
import { map } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { Router } from "@angular/router";
import { BaseQueryModel } from "src/app/model/base.query-model";
import { TemplateMasterService } from "../service/template-master.service";
import { TemplateMasterModel } from "../../../shared/service-proxies/service-proxies";
//import { TemplateMasterModel } from "../model/template-master.model.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-all-template-master",
  templateUrl: "./all-template-master.component.html",
  styleUrls: ["./all-template-master.component.sass"],
})
export class AllTemplateMasterComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy {
  displayedColumns = [
    "name",
    "compliants",
    "examination",
    "impression",
    "advice",
    "plan",
    "actions"
  ];
  index: number;
  id: number;
  model: TemplateMasterModel[] = [];
  unsubscribe$ = new Subject();
  isTblLoading = false;
  searchTemplate: string;
  queryModel = new BaseQueryModel();
  totalCount = 0;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private templateMasterService: TemplateMasterService,
    private snackBar: MatSnackBar,
    private router: Router,
    //private _service: TemplateMasterController
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    // this.loadData();
    this.getAll()
  }
  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
  refresh() {
    //this.loadData();
    this.getAll()
  }

  getAll() {
    // this.sort;
    // this._service.getAll(this.searchTemplate, "", this.queryModel.skip, this.queryModel.take).subscribe(res => {
    //   this.model = res.items;
    //   this.totalCount = res.totalCount;
    // })
    let query = "";
    if (this.searchTemplate) {
      query = `?name=${this.searchTemplate}`
    }

    query = query ? `${query}&` : "?";
    query = `${query}skip=${this.queryModel.skip}&take=${this.queryModel.take}`;
    this.isTblLoading = true;
    this.templateMasterService.getAll(query)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.isTblLoading = false;
        this.model = resp.result;
        this.totalCount = resp.total;
      });
  }
  paginate(event) {
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    this.queryModel.skip = pageIndex * pageSize;
    this.queryModel.take = pageSize;
    this.getAll();
  }

  addNew() {
    this.router.navigateByUrl('/doctor/add-template');
  }
  editCall(id) {
    this.router.navigateByUrl(`/doctor/edit-template/${id}`)
  }
  deleteItem(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.templateMasterService.delete(id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((resp) => {
            this.refreshTable();
            this.showNotification(
              "snackbar-danger",
              "Delete Record Successfully...!!!",
              "bottom",
              "center"
            );
          });
      }
    });
  }
  private refreshTable() {
    this.getAll();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

  }
  removeSelectedRows() {

  }
  public loadData() {

  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}

