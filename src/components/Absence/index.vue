<template>
    <div class="main-view-container">
        <el-dialog v-model="editVisible" :close-on-click-modal="false" width="60%" class="custom-dialog"
            destroy-on-close>
            <template #header>
                <div class="dialog-header">
                    <div class="header-icon">
                        <el-icon>
                            <Sunny />
                        </el-icon>
                    </div>
                    <h3 class="dialog-title">发起请求</h3>
                </div>
            </template>

            <div class="edit-form-container">
                <el-form ref="form" :model="itemData" class="base-table-edit-form" label-width="100px">
                    <el-form-item label="申请教师" required>
                        <el-select v-model="itemData.teacherId" placeholder="请选择教师" class="form-select">
                            <el-option v-for="item in data.absenceSelectList" :key="item.id" :value="item.id"
                                :label="item.title" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请假类型" required>
                        <el-select v-model="itemData.absenceType" placeholder="请选择请假类型" class="form-input" clearable>
                            <el-option label="事假" value="事假"></el-option>
                            <el-option label="病假" value="病假"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间" required>
                        <el-input v-model="itemData.beginTime" placeholder="请输入请假开始时间" class="form-input" />
                    </el-form-item>
                    <el-form-item label="结束时间" required>
                        <el-input v-model="itemData.endTime" placeholder="请输入请假结束时间" class="form-input" />
                    </el-form-item>
                    <el-form-item label="请假原因" required>
                        <el-input v-model="itemData.absenceReason" placeholder="请输入请假原因" class="form-input" />
                    </el-form-item>
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
        <el-dialog
      v-model="dialogVisible"
      title="请假审批"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <p>请选择对这位同学的审批操作：</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleReject">拒绝</el-button>
          <el-button type="success" @click="handleApprove">同意</el-button>
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
                            <Ticket />
                        </el-icon>
                    </div>
                    <h2 class="page-title">请假管理</h2>
                </div>
            </div>

            <div class="action-bar">
                <div class="action-left">
                    <el-button type="success" @click="addItem()" class="action-btn add-btn"
                        v-if="appStore.userInfo.role == 'ROLE_STUDENT'">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        发起请假
                    </el-button>
                </div>
                <div class="action-right">
                </div>
            </div>

            <!-- 数据表格 -->
            <div class="table-container">
                <el-table :data="data.dataList" stripe class="base-table-table">
                    <!-- 与示例一致的序号列 -->
                    <el-table-column label="序号" width="60">
                        <template v-slot="scope">
                            <div class="sequence-number">
                                {{ scope.$index + 1 }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template v-slot="scope">
                            <div class="table-actions">
                                <el-button type="danger" size="small" @click="deleteItem(scope.$index)"
                                    class="table-btn delete-btn">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    删除
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="student" label="申请学生" width="120"
                        v-if="appStore.userInfo.role == 'ROLE_ADMIN' || appStore.userInfo.role == 'ROLE_TEACHER'" />
                    <el-table-column prop="teacher" label="申请教师" width="120"
                        v-if="appStore.userInfo.role == 'ROLE_ADMIN' || appStore.userInfo.role == 'ROLE_STUDENT'" />
                    <el-table-column prop="absenceType" label="请假类型" width="120" />
                    <el-table-column prop="beginTime" label="开始时间" width="200" />
                    <el-table-column prop="endTime" label="结束时间" width="200" />
                    <el-table-column prop="absenceReason" label="请假原因" width="220" show-overflow-tooltip />
                    <el-table-column prop="result" label="审批状态" width="120">
                        <template v-slot="scope">
                            <el-tag :type="getApproveStatusType(scope.row.result)" size="small">
                                {{ scope.row.result }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" v-if="appStore.userInfo.role == 'ROLE_TEACHER'">
                        <template v-slot="scope">
                            <div class="table-actions">
                                <el-button type="success" size="small" @click="giveResult(scope.$index)"
                                    class="table-btn delete-btn">
                                    <el-icon>
                                        <Check />
                                    </el-icon>
                                    进行审批
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="AbsenceManagement">
import type { AbsenceData, AbsenceItem } from "~/infrastructure/models/absence";
import { container } from '~/inverfiy.config';
import { ref } from "vue";
import { useAppStore } from "~/stores/app";
import { ID_ABSENCE_PRESENTER } from "~/types";
import { Ticket, Check, Close, Delete, Plus, Calendar, Sunny } from '@element-plus/icons-vue'; // 导入Plus图标
import { AbsencePresenter } from "~/domain/presenters/absence-presenter";
const appStore = useAppStore();
const presenter = container.get<AbsencePresenter>(ID_ABSENCE_PRESENTER);
// 状态定义
let itemData = ref<AbsenceItem>({} as AbsenceItem);
let editVisible = ref(false);
let dialogVisible = ref(false);
let data = ref<AbsenceData>({} as AbsenceData);
let dataIndex=1;
presenter.absenceInit().then((res) => {//页面初始化已经写完了
    data.value = res;
});
let isApproved=false;
// 新增请假
const itemSubmit = async () => {
    await presenter.absenceSave(itemData.value);
    editVisible.value = false;
    presenter.absenceInit().then((res) => {//页面初始化已经写完了
    data.value = res;
});
};

const giveResult = async (index:number) =>{
    dataIndex=index;
    dialogVisible.value=true;
}

// 打开新增对话框
const addItem = async () => {
    itemData.value = {} as AbsenceItem;
    editVisible.value = true;
};
const handleReject = async () => {
    isApproved=false;
    presenter.absenceGiveResult(isApproved,data.value.dataList[dataIndex]);
    dialogVisible.value=false;
    presenter.absenceInit().then((res) => {//页面初始化已经写完了
    data.value = res;
});
};
const handleApprove = async () => {
    isApproved=true;
    presenter.absenceGiveResult(isApproved,data.value.dataList[dataIndex]);
    dialogVisible.value=false;
    presenter.absenceInit().then((res) => {//页面初始化已经写完了
    data.value = res;
});
};

// 删除请假
const deleteItem = async (index: number) => {
    await presenter.deleteItem(data.value, index);
};

// 审批状态标签类型（新增：与成绩管理页面标签风格统一）
const getApproveStatusType = (status: string): 'success' | 'warning' | 'info' | 'danger' => {
    switch (status) {
        case '已批准':
            return 'success';
        case '待审批':
            return 'warning';
        case '已拒绝':
            return 'danger';
        default:
            return 'info';
    }
};
</script>

<style lang="scss" scoped>
/* 全局容器样式（与成绩管理页面统一） */
.main-view-container {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f5f7fa;
}

/* 主要内容区域样式 */
.main-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

/* 页面头部样式 */
.page-header {
    padding: 20px;
    border-bottom: 1px solid #f2f2f2;

    .header-content {
        display: flex;
        align-items: center;

        .header-icon {
            color: #000000;
            margin-right: 10px;

            el-icon {
                font-size: 24px;
            }
        }

        .page-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
    }
}

/* 操作栏样式（与成绩管理页面统一） */
.action-bar {
    padding: 16px 20px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .action-left {
        display: flex;
        gap: 10px;
    }

    .action-right {
        display: flex;
        gap: 10px;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .add-btn {
        background-color: #67c23a;
        border-color: #67c23a;

        &:hover {
            background-color: #52c41a;
            border-color: #52c41a;
        }
    }
}

/* 表格容器样式 */
.table-container {
    padding: 20px;

    .base-table-table {
        width: 100%;
    }

    .table-actions {
        display: flex;
        gap: 8px;
        justify-content: center;
    }

    .table-btn {
        padding: 4px 8px;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .delete-btn {
        background-color: #f56c6c;
        border-color: #f56c6c;

        &:hover {
            background-color: #f78989;
            border-color: #f78989;
        }
    }

    // 与示例完全一致的序号样式
    .sequence-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6a76f1, #8a6af1);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        margin: 0 auto;
    }
}

/* 对话框样式（与成绩管理页面统一） */
.custom-dialog {
    .dialog-header {
        display: flex;
        align-items: center;

        .header-icon {
            color: #ffffff;
            margin-right: 8px;

            el-icon {
                font-size: 20px;
            }
        }

        .dialog-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #333;
        }
    }

    .edit-form-container {
        padding: 10px 0;
    }

    .base-table-edit-form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        .form-input,
        .form-select {
            width: 100%;
        }

        .el-form-item {
            margin-bottom: 16px;
        }

        // 添加按钮样式
        .form-add-btn {
            margin-bottom: 10px;
            background-color: #409eff;
            border-color: #409eff;

            &:hover {
                background-color: #66b1ff;
                border-color: #66b1ff;
            }
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        .success-btn {
            background-color: #67c23a;
            border-color: #67c23a;

            &:hover {
                background-color: #52c41a;
                border-color: #52c41a;
            }
        }

        .cancel-btn {
            color: #409eff;
            border-color: #409eff;

            &:hover {
                background-color: #ecf5ff;
            }
        }
    }
}

/* 审批状态标签样式（与成绩标签统一） */
.el-tag {
    font-weight: 600;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
}

/* 响应式调整（与成绩管理页面统一） */
@media (max-width: 1200px) {
    .custom-dialog {
        .base-table-edit-form {
            grid-template-columns: 1fr;
        }
    }
}

@media (max-width: 768px) {
    .action-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;

        .action-right {
            width: 100%;
            flex-wrap: wrap;
        }
    }

    .table-container {
        padding: 10px;
    }

    .el-table-column {
        &:not(.el-table-column--selection):not(.el-table-column--operation) {
            width: auto !important;
        }
    }

    // 响应式下序号样式保持与示例一致
    .sequence-number {
        width: 26px;
        height: 26px;
        font-size: 12px;
    }
}
</style>