import { ID_ABSENCE_SERVICE, ID_MESSAGE_SERVICE, ID_TEACHER_PRESENTER } from "~/types";
import { IMessageService } from "~/infrastructure/boundaries/message-service";
import { inject, injectable } from "inversify";
import { AbsenceService } from "../boundaries/absence-service";
import { AbsenceData, AbsenceItem } from "~/infrastructure/models/absence";
import { TeacherData } from "../models/person";
import { TeacherPresenter } from "./teacher-presenter";
import { OptionItem } from "~/infrastructure/models/base";
@injectable()
export class AbsencePresenter {
    constructor(
        @inject(ID_TEACHER_PRESENTER) private readonly teacherPrt: TeacherPresenter,
        @inject(ID_MESSAGE_SERVICE) private readonly messageService: IMessageService,
        @inject(ID_ABSENCE_SERVICE) private readonly service: AbsenceService
    ) { }
    // public makeSelectAbsenceList(data: AbsenceData ): void {//这是在新增请假页面下的教师选择框
    //     for (let i = 0; i < data.absenceSelectList.length; i++) {
    //         const item = data_teacher.dataList[i];
    //         data.absenceSelectList.push(
    //             {
    //                 id: item.personId,
    //                 value: item.num,
    //                 title: item.num + '-' + item.name
    //             }
    //         )
    //     }
    // }
    public async absenceInit(): Promise<AbsenceData> {//把返回的值赋给页面里面的data
        let data = {} as AbsenceData;
        data.absenceSelectList = await this.service.getTeacherOptionList();
        await this.getAbsenceList(data);
        console.log(data.dataList);
        return data;
    }
    public async getAbsenceList(data: AbsenceData): Promise<void> {
        data.dataList = await this.service.getAbsenceList(data.numName);//直接改变data里面的值
        console.log("嘿哈嘿哈");
        console.log(data);
    }
    async deleteItem(data: AbsenceData, index: number) {
        const result = await this.messageService.confirm("确认删除这条请假记录吗?");
        console.log(result);
        if (!result) {
            return;
        }
        const res = await this.service.absenceDelete(data.dataList[index].absenceId);
        if (res.code == 0) {
            this.messageService.success("删除成功");
            data.dataList.splice(index, 1);
        } else {
            this.messageService.error(res.msg);
        }
    };
    async absenceSave(data: AbsenceItem) {
        const rep = await this.service.absenceSave(data);
        if (rep.code == 0) {
            this.messageService.success("添加成功");
        }
        else {
            this.messageService.error(rep.msg);
        }
    }
}
