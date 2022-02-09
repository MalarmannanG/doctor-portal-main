import { formatDate } from "@angular/common";
export class IssuedItems {
  id: number;
  i_name: string;
  category: string;
  issue_date: string;
  return_date: string;
  issue_to: string;
  qty: string;
  status: string;
  constructor(issuedItems) {
    {
      this.id = issuedItems.id || this.getRandomID();
      this.i_name = issuedItems.i_name || "";
      this.category = issuedItems.category || "";
      this.issue_date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.return_date = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
      this.issue_to = issuedItems.issue_to || "";
      this.qty = issuedItems.qty || "";
      this.status = issuedItems.status || "Issued";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
