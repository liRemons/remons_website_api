 mysql -uroot -p website_manage




mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| pbootcms           |
| performance_schema |
| sys                |
| website_manage     |
+--------------------+

use website_manage;

mysql> show tables;
+--------------------------+
| Tables_in_website_manage |
+--------------------------+
| MUSIC_AUTHOR             |
| MUSIC_COLLECTION         |
| MUSIC_LIST               |
+--------------------------+


mysql> desc MUSIC_AUTHOR;
+-----------+--------------+------+-----+---------+-------+
| Field     | Type         | Null | Key | Default | Extra |
+-----------+--------------+------+-----+---------+-------+
| id        | varchar(255) | NO   | PRI | NULL    |       |
| name      | varchar(255) | NO   |     | NULL    |       |
| photo     | varchar(255) | YES  |     | NULL    |       |
| creatTime | datetime     | YES  |     | NULL    |       |
+-----------+--------------+------+-----+---------+-------+