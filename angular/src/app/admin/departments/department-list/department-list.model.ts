import { formatDate } from "@angular/common";
export class DepartmentList {
  id: number;
  d_no: string;
  d_name: string;
  description: string;
  d_date: string;
  d_head: string;
  status: string;
  constructor(departmentList) {
    {
      this.id = departmentList.id || this.getRandomID();
      this.d_no = departmentList.d_no || "";
      this.d_name = departmentList.d_name || "";
      this.description = departmentList.description || "";
      this.d_date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.d_head = departmentList.d_head || "";
      this.status = departmentList.status || "Active";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
