# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:stable-alpine

# 删除默认配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制我们自定义的 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制打包后的前端文件
COPY dist/ /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# 启动 nginx 服务
CMD ["nginx", "-g", "daemon off;"]