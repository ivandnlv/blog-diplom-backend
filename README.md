# Восстановление

Создать дамп:
```
docker exec blog-postgres pg_dump -U <Имя юзера в бд> -d <Имя бд> -F c > backup.dump  
```

Посмотреть корректность дампа:
```
cat backup.dump | docker exec -i blog-postgres pg_restore -l | head -n 30
```
Восстановить:
```
cat backup.dump | docker exec -i blog-postgres pg_restore -U blog -d blog -c
```

Быстрая проверка, что все восстановилось:

```
docker exec -it blog-postgres psql -U blog -d blog -c 'select count(*) from "User";'
docker exec -it blog-postgres psql -U blog -d blog -c 'select count(*) from "Post";'
docker exec -it blog-postgres psql -U blog -d blog -c 'select count(*) from "Comment";'
```

После этого: 
```
prisma generate

npm run start:dev
```
