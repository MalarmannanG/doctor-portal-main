
export class DiagnosisMasterModel {
    id: number;
    name: string;
    description: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
}

export class DiagnosisMasterModelList {
    constructor() {
        this.model = [];
    }
    model: DiagnosisMasterModel[];
}