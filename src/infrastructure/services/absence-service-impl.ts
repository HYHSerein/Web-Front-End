import { AbsenceService } from "~/domain/boundaries/absence-service";
import { IRequestService } from "../boundaries/request-service";
import { ID_REQUEST_SERVICE } from "~/types";
import { inject, injectable } from "inversify";
import { AbsenceItem } from "../models/absence";
import { DataResponse } from "../models/request";
import { OptionItem } from "../models/base";
@injectable()
export class absenceServiceImpl implements AbsenceService {
  constructor(
    @inject(ID_REQUEST_SERVICE) private readonly requestService: IRequestService
  ) { }
  public async getAbsenceList(numName: string | null): Promise<AbsenceItem[]> {
    const res = await this.requestService.generalRequest("/api/absence/getAbsenceList", numName)
    return res.data as AbsenceItem[];
  }
  public async getTeacherOptionList(): Promise<OptionItem[]> {
    const res = await this.requestService.generalRequest("/api/absence/getTeacherItemOptionList", null);
    return res.itemList as OptionItem[];
  }
  public async absenceDelete(absenceId: number): Promise<DataResponse> {
    const res = await this.requestService.generalRequest("/api/absence/absenceDelete", {
      absenceId: absenceId,
    });
    return res as DataResponse;
  }
  public async absenceSave(data: AbsenceItem): Promise<DataResponse> {
    const res = await this.requestService.generalRequest("/api/absence/absenceSave", data);
    return res as DataResponse;
  }
}