<template>
  <!-- 登录 -->
  <el-form v-loading="isLoading" label-position="top" hide-required-asterisk :rules="rules" :model="userForm"
    @submit.prevent="onLogin(loginType)" class="form animate__animated ">
    <h2 mb-5 tracking-0.2em>欢迎来到极物圈!</h2>
    <p mb-10 tracking-0.1em text-0.8em>
      没有账户？
      <span color-emerald cursor-pointer hover:font-700 transition-300 @click="toRegister">立即注册</span>
    </p>
    <!-- 切换登录 -->
    <div class="toggle-login" my-1em>
      <el-button flex-1 :class="{ active: loginType === LoginType.EMAIL }" @click="loginType = LoginType.EMAIL"
        tracking-0.1em>邮箱登录</el-button>
      <el-button flex-1 :class="{ active: loginType === LoginType.PHONE }" @click="loginType = LoginType.PHONE"
        tracking-0.1em>手机登录</el-button>
      <el-button flex-1 :class="{ active: loginType === LoginType.PWD }" @click="loginType = LoginType.PWD" tracking-0.1em
        tracking-0.2em>密码登录</el-button>
    </div>
    <!-- 验证码登录(客户端 ) -->
    <ClientOnly>
      <!-- 邮箱登录 -->
      <el-form-item v-if="loginType === LoginType.EMAIL" prop="email" class="animated">
        <el-input type="email" prefix-icon="Message" v-model.trim="userForm.email" size="large" placeholder="请输入邮箱">
          <template #append>
            <el-button type="primary" @click="getLoginCode(loginType)" :disabled="phoneCodeStorage > 0 && isLoading">{{
              emailCodeStorage > 0 ? `${emailCodeStorage}s后重新发送` : '获取验证码' }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <!-- 手机号登录 -->
      <el-form-item type="tel" v-if="loginType === LoginType.PHONE" prop="phone" class="animated">
        <el-input prefix-icon="Iphone" v-model.trim="userForm.phone" size="large" type="tel" placeholder="请输入手机号">
          <template #append>
            <el-button type="primary" @click="getLoginCode(loginType)" :disabled="phoneCodeStorage > 0">{{
              phoneCodeStorage > 0 ? `${phoneCodeStorage}s后重新发送` : '获取验证码'
            }}</el-button>
          </template>
        </el-input>
      </el-form-item>
    </ClientOnly>
    <el-form-item v-if="loginType === LoginType.EMAIL || loginType === LoginType.PHONE" prop="code" class="animated">
      <el-input prefix-icon="ChatDotSquare" v-model.trim="userForm.code" size="large" placeholder="请输入验证码" />
    </el-form-item>
    <!-- 密码登录 -->
    <el-form-item label="" v-if="loginType === LoginType.PWD" prop="username" class="animated">
      <el-input prefix-icon="user" v-model.trim="userForm.username" size="large" placeholder="请输入用户名、手机号或邮箱" />
    </el-form-item>
    <el-form-item type="password" label="" v-if="loginType === LoginType.PWD" prop="password" class="animated">
      <el-input prefix-icon="Lock" v-model.trim="userForm.password" size="large" placeholder="请输入密码" type="password" />
    </el-form-item>
    <el-form-item mt-1em>
      <el-input type="submit" flex-1 size="large" class="submit">
        登 录
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { FormRules } from 'element-plus';
import { getLoginCodeByType, toLoginByPwd, toLoginByPhone, toLoginByEmail, DeviceType } from '~/composables/api/user';
import { LoginType } from '~/types/user/index.js';
const loginType = ref<number>(LoginType.EMAIL);
const isLoading = ref<boolean>(false);
const autoLogin = ref<boolean>(false);
// 表单
const userForm = reactive({
  username: '',// 用户名
  password: '',// 密码
  phone: "",// 手机号
  email: "", // 邮箱
  code: '',// 验证码
});
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '该项不能为空！', trigger: 'blur' },
    { min: 6, max: 30, message: '长度在6-30个字符！', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空！', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度不正确！', trigger: 'blur' },
  ],
  code: [{
    required: true, message: "验证码6位组成！", trigger: 'change',
  },
  ],
  email: [
    { required: true, message: '邮箱不能为空！', trigger: 'blur' },
    { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确！', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '手机号不能为空！', trigger: 'blur' },
    { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/, message: '手机号格式不正确！', trigger: 'change' },
  ],
});
// 验证码有效期
const phoneTimer = ref(-1)
const emailTimer = ref(-1)
const emailCodeStorage = ref<number>(0)
const phoneCodeStorage = ref<number>(0)

/**
* 获取验证码
* @param type 
*/
const getLoginCode = async (type: LoginType) => {
  let data;
  // 获取邮箱验证码
  if (type === LoginType.EMAIL) {
    // 简单校验
    if (userForm.email.trim() === "") return;
    if (!checkEmail(userForm.email)) {
      isLoading.value = false;
      return ElMessage.error("邮箱格式不正确！")
    }
    // 开启
    isLoading.value = true;
    // 请求验证码
    data = await getLoginCodeByType(userForm.email, DeviceType.EMAIL);
    // 成功
    if (data.code === 20000) {
      ElMessage.success({
        message: '验证码已发送至您的邮箱，5分钟有效！',
        duration: 5000,
      })
      useInterval(emailTimer, emailCodeStorage, 60, -1)
    }
  }
  // 获取手机号验证码
  else if (type === LoginType.PHONE) {
    if (userForm.phone.trim() === "") return;
    if (!checkPhone(userForm.phone)) {
      return ElMessage.error("手机号格式不正确！")
    }
    isLoading.value = true;
    data = await getLoginCodeByType(userForm.phone, DeviceType.PHONE);
    if (data.code === 20000) {
      // 开启定时器
      useInterval(phoneTimer, phoneCodeStorage, 60, -1)
      ElMessage.success({
        message: `手机验证码为：${data.data}`,
        duration: 5000,
      })
      userForm.code = data.data
    }
  }
  // 关闭加载
  isLoading.value = false;
}
/**
* 定时器
* @param timer 本地定时器
* @param num 计数对象
* @param target 开始秒数
* @param step 自增自减
* @param fn 回调
*/
const useInterval = (timer: any, num: Ref<number>, target?: number, step: number = -1, fn?: Function) => {
  num.value = target || timer.value
  timer.value = setInterval(() => {
    num.value += step
    // 清除定时器
    if (num.value <= 0) {
      num.value = -1
      clearInterval(timer.value)
      timer.value = -1
    }
  }, 1000)
};

const store = useUserStore()
const toRegister = () => {
  store.showLoginForm = false;
  store.showRegisterForm = true;
}

/**
* 登录
* @param type 
*/
const onLogin = async (type: LoginType) => {
  let res = null;
  switch (type) {
    case LoginType.PWD:
      res = (await toLoginByPwd(userForm.username, userForm.password));
      break;
    case LoginType.PHONE:
      res = (await toLoginByPhone(userForm.phone, userForm.code));
      break;
    case LoginType.EMAIL:
      res = (await toLoginByEmail(userForm.email, userForm.code));
      break;
  }
  //  
  if (res.code === 20000) {
    // 登录成功
    if (res.data != "") {
      ElMessage.success({
        message: "登录成功！",
        duration: 2000,
      })
      store.onUserLogin(res.data, autoLogin.value)
      store.$patch({
        token: res.data,
        showLoginForm: false,
        showRegisterForm: false,
        isLogin: true,
      });
    }
    // 登录失败
    else {
      ElMessage.error({
        message: res.message,
        duration: 5000,
      })
      // store
      store.$patch({
        token: "",
        isLogin: false,
      });
    }
  }
}
</script>
<style scoped lang="scss">
.form {
  width: 400px;
  display: inline-block;
  padding: 2.5em 3em 2em 3em;
  background-color: #ffffff;
  border-radius: var(--el-border-radius-base);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(109, 109, 109, 0.2);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px;
  overflow: hidden;
  animation-delay: 0.1s;

  :deep(.el-input__wrapper) {
    padding: 0.3em 1em;

  }

  // 报错信息 
  :deep(.el-form-item) {
    padding: 0.2em;

    .el-form-item__error {
      padding-top: 0.2em;
    }
  }
}

:deep(.el-button) {
  padding: 0.3em 1em;
}

.dark .form {
  background-color: #161616d8;
}

.animate__animated {
  animation-duration: 0.5s;
}

// label总体
:deep(.el-form-item) {
  margin-bottom: 14px;
}

// 切换登录
.toggle-login {
  position: relative;
  border-radius: var(--el-border-radius-base);
  backdrop-filter: blur(10px);
  background-color: #dddddd2a;
  padding: 0.3em;
  display: flex;

  :deep(.el-button) {
    background-color: transparent;
    transition: 0.3s;
    padding: 0em 0.6em;
    border: none;
  }

  .active {
    transition: 0.3s;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px;
    background-color: transparent;
    color: var(--el-text-color);
  }

}

.dark .active {
  background-color: var(--el-color-primary);
}

.submit {
  font-size: 1.2em;
  font-weight: 800;
  transition: 0.3s;
  cursor: pointer;

  :deep(.el-input__wrapper) {
    background-color: var(--el-color-primary);
    cursor: pointer;

    * {
      color: #fff;
      font-weight: 800;
      letter-spacing: 0.4em;
    }
  }


  .dark:deep(.el-input__wrapper) {
    background-color: var(--el-color-primary);
    cursor: pointer;
    color: #fff;
  }
}
</style>
