import { DataRequest, DataResponse } from "~/infrastructure/models/request";
import { NoticeItem } from "../models/notice";
export interface INoticeService {
    getNotificationList(dataRequest: DataRequest): Promise<DataResponse>;
    notificationDelete(noticeId:number): Promise<DataResponse>;
    getNotificationInfo(noticeId:number): Promise<NoticeItem>;
    notificationEditSave(noticeId: number | null, form: NoticeItem): Promise<DataResponse>;
    getNoticePageData(numName: String | null, currentPage: number): Promise<DataResponse>;
  }