import { formatDate } from "@angular/common";
export class AmbulanceCallList {
  id: number;
  case_no: string;
  patient_name: string;
  gender: string;
  date: string;
  vehicle_no: string;
  driver_name: string;
  driver_no: string;
  patient_address: string;
  note: string;
  constructor(ambulanceCallList) {
    {
      this.id = ambulanceCallList.id || this.getRandomID();
      this.case_no = ambulanceCallList.case_no || "";
      this.patient_name = ambulanceCallList.patient_name || "";
      this.gender = ambulanceCallList.gender || "Male";
      this.date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.vehicle_no = ambulanceCallList.vehicle_no || "";
      this.driver_name = ambulanceCallList.driver_name || "";
      this.driver_no = ambulanceCallList.driver_no || "";
      this.patient_address = ambulanceCallList.patient_address || "";
      this.note = ambulanceCallList.note || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
