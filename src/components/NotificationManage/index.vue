<template>
  <div class="main-view-container">
    <!-- 通知信息编辑对话框 -->
    <el-dialog v-model="editVisible" :close-on-click-modal="false" width="60%" class="custom-dialog" destroy-on-close>
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon>
              <Edit />
            </el-icon>
          </div>
          <h3 class="dialog-title">通知信息编辑</h3>
        </div>
      </template>

      <div class="edit-form-container">
        <el-form ref="form" :model="itemData" label-width="100px" class="base-table-edit-form">
          <div class="form-content">
            <div class="form-left">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="通知编号">
                    <el-input v-model="itemData.num" placeholder="请输入通知编号" class="form-input" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="通知标题" required>
                    <el-input v-model="itemData.title" placeholder="请输入通知标题" class="form-input" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="24">
                  <el-form-item label="发布时间">
                    <el-date-picker v-model="data.releaseTime" type = "datetime" style="width: 100%;" 
                      placeholder="选择发布时间" class="form-date" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="16">
                <el-col :span="24">
                  <el-form-item label="通知内容" required>
                    <el-input v-model="itemData.content" placeholder="请输入通知内容" 
                      type="textarea" :rows="8" class="form-textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" @click="itemSubmit()" class="action-btn success-btn">
            <el-icon>
              <Check />
            </el-icon>
            提交
          </el-button>
          <el-button type="info" plain @click="editVisible = false" class="action-btn cancel-btn">
            <el-icon>
              <Close />
            </el-icon>
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <el-icon>
              <Bell />
            </el-icon>
          </div>
          <h2 class="page-title">通知管理</h2>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="action-left">
          <el-button type="success" @click="addItem()" class="action-btn add-btn">
            <el-icon>
              <Plus />
            </el-icon>
            添加通知
          </el-button>
        </div>
        <div class="action-right">
          <div class="search-group">
            <el-input v-model="data.numName" placeholder="请输入编号或标题" class="search-input">
              <template #prepend>编号或标题</template>
            </el-input>
            <el-button type="primary" @click="doQuery()" class="search-btn">
              <el-icon>
                <Search />
              </el-icon>
              查询
            </el-button>
            <el-button type="warning" @click="doExport()" class="export-btn">
              <el-icon>
                <Download />
              </el-icon>
              导出
            </el-button>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-container">
        <el-table :data="data.dataList" stripe class="base-table-table">
          <el-table-column label="序号" width="70" fixed>
            <template v-slot="scope">
              <div class="sequence-number">
                {{ scope.$index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template v-slot="scope">
              <div class="table-actions">
                <el-button type="primary" size="small" @click="editItem(scope.$index)" class="table-btn">
                  <el-icon>
                    <Edit />
                  </el-icon>
                  编辑
                </el-button>
                <el-button type="text" size="small" @click="viewDetail(scope.row)" class="table-btn">
                  <el-icon>
                    <Search />
                  </el-icon>
                  查看
                </el-button>
                <el-button type="danger" size="small" @click="deleteItem(scope.$index)" class="table-btn delete-btn">
                  <el-icon>
                    <Delete />
                  </el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="通知编号" width="140" />
          <el-table-column prop="title" label="通知标题" show-overflow-tooltip />
          <el-table-column prop="releaseTime" label="发布时间" width="180" />
          <el-table-column prop="content" label="通知内容" width="400" show-overflow-tooltip />
        </el-table>

        <!-- 分页器 -->
        <div class="pagination-container">
          <el-pagination size="default" background :total="data.pagination.total"
            :current-page="data.pagination.currentPage" :page-size="data.pagination.pageSize"
            @current-change="handleChangePage" layout="total, prev, pager, next, jumper" class="custom-pagination" />
        </div>
      </div>
    </div>

    <!-- 通知详情对话框 -->
    <el-dialog v-model="detailVisible" :close-on-click-modal="false" width="60%" class="custom-dialog" destroy-on-close>
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon>
              <Search />
            </el-icon>
          </div>
          <h3 class="dialog-title">通知详情</h3>
        </div>
      </template>

      <div class="detail-container">
        <div class="detail-item">
          <span class="detail-label">通知编号：</span>
          <span class="detail-value">{{ detailData.num }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">通知标题：</span>
          <span class="detail-value">{{ detailData.title }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">发布时间：</span>
          <span class="detail-value">{{ detailData.releaseTime }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">通知内容：</span>
          <div class="detail-content">{{ detailData.content }}</div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="info" plain @click="detailVisible = false" class="dialog-btn">
            <el-icon>
              <Close />
            </el-icon>
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="Notification">
import type { NoticeData, NoticeItem } from "~/domain/models/notice";
import { container } from '~/inverfiy.config';
import { ID_NOTICE_PRESENTER } from '~/types';
import { NoticePresenter } from "~/domain/presenters/notice-presenter";
import { ref } from "vue";
import {
  Bell, Edit, Delete, Plus, Search, Download,
  Check, Close
} from '@element-plus/icons-vue'

// 注入通知Presenter
const presenter = container.get<NoticePresenter>(ID_NOTICE_PRESENTER);

// 响应式数据
let data = ref<NoticeData>({ pagination: {} } as NoticeData);
let itemData = ref<NoticeItem>({} as NoticeItem);
let detailData = ref<NoticeItem>({} as NoticeItem);
let editVisible = ref(false);
let detailVisible = ref(false);

// 初始化页面数据
presenter.noticeInit().then((res) => {
  data.value = res;
});

// 分页切换
const handleChangePage = async (val: number) => {
  data.value.pagination.currentPage = val;
  await presenter.getNoticeDataPage(data.value);
};

// 执行查询
const doQuery = async () => {
  data.value.pagination.currentPage = 1;
  await presenter.getNoticeDataPage(data.value);
};

// 导出数据
const doExport = async () => {
  await presenter.doExport(data.value);
};

// 新增通知
const addItem = async () => {
  itemData.value = presenter.addItem(data.value);
  editVisible.value = true;
};

// 编辑通知
const editItem = async (index: number) => {
  itemData.value = await presenter.editItem(data.value, index);
  editVisible.value = true;
};

// 提交表单
const itemSubmit = async () => {
  await presenter.itemSubmit(itemData.value, data.value);
  editVisible.value = false;
};

// 查看详情
const viewDetail = (row: NoticeItem) => {
  detailData.value = { ...row };
  detailVisible.value = true;
};

// 删除通知
const deleteItem = async (index: number) => {
  await presenter.deleteItem(data.value, index);
};
</script>
