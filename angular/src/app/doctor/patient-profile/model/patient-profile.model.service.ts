import { AppoinemtModel } from "src/app/admin/appointment/model/appointmentt.model";
import { PatientModel } from "src/app/admin/patients/model/patient.model";

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
    impression: string;
    advice: string;
    plan: string;
    followUp: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
    prescriptionModel: PrescriptionModel[];
    patientModel: PatientModel;
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
    medicinName: string;
    genericName: string;
    strength: string;
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
    medicinName: string;
    strength: string;
    units: string;
    isDeleted: boolean;
    createdBy: number;
    modifiedBy: number;
    createdDate: any;
    modifiedDate: any;
}
