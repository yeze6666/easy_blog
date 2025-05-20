<template>
    <div class="admin-container">
      <div class="admin-card">
        <h2>管理员设置</h2>
        <form @submit.prevent="handleChangePassword">
          <div class="input-group">
            <label>当前密码</label>
            <input
              type="password"
              v-model="form.oldPassword"
              placeholder="请输入当前密码"
              required
            >
          </div>
          <div class="input-group">
            <label>新密码</label>
            <input
              type="password"
              v-model="form.newPassword"
              placeholder="请输入新密码（至少3位）"
              required
              minlength="3"
            >
          </div>
          <button :disabled="loading" type="submit">
            {{ loading ? '修改中...' : '确认修改' }}
          </button>
          <div v-if="message" class="message" :class="{ error }">{{ message }}</div>
        </form>
      </div>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:3000'
  });

  const form = ref({
    oldPassword: '',
    newPassword: ''
  });
  const loading = ref(false);
  const message = ref('');
  const error = ref(false);
  
  const handleChangePassword = async () => {
    message.value = '';
    error.value = false;
    loading.value = true;
  
    try {
      await api.put('/admin/change-password', form.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      message.value = '密码修改成功';
      form.value = { oldPassword: '', newPassword: '' };
    } catch (err) {
      error.value = true;
      message.value = err.response?.data?.error || '密码修改失败';
    } finally {
      loading.value = false;
    }
  };
</script>
  
<style scoped>
  .admin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
    margin-top: -2rem;
  }
  
  .admin-card {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease;
  }
  
  .admin-card:hover {
    transform: translateY(-2px);
  }
  
  h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
  }
  
  .input-group {
    margin-bottom: 1.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  button {
    width: 100%;
    padding: 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  button:hover:not(:disabled) {
    background: #2980b9;
    transform: translateY(-1px);
  }
  
  .message {
    margin-top: 1rem;
    text-align: center;
    color: #27ae60;
    font-size: 0.9rem;
  }
  
  .message.error {
    color: #e74c3c;
  }
</style>