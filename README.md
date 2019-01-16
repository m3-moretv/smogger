Простой mock сервер для OpenAPI v3

# Установка и запуск
- `npm i -g @m3-moretv/smogger`
- `npx @m3-moretv/smogger -s ./spec.yaml`

# Требования к спецификации OpenAPI
- Mock сервер умеет работать только со спецификацией 3й версии.
- Для генерации данных используется [Faker.js](https://github.com/marak/Faker.js/). Для уточнения формата данных необходимо описывать их в поле `format`:
```
type: string
format: name.firstName
```

# Comments
Сейчас генерятся только ответы application/json с кодом 200


_Supported by MoreTV with ❤️_
