<template>
  <!-- 忘记密码对话框（统一风格） -->
  <el-dialog v-model="dialogVisible" title="忘记密码" :close-on-click-modal="false" :destroy-on-close="true" width="450px"
    class="custom-dialog">
    <el-form ref="resetForm" :model="form" label-width="80px" class="reset-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入您的用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" type="email" placeholder="请输入注册邮箱"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="forgetPasswordAuthentication" class="custom-dialog-btn">
        确定
      </el-button>
    </template>
  </el-dialog>

  <div class="login-container">
    <div class="login-wrapper">
      <el-form :model="loginReq" class="login-form" label-width="120px">
        <div class="login-title">用户登录</div>
        <el-form-item label="用户名">
          <el-input v-model="loginReq.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginReq.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="verify-group">
            <el-input v-model="VerificationCode" placeholder="请输入验证码" class="short-input" />
            <div class="code-refresh-col">
              <el-image :src="codeImg" class="code-img" @click="refreshCode" fit="cover"></el-image>
              <el-button type="text" @click="refreshCode" size="small" class="refresh-btn">
                刷新
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="button-col">
            <el-button type="primary" class="login-button" @click="loginSubmit">
            登录
            </el-button>
            <el-button type="text" @click="forgetPassword" size="small" class="forget-btn">
            忘记密码
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>

  <!-- 修改密码对话框（统一风格） -->
  <el-dialog v-model="forgetDialogVisible" title="修改密码" :close-on-click-modal="false" :destroy-on-close="true"
    width="600px" class="custom-dialog">
    <div class="password-container">
      <div class="password-card">
        <!-- 页面标题（与对话框标题统一，保持简洁） -->
        <div class="password-header">
          <div class="header-icon">
            <el-icon>
              <Lock />
            </el-icon>
          </div>
          <h2 class="header-title">设置新密码</h2>
        </div>

        <!-- 密码要求提示 -->
        <div class="password-notice">
          <el-alert title="密码安全要求" description="密码需包含三种字符类型（大小写字母、数字、特殊字符）及以上，且密码长度为8-20位" type="info" :closable="false"
            show-icon>
          </el-alert>
        </div>

        <!-- 密码修改表单 -->
        <el-form :model="data" :rules="rules" ref="passwordForm" label-width="100px" class="password-form" size="large">
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="data.newPassword" type="password" placeholder="请输入新密码" show-password clearable
              prefix-icon="Key" @input="checkPasswordStrength">
            </el-input>
            <div class="password-strength" v-if="data.newPassword">
              <span class="strength-label">密码强度：</span>
              <div class="strength-bar">
                <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPercent + '%' }">
                </div>
              </div>
              <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
            </div>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPassword">
            <el-input v-model="data.checkPassword" type="password" placeholder="请再次输入新密码" show-password clearable
              prefix-icon="CircleCheck">
            </el-input>
          </el-form-item>

          <el-form-item class="form-buttons">
            <el-button type="primary" size="large" @click="submit()" :loading="loading" class="custom-dialog-btn">
              <el-icon>
                <Check />
              </el-icon>
              确认修改
            </el-button>
            <el-button size="large" @click="reset()" class="custom-reset-btn">
              <el-icon>
                <RefreshLeft />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { container } from '~/inverfiy.config';
import { ref } from 'vue';
import axios from 'axios';
import { ID_APP_PRESENTER, ID_LOGIN_SERVICE } from '~/types';
import { AppPresenter } from "~/infrastructure/presenters/app-presenter";
import { reactive } from 'vue'
import { ElMessage } from 'element-plus';
import { LoginRequest, VerificationCodeRequest } from './infrastructure/models/login';
import { passwordForgetRequest } from './infrastructure/models/passwordForget';
import { useRouter } from 'vue-router';
import { Lock, Key, CircleCheck, Check, RefreshLeft } from '@element-plus/icons-vue';
import { passwordForget } from './infrastructure/models/passwordForget';
import { ID_PASSWORD_PRESENTER } from '~/types';
import { PasswordPresenter } from "~/domain/presenters/password-presenter";
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const loginReq: LoginRequest = reactive({ username: '', password: '', code: '' });
const VerificationCodeReq: VerificationCodeRequest = reactive({ VerificationCode: '', VerificationCodeId: '', code: '' });
const form: passwordForgetRequest = reactive({ username: '', email: '', code: '' });

// 验证码相关
const VerificationCode = ref('');
const codeImg = ref('');
const VerificationCodeId = ref('');

// 对话框控制
let dialogVisible = ref(false);
let forgetDialogVisible = ref(false);
let message = ref(form.username);

// 密码修改相关
const presenter = container.get<PasswordPresenter>(ID_PASSWORD_PRESENTER);
const passwordForm = ref<FormInstance>();
const loading = ref(false);
let data = ref<passwordForget>({} as passwordForget);
data.value.username = form.username;

// 表单验证规则
const rules = ref<FormRules>({
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度应为8-20位', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();
          return;
        }
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const typeCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

        if (typeCount < 3) {
          callback(new Error('密码需包含至少三种字符类型（大小写字母、数字、特殊字符）'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  checkPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== data.value.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 密码强度检测
const strengthPercent = ref(0);
const strengthText = ref('');
const strengthClass = ref('');

const checkPasswordStrength = () => {
  const password = data.value.newPassword;
  if (!password) {
    strengthPercent.value = 0;
    strengthText.value = '';
    strengthClass.value = '';
    return;
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // 基础分数
  if (checks.length) score += 20;
  if (checks.hasUpper) score += 20;
  if (checks.hasLower) score += 20;
  if (checks.hasNumber) score += 20;
  if (checks.hasSpecial) score += 20;

  // 长度加分
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  strengthPercent.value = Math.min(score, 100);

  if (score < 40) {
    strengthText.value = '弱';
    strengthClass.value = 'weak';
  } else if (score < 70) {
    strengthText.value = '中等';
    strengthClass.value = 'medium';
  } else {
    strengthText.value = '强';
    strengthClass.value = 'strong';
  }
};

// 提交修改密码
const submit = async () => {
  if (!passwordForm.value) return;

  try {
    const isValid = await passwordForm.value.validate();
    console.log(123);
    if (isValid) {
      data.value.username = form.username;
      loading.value = true;
      const res = await axios.post('/auth/forgetPasswordChangePassword', { "data": data.value });
      if (res.data.code == 0) {
        ElMessage.success("修改成功!");
        forgetDialogVisible.value = false; // 成功后关闭对话框
        reset(); // 重置表单
      } else {
        ElMessage.error("修改失败!");
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    loading.value = false;
  }
};

// 重置密码表单
const reset = async () => {
  if (passwordForm.value) {
    passwordForm.value.resetFields();
  }
  data.value = {} as passwordForget;
  strengthPercent.value = 0;
  strengthText.value = '';
  strengthClass.value = '';
  data.value.checkPassword = '';
  data.value.newPassword = '';
};

// 刷新验证码
const refreshCode = async () => {
  try {
    const res = await axios.get('/auth/getValidateCode');
    if (res.data.code === 0) {
      codeImg.value = res.data.data.img;
      VerificationCodeId.value = res.data.data.validateCodeId;
    }
  } catch (err) {
    console.error('获取验证码失败', err);
  }
};

// 页面加载时获取验证码
refreshCode();

// 打开忘记密码对话框
const forgetPassword = () => {
  form.username = loginReq.username;
  dialogVisible.value = true;
};

// 忘记密码身份验证
const forgetPasswordAuthentication = async () => {
  console.log(form.username);
  if (form.email === '') {
    ElMessage.error('邮箱不能为空');
    return;
  }
  if (form.username === '') {
    ElMessage.error('用户名不能为空');
    return;
  }
  try {
    const res = await axios.post('/auth/forgetPasswordAuthentication', { "data": form });
    if (res.data.code === 0) {
      ElMessage.success('验证成功');
      dialogVisible.value = false;
      form.email = '';
      forgetDialogVisible.value = true;
    } else {
      ElMessage.error(res.data.msg || '验证失败');
      dialogVisible.value = false;
      form.username = '';
      form.email = '';
      return;
    }
  } catch {
    ElMessage.error('网络请求失败,请检查后端');
    dialogVisible.value = false;
    form.username = '';
    form.email = '';
    return;
  }
};

// 登录相关
const appPresenter = container.get<AppPresenter>(ID_APP_PRESENTER);

// 验证码验证
const validataCodeTest = async () => {
  if (!VerificationCode.value || !VerificationCodeId.value) {
    ElMessage.warning('验证码为空');
    return false;
  }
  try {

    const response = await axios.post('/auth/testValidateInfo', {
      "data": {
        "VerificationCodeId": VerificationCodeId.value,
        "VerificationCode": VerificationCode.value
      }
    });
    if (response.data.code === 0) {
      return true;
    } else {
      console.log(response);
      ElMessage.error(response.data.msg || '验证码验证失败');
      refreshCode();
      return false;
    }
  } catch (error) {
    console.error('验证码验证请求失败', error);
    ElMessage.error('网络错误，请重试');
    return false;
  }
};

// 登录提交
const loginSubmit = async () => {
  const isCodeValid = await validataCodeTest();
  if (isCodeValid) {
    await appPresenter.enterApp(loginReq);
  }
};
</script>

<style scoped>
/* 登录页面基础样式 */
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('login_pic.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: high-quality;
  image-rendering: -webkit-optimize-contrast;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  margin-left: 20%;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  min-width: 400px;
  max-width: 450px;
}

.login-form {
  width: 100%;
}

.login-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form :deep(.el-form-item__label) {
  color: #2c3e50;
  font-weight: 600;
}

.login-form :deep(.el-input__inner) {
  border-radius: 8px;
  border: 2px solid #e1e8ed;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.login-button {
  width: 100%;
  height: 45px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* 验证码样式 */
.verify-group {
  display: flex;
  align-items: flex-start;
}

.short-input {
  width: 200px;
}

.code-refresh-col {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  align-items: center;
}

.code-img {
  width: 80px;
  height: 36px;
  cursor: pointer;
}

.refresh-btn {
  padding: 0;
  line-height: 1;
  margin-top: 5px;
  border: none !important;
  color: #66b1ff;
}

.refresh-btn:hover {
  color: #3a8ee6;
}

.forget-btn {
  padding: 0;
  line-height: 1;
  margin-top: 5px;
  border: none !important;
  color: #66b1ff;
}

.forget-btn:hover {
  color: #3a8ee6;
}

/* 统一对话框样式（核心） */
.custom-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 16px 24px;
    margin: 0;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }

  :deep(.el-dialog__headerbtn .el-icon) {
    color: white;
    font-size: 16px;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
    background-color: #fff;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid #f5f5f5;
    background-color: #fff;
  }
}

/* 统一对话框按钮样式 */
.custom-dialog-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

/* 重置按钮样式（统一风格） */
.custom-reset-btn {
  border: 2px solid #667eea;
  color: #667eea;
  background: transparent;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
}

/* 忘记密码表单样式（与修改密码表单统一） */
.reset-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    color: #2c3e50;
    font-weight: 600;
    font-size: 14px;
  }

  :deep(.el-input__inner) {
    border-radius: 8px;
    border: 2px solid #e1e8ed;
    transition: all 0.3s ease;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
}

/* 修改密码页面样式（保持统一） */
.password-container {
  padding: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.password-card {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: none;
  border: none;
  overflow: hidden;
}

.password-header {
  padding: 20px 0 16px;
  background: transparent;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.password-notice {
  padding: 0 0 16px;

  :deep(.el-alert) {
    border-radius: 8px;
    border: none;
    background: #f0f9ff;
  }

  .el-alert__icon {
    color: #409eff;
  }

  .el-alert__title {
    color: #409eff;
    font-weight: 600;
  }

  .el-alert__description {
    color: #666;
    line-height: 1.6;
  }
}

.password-form {
  padding: 0;

  :deep(.el-form-item__label) {
    color: #2c3e50;
    font-weight: 600;
    font-size: 14px;
  }

  :deep(.el-input) {
    border-radius: 8px;

    .el-input__wrapper {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }

      &.is-focus {
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
      }
    }

    .el-input__prefix {
      color: #667eea;
    }
  }

  .el-form-item {
    margin-bottom: 20px;
  }
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.strength-label {
  color: #666;
  white-space: nowrap;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
  min-width: 100px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;

  &.weak {
    background: linear-gradient(90deg, #ff6b6b, #ee5a52);
  }

  &.medium {
    background: linear-gradient(90deg, #feca57, #ff9ff3);
  }

  &.strong {
    background: linear-gradient(90deg, #48dbfb, #0abde3);
  }
}

.strength-text {
  font-weight: 600;
  white-space: nowrap;

  &.weak {
    color: #ff6b6b;
  }

  &.medium {
    color: #feca57;
  }

  &.strong {
    color: #0abde3;
  }
}

/* 按钮组 */
.form-buttons {
  margin-top: 24px;
  text-align: center;

  .el-form-item__content {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-wrapper {
    margin-left: 0;
    padding: 30px 20px;
    min-width: 90%;
  }

  .custom-dialog {
    :deep(.el-dialog) {
      width: 90% !important;
    }
  }

  .form-buttons .el-form-item__content {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .custom-dialog-btn,
  .custom-reset-btn {
    width: 100%;
    max-width: 200px;
  }

  .strength-bar {
    min-width: 80px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {

  .login-wrapper,
  .custom-dialog :deep(.el-dialog__body),
  .custom-dialog :deep(.el-dialog__footer) {
    background: #2c3e50;
  }

  .login-title,
  .login-form :deep(.el-form-item__label),
  .reset-form :deep(.el-form-item__label),
  .password-form :deep(.el-form-item__label),
  .header-title,
  .strength-label {
    color: #ecf0f1;
  }

  .password-card {
    background: #2c3e50;
  }

  .password-notice :deep(.el-alert) {
    background: rgba(64, 158, 255, 0.1);
    color: #ecf0f1;
  }

  .header-icon {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

/* 表单验证错误样式优化 */
:deep(.el-form-item.is-error) {
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #f56c6c inset, 0 2px 8px rgba(245, 108, 108, 0.2);
  }

  .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
  }
}

/* 加载状态按钮样式 */
:deep(.el-button.is-loading) {
  pointer-events: none;

  .el-icon {
    animation: rotating 2s linear infinite;
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

<style>
/* 全局动画样式 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 对话框入场动画 */
.el-dialog-fade-enter-from,
.el-dialog-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.el-dialog-fade-enter-active,
.el-dialog-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.button-col {
  display: flex;
  flex-direction: column;
  align-items: center;   /* 水平居中 */
  gap: 8px;              /* 两按钮间距 */
  width: 100%;
}



.forget-btn {
  font-size: 12px;
  margin: 0;             /* 去掉默认 margin */
}

</style>