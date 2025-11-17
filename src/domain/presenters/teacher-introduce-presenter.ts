import { TeacherIntroduceData } from "~/domain/models/info";
import { TeacherItem } from "~/domain/models/person";
import { ID_INFO_SERVICE, ID_MESSAGE_SERVICE } from "~/types";
import { IMessageService } from "~/infrastructure/boundaries/message-service";
import { IInfoService } from "~/domain/boundaries/info-service";
import { inject, injectable } from "inversify";
@injectable()
export class TeacherIntroducePresenter {
    constructor(
        @inject(ID_MESSAGE_SERVICE) private readonly messageService: IMessageService,
        @inject(ID_INFO_SERVICE) private readonly service: IInfoService
    ) { }
    public async teacherIntroduceInit(data: TeacherIntroduceData): Promise<void> {
        let res = await this.service.getTeacherIntroduceData(data.personId);
        if (res.code == 0) {
            data.info = res.data.info;
            data.personId = data.info.personId;
            res = await this.service.getPhotoImageStr(data.info.personId);
            data.imgStr = res.data;
        }
    }
}