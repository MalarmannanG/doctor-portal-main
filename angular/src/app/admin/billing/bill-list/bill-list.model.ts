export class BillList {
  id: number;
  img: string;
  pName: string;
  admissionID: string;
  dName: string;
  status: string;
  tax: string;
  date: string;
  discount: string;
  total: string;
  constructor(billList) {
    {
      this.id = billList.id || this.getRandomID();
      this.img = billList.img || "";
      this.pName = billList.pName || "";
      this.admissionID = billList.admissionID || "";
      this.dName = billList.dName || "";
      this.status = billList.status || "";
      this.tax = billList.tax || "";
      this.date = billList.date || "";
      this.discount = billList.discount || "";
      this.total = billList.total || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
