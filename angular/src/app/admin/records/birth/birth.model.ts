import { formatDate } from "@angular/common";
export class Birth {
  id: number;
  case_no: string;
  child_name: string;
  gender: string;
  birth_date: string;
  mother_name: string;
  father_name: string;
  mobile: string;
  address: string;
  note: string;
  constructor(birth) {
    {
      this.id = birth.id || this.getRandomID();
      this.case_no = birth.case_no || "";
      this.child_name = birth.child_name || "";
      this.gender = birth.gender || "Male";
      this.birth_date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.mother_name = birth.mother_name || "";
      this.father_name = birth.father_name || "";
      this.mobile = birth.mobile || "";
      this.address = birth.address || "";
      this.note = birth.note || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
