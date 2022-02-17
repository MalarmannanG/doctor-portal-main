import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PatientService } from "./patient.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Patient } from "./patient.model";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormDialogComponent } from "./dialog/form-dialog/form-dialog.component";
import { DeleteComponent } from "./dialog/delete/delete.component";
import { BehaviorSubject, fromEvent, merge, Observable, Subject, takeUntil } from "rxjs";
import { map } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { PatientModel } from "../model/patient.model";
import { PatientMasterService } from "../service/patient.service";
import { Router } from "@angular/router";
import { BaseQueryModel } from "src/app/model/base.query-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-allpatients",
  templateUrl: "./allpatients.component.html",
  styleUrls: ["./allpatients.component.sass"],
})
export class AllpatientsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy {
  displayedColumns = [
    "patientName",
    "age",
    "gender",
    "address",
    "mobile",
    "referedByName",
    "actions"
  ];
  exampleDatabase: PatientService | null;
  dataSource: ExampleDataSource | null;
  selection = new SelectionModel<Patient>(true, []);
  index: number;
  id: number;
  patient: Patient | null;
  unsubscribe$ = new Subject();
  isTblLoading = false;
  model: PatientModel[] = [];
  searchPatient: string;
  queryModel = new BaseQueryModel();
  totalCount = 0;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public patientService: PatientService,
    private snackBar: MatSnackBar,
    private router: Router,
    private patientsService: PatientMasterService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
  ngOnInit() {
    //this.loadData();
    this.getAll();
  }
  refresh() {
    //this.loadData();
    this.getAll();
  }


  getAll() {
    this.isTblLoading = true;
    let query = "";
    if (this.searchPatient) {
      query = `?name=${this.searchPatient}`
    }

    query = query ? `${query}&` : "?";
    query = `${query}skip=${this.queryModel.skip}&take=${this.queryModel.take}`;
    this.patientsService.getAll(query)
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
    this.router.navigateByUrl('/admin/patients/add-patient');
  }
  editCall(id) {
    this.router.navigateByUrl('/admin/patients/edit-patient/' + id)
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
        this.patientsService.delete(id)
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
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<Patient>(true, []);
    });
    this.showNotification(
      "snackbar-danger",
      totalSelect + " Record Delete Successfully...!!!",
      "bottom",
      "center"
    );
  }
  public loadData() {
    this.exampleDatabase = new PatientService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
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
export class ExampleDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Patient[] = [];
  renderedData: Patient[] = [];
  constructor(
    public exampleDatabase: PatientService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Patient[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllPatients();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((patient: Patient) => {
            const searchStr = (
              patient.name +
              patient.gender +
              patient.address +
              patient.date +
              patient.bGroup +
              patient.treatment +
              patient.mobile
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: Patient[]): Patient[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";
      switch (this._sort.active) {
        case "id":
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case "name":
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case "gender":
          [propertyA, propertyB] = [a.gender, b.gender];
          break;
        case "date":
          [propertyA, propertyB] = [a.date, b.date];
          break;
        case "address":
          [propertyA, propertyB] = [a.address, b.address];
          break;
        case "mobile":
          [propertyA, propertyB] = [a.mobile, b.mobile];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}
