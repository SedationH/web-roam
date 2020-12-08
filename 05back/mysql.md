- [安装](https://flaviocopes.com/mysql-how-to-install/)

- [sql](https://juejin.cn/post/6844904196383195144#heading-4)

```zsh
# 管理员状态打开
mysql -uroot -p
```

[mysql 创建用户并赋予用户权限](https://blog.csdn.net/DoneSpeak/article/details/55548779)

mysql中的mysql database中user进行用户管理和相关数据存储

```zsh
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

所以在这里可以像改数据一样对用户进行操作

```sql
use mysql;
delete from `user` WHERE user='test_user';
CREATE user 'sunluyong'@'localhost' identified BY '123456';
CREATE DATABASE demo;
GRANT all privileges on demo.* to 'sunluyong'@'localhost';
```

使用sunluyong进行登录的时候就可以使用demo数据库了