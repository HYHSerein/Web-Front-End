import { DataResponse } from "~/infrastructure/models/request";
import { OptionItem } from "~/infrastructure/models/base";
import { AbsenceItem } from "~/infrastructure/models/absence";
export interface AbsenceService{
    getAbsenceList(numName: string | null): Promise<AbsenceItem[]>;
    absenceDelete(absenceId: number): Promise<DataResponse>;
    absenceSave(data: AbsenceItem): Promise<DataResponse>;
    getTeacherOptionList(): Promise<OptionItem[]>;
    setResult(result:string,absenceId:number):Promise<DataResponse>;
}