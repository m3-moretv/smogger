Простой mock сервер для OpenAPI v3
# Установка и запуск
- `npm i -g @m3-moretv/smogger`
- `npx @m3-moretv/smogger -s ./spec.yaml`

# Требования к спецификации OpenAPI
- Mock сервер умеет работать только со спецификацией 3й версии.
- При описании параметров http запросов нельзя использовать `allOf`, `anyOf`, `oneOf` (временно)
- Для генерации данных используется [Faker.js](https://github.com/marak/Faker.js/). Для уточнения формата данных необходимо описывать их в поле `format`:
```
type: string
format: name.firstName
```

# Comments
Сейчас генерятся только ответы application/json с кодом 200

### TODO
- Добавить возможность указать домен и путь до api в спеке
- Добавить заголовок, который регулирует код ответа сервера (X-Mogger-Code: 200 | 403 | 500 e.t.c)
- Логи в проект

_Supported by MoreTV with ❤️_
