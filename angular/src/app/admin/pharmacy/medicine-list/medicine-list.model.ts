import { formatDate } from "@angular/common";
export class MedicineList {
  id: number;
  m_no: string;
  m_name: string;
  category: string;
  company: string;
  p_date: string;
  price: string;
  e_date: string;
  stock: string;
  constructor(medicineList) {
    {
      this.id = medicineList.id || this.getRandomID();
      this.m_no = medicineList.m_no || "";
      this.m_name = medicineList.m_name || "";
      this.category = medicineList.category || "";
      this.company = medicineList.company || "";
      this.p_date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.price = medicineList.price || "";
      this.e_date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.stock = medicineList.stock || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
