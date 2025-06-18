<!-- src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <div class="login-page">
      <h2 class="login-title">欢迎登录智能题匠</h2>
      <form class="login-form" @submit.prevent="handleLogin">
        <input v-model="name" placeholder="用户名" required />
        <input v-model="password" type="password" placeholder="密码" required />
        <button type="submit" :disabled="loading">
          {{ loading ? "登录中..." : "登录" }}
        </button>
      </form>
      <p class="to-register">
        没有账号？
        <button @click="goRegister" type="button">去注册</button>
      </p>
      <p class="error" v-if="error">{{ error }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { setUserInfo } from "@/utils/auth";

const router = useRouter();
const name = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleLogin = async () => {
  error.value = "";
  loading.value = true;
  try {
    const res = await axios.post("/api/users/login", {
      name: name.value,
      password: password.value,
    });
    const user = res.data;
    setUserInfo({ id: user.id, username: user.name });
    router.push("/home");
  } catch (err) {
    error.value = "用户名或密码错误";
  } finally {
    loading.value = false;
  }
};

const goRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;
}

.login-page {
  width: 400px;
  height: 280px;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.login-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.login-form input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease;
}

.login-form button:hover {
  background-color: #0056b3;
}

.login-form button:active {
  background-color: #004494;
}

.login-form button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.to-register {
  margin-top: 15px;
  font-size: 14px;
  color: #555;
}

.to-register button {
  border: none;
  background: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-decoration: underline;
}

.to-register button:hover {
  color: #0056b3;
}
</style>