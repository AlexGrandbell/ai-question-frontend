<template>
  <div class="profile-container">
    <h2>个人中心</h2>
    <div class="info-section">
      <p>用户名：{{ user.username }}</p>
    </div>

    <div class="change-password">
      <h3>修改密码</h3>
      <form @submit.prevent="handleChangePassword">
        <input
            type="password"
            v-model="oldPassword"
            placeholder="旧密码"
            required
        />
        <input
            type="password"
            v-model="newPassword"
            placeholder="新密码"
            required
        />
        <input
            type="password"
            v-model="confirmPassword"
            placeholder="确认新密码"
            required
        />
        <button type="submit">提交</button>
      </form>
    </div>

    <ToastMassage ref="toast" />
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { getUserInfo } from "@/utils/auth";
import ToastMassage from "@/components/ToastMassage.vue";

export default {
  name: "SelfInfoView",
  components: {
    ToastMassage,
  },
  setup() {
    const user = getUserInfo();

    const toast = ref(null);
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");

    const handleChangePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        toast.value?.addToast("两次输入的新密码不一致", "error");
        return;
      }
      if (newPassword.value.length < 2) {
        toast.value?.addToast("新密码不能少于2位", "error");
        return;
      }
      try {
        await axios.post("/api/users/change-password", {
          username: user.username,
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        });
        toast.value?.addToast("密码修改成功", "success");
        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
      } catch (err) {
        toast.value?.addToast("旧密码错误或修改失败", "error");
      }
    };

    return {
      user,
      oldPassword,
      newPassword,
      confirmPassword,
      handleChangePassword,
      toast,
    };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.info-section {
  margin-bottom: 30px;
  font-size: 16px;
}

.change-password h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.change-password input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.change-password button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.change-password button:hover {
  background-color: #0056b3;
}
</style>