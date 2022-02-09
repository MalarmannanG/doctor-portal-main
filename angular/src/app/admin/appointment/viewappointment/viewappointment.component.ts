import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AppointmentService } from "./appointment.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Appointment } from "./appointment.model";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable, Subject, takeUntil } from "rxjs";
import { map } from "rxjs/operators";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./dialogs/delete/delete.component";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { AppoinemtModel } from "../model/appointmentt.model";
import { AppoinementsService } from "../service/Appointmentt.service";
import { BookappointmentComponent } from "../bookappointment/bookappointment.component";
import { Router } from "@angular/router";
import { BaseQueryModel } from "src/app/model/base.query-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-viewappointment",
  templateUrl: "./viewappointment.component.html",
  styleUrls: ["./viewappointment.component.sass"],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class ViewappointmentComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    "patientName",
    "consultingDoctorname",
    "visitType",
    "description",
    "timeOfAppintment",
    "actions",
  ];
  exampleDatabase: AppointmentService | null;
  dataSource: ExampleDataSource | null;
  selection = new SelectionModel<Appointment>(true, []);
  index: number;
  id: number;
  unsubscribe$ = new Subject();
  model: AppoinemtModel[]= [];
  isTblLoading = false;
  searchPatient: string;
  queryModel = new BaseQueryModel();
  totalCount = 0;

  appointment: Appointment | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public appointmentService: AppointmentService,
    public appoinementsService: AppoinementsService,
    private router: Router,
    private snackBar: MatSnackBar
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
    let query = "";
    if(this.searchPatient) {
      query = `?patientName=${this.searchPatient}`
    }
    query = query ? `${query}&` : "?";
    query = `${query}skip=${this.queryModel.skip}&take=${this.queryModel.take}`;
    this.isTblLoading = true;
    this.appoinementsService.getAll(query)
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
      this.selection = new SelectionModel<Appointment>(true, []);
    });
    this.showNotification(
      "snackbar-danger",
      totalSelect + " Record Delete Successfully...!!!",
      "bottom",
      "center"
    );
  }
  
  addNew() {
    this.router.navigateByUrl(`/admin/appointment/bookAppointment`)
  }

  editCall(row) {
    this.id = row.id;
    this.router.navigateByUrl(`/admin/appointment/editAppointment/${this.id}`)
  }
  
  deleteItem(row) {    
    this.id = row.id;

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
        this.appoinementsService.delete(this.id)
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
  public loadData() {
    this.exampleDatabase = new AppointmentService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
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
export class ExampleDataSource extends DataSource<Appointment> {
  filterChange = new BehaviorSubject("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Appointment[] = [];
  renderedData: Appointment[] = [];
  constructor(
    public exampleDatabase: AppointmentService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Appointment[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllAppointments();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((appointment: Appointment) => {
            const searchStr = (
              appointment.name +
              appointment.email +
              appointment.gender +
              appointment.date +
              appointment.doctor +
              appointment.injury +
              appointment.mobile
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
  disconnect() {}
  /** Returns a sorted copy of the database data. */
  sortData(data: Appointment[]): Appointment[] {
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
        case "email":
          [propertyA, propertyB] = [a.email, b.email];
          break;
        // case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
        case "time":
          [propertyA, propertyB] = [a.time, b.time];
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
