import { VolunteerHoursData, VolunteerHoursItem } from "~/domain/models/teaching";
import { ID_TEACHING_SERVICE, ID_MESSAGE_SERVICE } from "~/types";
import { IMessageService } from "~/infrastructure/boundaries/message-service";
import { ITeachingService } from "~/domain/boundaries/teaching-service";
import { inject, injectable } from "inversify";

@injectable()
export class VolunteerHoursPresenter {
    constructor(
        @inject(ID_MESSAGE_SERVICE) private readonly messageService: IMessageService,
        @inject(ID_TEACHING_SERVICE) private readonly service: ITeachingService
    ) { }

    public async volunteerHoursInit(): Promise<VolunteerHoursData> {
        let data = {} as VolunteerHoursData;
        data.numName = "";
        data.studentList = await this.service.getStudentItemOptionList();
        data.studentList.unshift({ id: 0, value: "", title: "全部学生" });
        await this.getVolunteerHoursList(data);
        return data;
    }

    public async getVolunteerHoursList(data: VolunteerHoursData): Promise<void> {
        data.dataList = await this.service.getVolunteerHoursList(data.numName);
    }

    public addItem(data: VolunteerHoursData): VolunteerHoursItem {
        let item = {
            volunteerId: 0,
            personId: 0,
            studentNum: "",
            studentName: "",
            className: "",
            activityName: "",
            hours: 0,
            activityDate: "",
            organization: "",
            description: "",
            status: "已完成"
        } as VolunteerHoursItem;
        return item;
    }

    public editItem(data: VolunteerHoursData, index: number): VolunteerHoursItem {
        let item = { ...data.dataList[index] } as VolunteerHoursItem;
        return item;
    }

    public async itemSubmit(item: VolunteerHoursItem, data: VolunteerHoursData): Promise<void> {
        const res = await this.service.volunteerHoursSave(item);
        if (res.code == 0) {
            this.messageService.success("保存成功");
            this.getVolunteerHoursList(data);
        } else {
            this.messageService.error(res.msg);
        }
    }

    async deleteItem(data: VolunteerHoursData, index: number) {
        const result = await this.messageService.confirm("确认删除此志愿活动记录吗?");
        if (!result) {
            return;
        }
        const res = await this.service.volunteerHoursDelete(data.dataList[index].volunteerId);
        if (res.code == 0) {
            this.messageService.success("删除成功");
            data.dataList.splice(index, 1);
        } else {
            this.messageService.error(res.msg);
        }
    };
}

