import { HonorData, HonorItem } from "~/domain/models/teaching";
import { ID_TEACHING_SERVICE, ID_MESSAGE_SERVICE } from "~/types";
import { IMessageService } from "~/infrastructure/boundaries/message-service";
import { ITeachingService } from "~/domain/boundaries/teaching-service";
import { inject, injectable } from "inversify";

@injectable()
export class HonorPresenter {
    constructor(
        @inject(ID_MESSAGE_SERVICE) private readonly messageService: IMessageService,
        @inject(ID_TEACHING_SERVICE) private readonly service: ITeachingService
    ) { }

    public async honorInit(): Promise<HonorData> {
        let data = {} as HonorData;
        data.personId = 0;
        data.honorLevel = "";
        data.studentList = await this.service.getStudentItemOptionList();
        data.honorLevelList = await this.service.getHonorLevelOptionList();
        data.studentList.unshift({ id: 0, value: "", title: "请选择" });
        data.honorLevelList.unshift({ id: 0, value: "", title: "请选择" });
        return await this.getHonorList(data);
    }

    // 修改：返回完整的 HonorData
    public async getHonorList(data: HonorData): Promise<HonorData> {
    console.log("【HonorPresenter】getHonorList 调用参数:", {
        personId: data.personId,
        honorLevel: data.honorLevel
    });
    
    try {
        const dataList = await this.service.getHonorList(data.personId, data.honorLevel);
        console.log("【HonorPresenter】获取到的数据:", dataList);
        console.log("【HonorPresenter】数据类型:", typeof dataList);
        console.log("【HonorPresenter】数据长度:", dataList ? dataList.length : 0);
        
        return {
            ...data,
            dataList: dataList || []
        };
    } catch (error) {
        console.error("【HonorPresenter】getHonorList 错误:", error);
        return {
            ...data,
            dataList: []
        };
    }
}

    public async itemSubmit(item: HonorItem, data: HonorData): Promise<HonorData> {
        const res = await this.service.honorSave(
            item.honorId, 
            item.personId, 
            item.honorName, 
            item.honorLevel, 
            item.awardTime, 
            item.awardUnit, 
            item.description
        );
        
        if (res.code == 0) {
            this.messageService.success("添加修改成功");
            return await this.getHonorList(data); // 返回更新后的数据
        } else {
            this.messageService.error(res.msg);
            throw new Error(res.msg);
        }
    }

    // 添加 addItem 方法
    public addItem(data: HonorData): HonorItem {
        return { 
            honorId: 0,
            personId: 0, 
            honorName: "",
            honorLevel: "",
            awardTime: "",
            awardUnit: "",
            description: "",
            studentNum: "",
            studentName: "",
            className: ""
        } as HonorItem;
    }

    public editItem(data: HonorData, index: number): HonorItem {
        return { ...data.dataList[index] } as HonorItem;
    }

    async deleteItem(data: HonorData, index: number): Promise<HonorData> {
        const result = await this.messageService.confirm("确认删除荣誉吗?");
        if (!result) {
            return data;
        }
        
        const res = await this.service.honorDelete(data.dataList[index].honorId);
        if (res.code == 0) {
            this.messageService.success("删除成功");
            // 创建新数组而不是修改原数组，确保响应式更新
            const newDataList = [...data.dataList];
            newDataList.splice(index, 1);
            return {
                ...data,
                dataList: newDataList
            };
        } else {
            this.messageService.error(res.msg);
            return data;
        }
    };
}