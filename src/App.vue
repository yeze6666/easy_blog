<template>
  <Header v-if="currentRoute.meta.isShow" />

  <RouterView/>
</template>

<script setup>
  import {RouterLink, RouterView,useRoute} from "vue-router";
  import axios from 'axios';
  import Header from './components/Header.vue';
  const currentRoute = useRoute();//获取当前路由实例

  // 全局请求拦截器
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  })
  // 全局响应拦截器
  axios.interceptors.response.use(response => {
    return response;
  })
</script>

<style scoped>
  Header{
    margin-bottom: 2rem;
  }
</style>