import { DataResponse } from "~/infrastructure/models/request";
import { IRequestService } from "~/infrastructure/boundaries/request-service";
import { INoticeService } from "~/domain/boundaries/notice-service";
import { ID_REQUEST_SERVICE } from "~/types";
import { inject, injectable } from "inversify";
import { DataRequest } from "~/infrastructure/models/request";
import { NoticeItem } from "../models/notice";

@injectable()
export class NoticeServiceImpl implements INoticeService {
    constructor(
        @inject(ID_REQUEST_SERVICE) private readonly requestService: IRequestService
    ) { }
 //获取通知列表分页数据后台数据请求方法
    public async getNoticePageData(
        numName: String | null,
        currentPage: number
    ): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/notification/getNotificationPageData", {
            numName: numName,
            currentPage: currentPage,
        });
        return res as DataResponse;
    }
    // 获取通知列表
    public async getNotificationList(dataRequest: DataRequest): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/notification/getNotificationList", dataRequest.data);
        return res as DataResponse;
    }

    // 删除通知
    public async notificationDelete(noticeId: number): Promise<DataResponse> {
        const res = await this.requestService.generalRequest("/api/notification/notificationDelete", {//改了
            noticeId: noticeId,
        });
        return res as DataResponse;
    }

    //获取通知基本信息后台数据请求方法
       public async getNotificationInfo(noticeId: number): Promise<NoticeItem> {
           const res = await this.requestService.generalRequest("/api/notification/getNotificationInfo", {
               noticeId: noticeId,
           });
           return res.data as NoticeItem;
       }

   public async notificationEditSave(//gaidong
  noticeId: number | null,
  form: NoticeItem
): Promise<DataResponse> {
   /*  const submitForm = {
            ...form,
            // 将Date转换为后端需要的"yyyy-MM-dd HH:mm:ss"字符串
            // 修复月份计算（+1），确保格式为 "yyyy-MM-dd HH:mm:ss"
    releaseTime: form.releaseTime
      ? `${form.releaseTime.getFullYear()}-${
          String(form.releaseTime.getMonth() + 1).padStart(2, '0') // 月份+1
        }-${
          String(form.releaseTime.getDate()).padStart(2, '0')
        } ${
          String(form.releaseTime.getHours()).padStart(2, '0')
        }:${
          String(form.releaseTime.getMinutes()).padStart(2, '0')
        }:${
          String(form.releaseTime.getSeconds()).padStart(2, '0')
        }`
      : ''
  };*/
  const res = await this.requestService.generalRequest(
    "/api/notification/notificationEditSave", // 后端通知保存接口地址（按实际调整）
    {
      noticeId: noticeId, // 唯一标识（区分新增/编辑）
      form: form // 表单完整数据（标题、正文等）（改了）
    },
    "POST" // 请求方式：和 studentEditSave 保持一致（后端若有要求可调整）
  );
  return res as DataResponse;
}
}