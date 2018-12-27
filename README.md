# 一个WXAPP服务端

## sql

```sh
CREATE DATABASE `wxapp`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

INSERT INTO wxapps (app_type,name,appid,secret) VALUES(3,"wxapp","wx******","******");
```

## run

```sh
# 安装依赖
yarn install --production

# 创建数据表
EGG_SERVER_ENV=prod yarn migrate:up

# 启动
yarn start

# 停止
yarn stop
```

## biz

### 留言`rjmsg`

| Field      | Type        | Null | Key | Default | Extra          |
|------------|-------------|------|-----|---------|----------------|
| id         | int(11)     | NO   | PRI | NULL    | auto_increment |
| pid        | int(11)     |      |     |         |                |
| user_id    | int(11)     | NO   |     |         |                |
| appid      | VARCHAR(32) |      |     |         |                |
| name       | VARCHAR(32) |      |     |         |                |
| email      | VARCHAR(32) |      |     |         |                |
| phone      | VARCHAR(32) |      |     |         |                |
| cont       | TEXT        | NO   |     |         |                |
| ext        | TEXT        |      |     |         |                |
| msg_status | int(11)     |      |     |         |                |

```js
{
  ext: {
    imgs: [
      "a.jpg",
      "b.jpg"
    ]
  },
  msg_status: {
    0: '已删除',
    1: '默认',
    2: '已处理',
    3: '已关闭'
  }
}
```
