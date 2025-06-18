<!-- src/views/RegisterView.vue -->
<template>
  <div class="register-container">
    <div class="register-page">
      <h2 class="register-title">智能题匠注册新用户</h2>
      <form class="register-form" @submit.prevent="handleRegister">
        <input
            v-model="name"
            placeholder="用户名（最多10个字符）"
            maxlength="10"
            required
        />
        <input
            v-model="password"
            type="password"
            placeholder="密码（至少2位）"
            minlength="2"
            required
        />
        <button type="submit" :disabled="loading">
          {{ loading ? "注册中..." : "注册" }}
        </button>
      </form>
      <p class="to-login">
        已有账号？
        <button @click="goLogin" type="button">去登录</button>
      </p>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

const handleRegister = async () => {
  error.value = "";
  success.value = "";
  // 用户名长度限制
  if (name.value.length > 10) {
    error.value = "用户名不能超过10个字符";
    return;
  }
  // 用户名不能包含空格
  if (!/^[^\s]+$/.test(name.value)) {
    error.value = "用户名不能包含空格";
    return;
  }
  // 用户名只能包含中英文或数字
  if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(name.value)) {
    error.value = "用户名只能包含中英文或数字";
    return;
  }
  // 密码长度限制
  if (password.value.length < 2) {
    error.value = "密码不能少于2位";
    return;
  }
  // 密码不能包含空格
  if (!/^[^\s]+$/.test(password.value)) {
    error.value = "密码不能包含空格";
    return;
  }
  // 密码最大长度限制
  if (password.value.length > 32) {
    error.value = "密码不能超过32位";
    return;
  }
  loading.value = true;
  try {
    const res = await axios.post("/api/users/register", {
      name: name.value,
      password: password.value,
    });
    success.value = `注册成功，欢迎 ${res.data.name}！`;
    name.value = "";
    password.value = "";
  } catch (err) {
    if (err.response?.data?.includes("用户名已存在")) {
      error.value = "用户名已存在";
    } else {
      error.value = "注册失败，请稍后重试";
    }
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;
}
.register-page {
  width: 400px;
  height: 280px;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.register-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.register-form input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.register-form button {
  width: 100%;
  padding: 10px;
  background-color: #12ba2d; /* 改成蓝色，与登录按钮一致 */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease;
}

.register-form button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.register-form button:hover:not(:disabled) {
  background-color: #148710;
}

.register-form button:active:not(:disabled) {
  background-color: #0f6c0b;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.success {
  color: green;
  margin-top: 10px;
  font-size: 14px;
}

.to-login {
  margin-top: 15px;
  font-size: 14px;
  color: #555;
}

.to-login button {
  border: none;
  background: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-decoration: underline;
}

.to-login button:hover {
  color: #0056b3;
}
</style>