# Восстановление

Залить дамп в контейнер:
```
docker cp ./full.sql blog-postgres:/tmp/full.sql
```
Восстановить:
```
docker exec -i blog-postgres psql -U blog -f /tmp/full.sql
```
Быстрая проверка, что все восстановилось:

```
docker exec -it blog-postgres psql -U blog -d blog -c 'select count(*) from "User";'
docker exec -it blog-postgres psql -U blog -d blog -c 'select count(*) from "Post";'
docker exec -it blog-postgres psql -U blog -d blog -c 'select count(*) from "Comment";'
```
