import { CourseSectionData, CourseSectionItem } from "~/domain/models/teaching";
import { ID_TEACHING_SERVICE, ID_MESSAGE_SERVICE } from "~/types";
import { IMessageService } from "~/infrastructure/boundaries/message-service";
import { ITeachingService } from "~/domain/boundaries/teaching-service";
import { inject, injectable } from "inversify";
@injectable()
export class CourseSectionPresenter {
    constructor(
        @inject(ID_MESSAGE_SERVICE) private readonly messageService: IMessageService,
        @inject(ID_TEACHING_SERVICE) private readonly service: ITeachingService
    ) { }
    public makeSelectCourseSectionList(data: CourseSectionData): void {
        data.courseSectionSelectList = []
        for (let i = 0; i < data.dataList.length; i++) {
            const item = data.dataList[i]
            data.courseSectionSelectList.push({
                id: item.courseSectionId,
                value: item.num,
                title: item.num + '-' + item.teacherName
            })
        }
    };
    public async courseSectionInit(): Promise<CourseSectionData> {
        // console.log("1111");
        let data = {} as CourseSectionData;
        data.num = "";
        data.teacherSelectList = await this.service.getTeacherItemOptionList();
        data.courseSelectList = await this.service.getCourseItemOptionList();
        data.timeSelectList = await this.service.getTimeItemOptionList();
        // console.log("2222", data.teacherSelectList);
        // console.log("2222", data.courseSelectList);
        await this.getCourseSectionList(data);
        return data;
    }
    public async getCourseSectionList(data: CourseSectionData): Promise<void> {
        data.dataList = await this.service.getCourseSectionList(data.num);
        this.makeSelectCourseSectionList(data);
    }
    public addItem(data: CourseSectionData): CourseSectionItem {
        let item = {} as CourseSectionItem;
        data.currentIndex = -1;
        return item;
    }
    public editItem(data: CourseSectionData, index: number): CourseSectionItem {
        let item = { ...data.dataList[index] } as CourseSectionItem;
        return item;
    }
    public async itemSubmit(item: CourseSectionItem, data: CourseSectionData): Promise<void> {
        if ((item.num || "").trim() === "") {
            this.messageService.error("课序号不能为空");
        }
        if (item.courseId == null) {
            this.messageService.error("必须选择课程！");
        }
        const res = await this.service.courseSectionSave(item);
        if (res.code == 0) {
            this.messageService.success("添加修改成功");
            this.getCourseSectionList(data);
        }
    }
    async deleteItem(data: CourseSectionData, index: number) {
        const result = await this.messageService.confirm("确认删除课程吗?");
        if (!result) {
            return;
        }
        const res = await this.service.courseSectionDelete(data.dataList[index].courseSectionId);
        if (res.code == 0) {
            this.messageService.success("删除成功");
            data.dataList.splice(index, 1);
        } else {
            this.messageService.error(res.msg);
        }
    };

    async publishItem(data: CourseSectionData, index: number) {
        const result = await this.messageService.confirm("确认发布该课程段的选课吗?");
        if (!result) {
            return;
        }
        const currentItem = data.dataList[index];
        const res = await this.service.courseSectionPublish(data.dataList[index].num);
        if (res.code == 0) {
            this.messageService.success("发布成功");
            data.dataList[index] = {
                ...currentItem,
                optional: !currentItem.optional // 只修改这一个字段，其他字段不变
            };
        } else {
            this.messageService.error(res.msg);
        }
    }

    async selectItem(data: CourseSectionData, index: number) {
        const result = await this.messageService.confirm("确认选择该课程吗?");
        if (!result) {
            return;
        }
        console.log(data.dataList[index].courseSectionId, data.dataList[index].teacherId);
        const res = await this.service.courseSectionSelect(data.dataList[index].courseSectionId);
        const currentItem = data.dataList[index];
        if (res.code == 0) {
            this.messageService.success("选择成功");
            data.dataList[index] = {
                ...currentItem,
                status: true // 只修改这一个字段，其他字段不变
            };
        } else {
            this.messageService.error(res.msg);
        }
    }
    async unselectItem(data: CourseSectionData, index: number) {
        const result = await this.messageService.confirm("确认退选该课程吗?");
        if (!result) {
            return;
        }
        console.log(data.dataList[index].courseSectionId, data.dataList[index].teacherId);
        const res = await this.service.courseSectionUnselect(data.dataList[index].courseSectionId);
        const currentItem = data.dataList[index];
        if (res.code == 0) {
            this.messageService.success("退选成功");
            data.dataList[index] = {
                ...currentItem,
                status: false // 只修改这一个字段，其他字段不变
            };
        } else {
            this.messageService.error(res.msg);
        }
    }
}