
export class TemplateMasterModel {
    constructor() {
        this.templatePrescriptionModel = [];
    }
    id: number;
    name: string;
    description: string;
    compliants: string;
    examination: string;
    impression: string;
    advice: string;
    plan: string;
    followUp: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
    templatePrescriptionModel: TemplatePrescriptionModel[];
}

export class TemplatePrescriptionModel {
    id: number;
    templateMasterId: number;
    genericName: string;
    medicineName: string;
    categoryName : string;
    strength: string;
    units: string;
    remarks: string;
    beforeFood: boolean;
    morning: boolean;
    noon: boolean;
    night: boolean;
    description: string;
    noOfDays: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
     
}