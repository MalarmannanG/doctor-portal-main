import { AppoinemtModel } from "src/app/admin/appointment/model/appointmentt.model";
import { PatientModel } from "src/app/admin/patients/model/patient.model";
import { PatientProcedureModel } from "src/app/admin/patients/model/procedureModel";

export class PatientProfileModel {
    constructor() {
        this.prescriptionModel = [];
        this.patientDiagnosisModel = [];
        this.patientTestModel = [];
    }
    id: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    templateMasterId?: number;
    description: string;
    compliants: string;
    examination: string;
    pastHistory : string;
    investigationResults: string;
    impression: string;
    advice: string;
    plan: string;
    isfollowUpNeed : boolean;
    followUp: any;
    isDeleted: boolean;
    sos: boolean;
    stat: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
    prescriptionModel: PrescriptionModel[];
    patientModel: PatientModel;
    procedureModel: PatientProcedureModel;
    appointment: AppoinemtModel;
    patientDiagnosisModel: PatientDiagnosisModel[];
    patientTestModel: PatientTestModel[];
 
}

export class PrescriptionModel {
    constructor() {
        this.beforeFood = true;
    }

    id: number;
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
    noOfDays: string;
    isDeleted: boolean;
    sos: boolean;
    stat: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
    
}

export class PatientDiagnosisModel {
    constructor() {
        this.isDeleted = false;
    }
    id: number;
    patientProfileId: number;
    diagnosisMasterId: number;
    diagnosisMasterName: string;
    description: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
}

export class PatientTestModel {
    id: number;
    patientProfileId: number;
    testMasterId: number;
    testMasterName: string;
    remarks: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
}

export class PrescriptionMasterQueryModel {
    skip: number;
    take: number;
    name: string;
}

export class PrescriptionMasterModel {
    constructor() {
        
    }

    id: number;
    genericName: string;
    medicineName: string;
    categoryName: string;
    strength: string;
    units: string;
    remarks: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
}
