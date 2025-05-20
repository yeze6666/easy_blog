这是一个简单博客后台，有页面和后端 ，有文章管理，图片管理功能，方便二次开发，数据库我用的是MongoDB，你也可以用SQLite或是Mysql，下面是使用方法

安装依赖（一个是Vue3页面的依赖，另一个是Express框架的依赖。）
  Vue3依赖：
          1. cd easy_blog
          2. npm i 或是 npm install
          3.npm run dev (这个浏览器调试)
          4.npm run build 打包文件

  Express框架依赖:
          1. cd easy_blog_server
          2. npm i 或是 npm install
          3. node server.js

注意：你要安装MongoDB哦，不要忘记了，不要忘记了，不要忘记了，重要的事情说三遍！！！


打包后，放在Nginx或Caddy等代理，页面刷新可能404，这是代理查找机制的问题
      解决方法：使用try_files路径回退解决，可以问一下ai，很快解决的，耐心点

配置整体思路（和博客的前端静态页面）
    先  location 博客静态页面（在前端调用后台时统一加一个/api/后端接口）
    再url重写，加上反向代理。



    127.0.0.1:3000/photos    get请求获取照片，post则是上传照片，如果上传失败，先看看你有没有登录，或是在请求头加上Token！！！
                  /articles  get获取文章列表, post同理是上传文章，

                  /articles:id  put是更新，delete是删除


  所以在前端中调用axios.get(你的域名：端口/photos),可以获取照片
                axios.get(你的域名：打开/articles),  可以获取文章列表
    
