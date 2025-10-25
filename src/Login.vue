<template>
  <!-- 这是点击忘记密码后出现的用户信息输入框 -->
  <el-dialog v-model="dialogVisible" title="忘记密码" :close-on-click-modal="false" :destroy-on-close="true"  width="350px">
    <el-form ref="resetForm" :model="form"  label-width="80px" class="reset-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入您的用户名" ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" type="email" placeholder="请输入注册邮箱" ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button  type="primary"   @click="forgetPasswordAuthentication">
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
          <!-- 新增布局容器 -->
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
          <el-button type="primary" class="login-button" @click="loginSubmit()">登录</el-button>
        </el-form-item>
        <el-button type="text" @click="forgetPassword" size="small" class="forget-btn">
          忘记密码
        </el-button>
      </el-form>
    </div>
  </div>
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
//const loginReq: LoginRequest = reac;tive({ username: '2022030001', password: '123456', code: '' });
const loginReq: LoginRequest = reactive({ username: '', password: '', code: '' });
const VerificationCodeReq: VerificationCodeRequest = reactive({ VerificationCode: '', VerificationCodeId: '', code: '' });
const form:passwordForgetRequest=reactive({username:'',email:'',code:''});//对于找回密码的验证身份请求
// 验证码
const VerificationCode = ref('');  // 初始值为空字符串
// 验证码图片（Base64格式）
const codeImg = ref('');
// 验证码唯一标识（用于后端校验）就是给后端一个码，让后端根据这个码找到当初创建的验证码
const VerificationCodeId = ref('');
// 初始化/刷新验证码
let dialogVisible=ref(false);
const refreshCode = async () => {
  try {
    const res = await axios.get('/auth/getValidateCode');  // 调用后端接口
    if (res.data.code === 0) {
      codeImg.value = res.data.data.img;  // 保存图片
      VerificationCodeId.value = res.data.data.validateCodeId;  // 保存唯一标识
    }
  } catch (err) {
    console.error('获取验证码失败', err);
  }
};
// 页面加载时获取验证码
refreshCode();
const forgetPassword = ()=>{
    form.username=loginReq.username;
    dialogVisible.value=true;//将dialogVisiable的值设定为true
}
const forgetPasswordAuthentication = async ()=>{//将用户名和邮箱送去后端进行身份验证
if(form.email===''){
  ElMessage.error('邮箱不能为空');
}
if(form.username===''){
  ElMessage.error('用户名不能为空');
}
 try{ const res=await axios.post('/auth/forgetPasswordAuthentication',{"data":form});
  if(res.data.code===0){
    ElMessage.success('验证成功');
    dialogVisible.value=false;
    form.username='';
    form.email='';
  }
  else{
ElMessage.error(res.data.msg||'验证失败');
    dialogVisible.value=false;
    form.username='';
    form.email='';
return;
  }
}
catch{
ElMessage.error('网络请求失败,请检查后端');
    dialogVisible.value=false;
    form.username='';
    form.email='';
return;
}
}
const appPresenter = container.get<AppPresenter>(ID_APP_PRESENTER);
// 验证码验证：返回布尔值表示是否通过
const validataCodeTest = async () => {
  if (!VerificationCode.value || !VerificationCodeId.value) {
    ElMessage.warning('验证码为空');
    return false; // 未输入，验证失败
  }
  try {

    const response = await axios.post('/auth/te  stValidateInfo', {
      "data": {
        "VerificationCodeId": VerificationCodeId.value,
        "VerificationCode": VerificationCode.value
      }
    });
    if (response.data.code === 0) {
      return true; // 验证通过
    } else {
      console.log(response);
      ElMessage.error(response.data.msg || '验证码验证失败');
      refreshCode();
      return false; // 验证失败
    }
  } catch (error) {
    console.error('验证码验证请求失败', error);
    ElMessage.error('网络错误，请重试');
    return false; // 网络错误，视为验证失败
  }
};

// 登录提交：先验证验证码，通过后再执行登录
const loginSubmit = async () => {
  // 先执行验证码验证，只有通过后才继续登录
  const isCodeValid = await validataCodeTest();
  if (isCodeValid) {
    // 验证码通过，执行登录逻辑
    await appPresenter.enterApp(loginReq);
  } else {
    // 验证码未通过，不执行登录（可选：提示用户先完成验证码验证）
    //ElMessage.info('请先完成验证码验证');
  }
};

</script>

<style scoped>
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
  /* 让图片和按钮居中对齐 */
}

.code-img {
  width: 80px;
  /* 比之前增大10px */
  height: 36px;
  /* 比之前增大4px */
  cursor: pointer;
}

.borderless-forget-btn {
  padding: 0;
  line-height: 1;
  margin-top: 5px;
  border: none !important;
  color: #66b1ff;
}

.borderless-refresh-btn:hover {
  color: #3a8ee6;
}
.borderless-refresh-btn {
  padding: 0;
  line-height: 1;
  margin-top: 5px;
  border: none !important;
  color: #66b1ff;
}

.borderless-forget-btn:hover {
  color: #3a8ee6;
}
</style>

<style>
/* 新增不带scoped的style标签，放入@keyframes规则 */
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
</style>