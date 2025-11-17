import { OptionItem, Pagination } from "~/infrastructure/models/base";
// 定义通知数据模型
export interface NoticeItem {
  noticeId : number;
  num: string;
  title: string;
  releaseTime: string;
  content:string;
}
// 页面数据类型（整合查询条件、表单、分页）
export interface NoticeData {
    authHeader: any;
    numName: string;
    dataList: NoticeItem[];
    pagination: Pagination;
    currentIndex: number;
    releaseTime: Date;
}





