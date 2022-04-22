
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
    patientProfileId : number
    templateMasterId: number;
    medicineName: string;
    genericName: string;
    categoryName : string;
    strength: string;
    units: string;
    remarks: string;
    beforeFood: boolean;
    morning: boolean;
    noon: boolean;
    night: boolean;
    noOfDays: number;
    isDeleted: boolean;
    sos: boolean;
    stat: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
     
}