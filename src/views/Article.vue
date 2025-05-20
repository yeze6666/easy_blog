<template>
    <div class="article-manager">
      <div class="editor-container">
        <input 
          v-model="form.title" 
          placeholder="请输入文章标题"
          class="title-input"
        >
        <v-md-editor
          v-model="form.content"
          height="500px"
          left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
        />
        <div class="action-btns">
          <button @click="submitArticle" class="submit-btn">
            {{ editingId ? '保存修改' : '发布文章' }}
          </button>
          <button v-if="editingId" @click="cancelEdit" class="cancel-btn">
            取消编辑
          </button>
        </div>
      </div>
  
      <div class="article-list">
        <div 
          v-for="article in sortedArticles" 
          :key="article._id"
          class="article-card"
        >
          <div class="card-header">
            <h3>{{ article.title || '无标题文章' }}</h3>
            <div class="meta-info">
              <span class="date">{{ formatDate(article.updatedAt) }}</span>
              <div class="actions">
                <button @click="startEdit(article._id)" class="edit-btn">编辑</button>
                <button @click="deleteArticle(article._id)" class="delete-btn">删除</button>
              </div>
            </div>
          </div>
          <div class="card-preview">
            <v-md-editor 
              :model-value="article.content" 
              mode="preview"
              height="150px"
            />
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import VMdEditor from '@kangc/v-md-editor';
  import githubTheme from '@kangc/v-md-editor/lib/theme/github';
  import '@kangc/v-md-editor/lib/style/base-editor.css';
  import '@kangc/v-md-editor/lib/theme/style/github.css';
  
  VMdEditor.use(githubTheme);
  
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  const articles = ref([]);
  const form = ref({ title: '', content: '' });
  const editingId = ref(null);
  
  const sortedArticles = computed(() => 
    [...articles.value].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  );
  
  const fetchArticles = async () => {
    try {
      const { data } = await api.get('/articles');
      articles.value = data;
    } catch (error) {
      alert('获取文章失败');
    }
  };
  
  const submitArticle = async () => {
    try {
      if (!form.value.title.trim() || !form.value.content.trim()) {
        return alert('标题和内容不能为空');
      }
      
      const method = editingId.value ? 'put' : 'post';
      const url = editingId.value ? `/articles/${editingId.value}` : '/articles';
      
      await api[method](url, form.value);
      await fetchArticles();
      form.value = { title: '', content: '' };
      editingId.value = null;
    } catch (error) {
      alert(error.response?.data?.error || '操作失败');
    }
  };
  
  const deleteArticle = async (id) => {
    if (!confirm('确定删除？')) return;
    try {
      await api.delete(`/articles/${id}`);
      await fetchArticles();
    } catch (error) {
      alert('删除失败');
    }
  };
  
  const startEdit = async (id) => {
    try {
      const { data } = await api.get(`/articles/${id}`);
      form.value = data;
      editingId.value = id;
    } catch (error) {
      alert('获取文章失败');
    }
  };
  
  const cancelEdit = () => {
    form.value = { title: '', content: '' };
    editingId.value = null;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? '未知时间' : date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  onMounted(fetchArticles);
</script>
  
<style scoped>
  .article-manager {
    max-width: 1000px;
    margin: 20px auto;
    padding: 0 20px;
  }
  
  .editor-container {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
  }
  
  .title-input {
    width: 95%;
    padding: 12px 20px;
    font-size: 1.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .action-btns {
    margin-top: 20px;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
  }
  
  .submit-btn, .cancel-btn {
    padding: 10px 25px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .submit-btn {
    background: #3498db;
    color: white;
  }
  
  .cancel-btn {
    background: #e74c3c;
    color: white;
  }
  
  .article-list {
    display: grid;
    gap: 20px;
  }
  
  .article-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .meta-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .date {
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .delete-btn {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .edit-btn {
    background: #2ecc71;
    color: white;
  }
  
  .delete-btn {
    background: #e74c3c;
    color: white;
  }
  
  .card-preview {
    border-top: 1px solid #ecf0f1;
    padding-top: 15px;
  }
</style>