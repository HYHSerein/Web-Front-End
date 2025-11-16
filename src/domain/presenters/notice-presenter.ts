import { DataResponse } from "~/infrastructure/models/request";
import { IRequestService } from "~/infrastructure/boundaries/request-service";
import { INoticeService } from "~/domain/boundaries/notice-service";
import { ID_BASE_SERVICE, ID_COMM_SERVICE, ID_INFO_SERVICE, ID_MESSAGE_SERVICE, ID_NOTICE_SERVICE, ID_REQUEST_SERVICE } from "~/types";
import { inject, injectable } from "inversify";
import { DataRequest } from "~/infrastructure/models/request";
import { NoticeData,NoticeItem } from "../models/notice";
import { IMessageService } from "~/infrastructure/boundaries/message-service";
import { ICommService } from "~/infrastructure/boundaries/comm-service";
import { IInfoService } from "../boundaries/info-service";
import { IBaseService } from "~/infrastructure/boundaries/base-service";
//import { NoticePresenter } from './notice-presenter';
@injectable()
export class NoticePresenter  {
  //commService: any;
    constructor(
        @inject(ID_REQUEST_SERVICE) private readonly requestService: IRequestService,
        @inject(ID_NOTICE_SERVICE) private readonly noticeService: INoticeService,
        @inject(ID_MESSAGE_SERVICE) private readonly messageService: IMessageService,
        @inject(ID_COMM_SERVICE) private readonly commService :ICommService,
         @inject(ID_BASE_SERVICE) private readonly baseService: IBaseService,
                @inject(ID_INFO_SERVICE) private readonly infoService: IInfoService,
    )   
     { }

    // 获取通知列表
    public async noticeInit(): Promise<NoticeData> {
  let data = {} as NoticeData;
  // 1. 初始化分页配置（和学生模块一致，默认第1页、每页20条）
  data.pagination = {
    currentPage: 1,
    pageSize: 20, // 可根据通知场景调整，比如设为20更合理
    total: 0
  };
  // 2. 设置权限头（接口请求认证必备）
  data.authHeader = this.requestService.getAuthHeader();
  // 3. 初始化查询条件（通知的查询关键词，对应编号/标题）
  data.numName = "";
  // 4. 初始化当前操作索引（-1标识未选中/新增状态）
  data.currentIndex = -1;
  // 5. 初始化通知列表（空数组，后续查询后填充）
  data.dataList = [];
  // 6. 首次分页查询（页面加载直接显示所有通知）
  await this.getNoticeDataPage(data);
  return data;
}public async getNoticeDataPage(data: NoticeData): Promise<void> {
        const res = await this.noticeService.getNoticePageData(data.numName, data.pagination.currentPage);
        data.pagination.total = res.data.dataTotal;
        data.pagination.pageSize = res.data.pageSize;
        data.dataList = res.data.dataList;

    }
    public async doExport(data: NoticeData): Promise<void> {
            const res = await this.requestService.downloadPost(
                "/api/notification/getNotificationListExcl",
                "通知.xlsx",
                {
                    numName: data.numName,
                }
            );
            if (res != 200) {
                this.messageService.error("导出失败！");
            }
        };
        public addItem(data: NoticeData): NoticeItem {
                let item = {} as NoticeItem;
                data.currentIndex = -1;
                return item;
            }
        public async editItem(data: NoticeData, index: number): Promise<NoticeItem> {
          let item = { ...data.dataList[index] } as NoticeItem;
          data.currentIndex = index;
          data.releaseTime=this.commService.getDateFromStr(item.releaseTime);//gaidong
          return item;
        }
        public async itemSubmit(item: NoticeItem, data: NoticeData): Promise<void> {
          // console.log(1);
          // 1. 调用后端接口提交数据（新增/编辑共用一个接口，用 noticeId 区分）
          // item.releaseTime=this.commService.formatDateTime(data.releaseTime);
          item.releaseTime = new Date(data.releaseTime).toISOString();
          console.log(data.releaseTime);
          console.log(item.releaseTime);
          console.log(item);
          console.log(item.noticeId);
          const res = await this.noticeService.notificationEditSave(item.noticeId,item);
          // 2. 提交成功（后端返回 code=0 为成功标识）

          if (res.code == 0) {
            console.log(res.code);
            let noticeId = res.data;
            item = await this.noticeService.getNotificationInfo(noticeId);
          if (data.currentIndex == -1) {
          // 新增场景：把新通知加进列表，分页总数+1
          data.dataList.push(item);
          data.pagination.total++;
          this.messageService.success("新增通知成功！");
          } else {
          // 编辑场景：替换列表中对应索引的旧数据
            data.dataList[data.currentIndex] = item;
            this.messageService.success("编辑通知成功！");
          }
        } else {
        // 3. 提交失败：提示后端返回的错误信息（如“标题不能为空”）
        this.messageService.error(res.msg);
        }
}     
// 6. 删除通知
  public async deleteItem(data: NoticeData, index: number): Promise<void> {
    
      const result = await this.messageService.confirm("确认删除通知吗?");
        if (!result) {
            return;
        }
        const res = await this.noticeService.notificationDelete(data.dataList[index].noticeId);
        if (res.code == 0) {
            this.messageService.success("删除成功");
            data.dataList.splice(index, 1);
            data.pagination.total--;
        } else {
            this.messageService.error(res.msg);
        }
    }
  }

