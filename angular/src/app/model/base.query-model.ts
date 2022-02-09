
export class BaseQueryModel {

    constructor() {
        this.skip = 0;
        this.take = 10;
    }

    skip: number;
    take: number;
    order_by: string;
}