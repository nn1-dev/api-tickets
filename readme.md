# Tickets API

Simple API to manage tickets hosted on Deno deploy.

## Local developement

Local developement requires a few env variables:

- `API_KEY` - Arbitrary string value, that needs to match `Authorization` bearer
- `API_KEY_RESEND` - Ask Pawel, we will be happy to give it to contributors

```
API_KEY=XXX API_KEY_RESEND=XXX deno run --unstable-kv --allow-env --allow-net index.ts
```

## Endpoints

### GET /

```
curl --request GET \
  --url http://localhost:8000/ \
  --header 'Authorization: Bearer XXX'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    Client->>Api: GET /
    Api->>Db: kv.list()
    Db->>Api: Entry[]
    alt Unauthorized
        Api->>Client: 401 Unauthorized
    else OK
        Api->>Client: 200 OK
    end
```

### POST /

```
curl --request POST \
  --url http://localhost:8000/ \
  --header 'Authorization: Bearer XXX' \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "Pablo Picasso",
	"email": "pablo@picasso.com"
}'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    participant Resend
    Client->>Api: GET /
    Api->>Db: kv.set()
    Db->>Api: Entry
    Api->>Resend: resend.emails.send()
    alt Error
        Resend->>Api: 400 Error
    else OK
        Resend->>Api: 200 OK
    end
    alt Unauthorized
        Api->>Client: 401 Unauthorized
    else Error
        Api->>Client: 400 Error
    else OK
        Api->>Client: 200 OK
    end
```

### DELETE /

```
curl --request DELETE \
  --url http://localhost:8000/ \
  --header 'Authorization: Bearer XXX' \
  --header 'Content-Type: application/json' \
  --data '{
	"id": "XXX"
}'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    Client->>Api: GET /
    Api->>Db: kv.delete()
    Db->>Api: Entry
    alt Unauthorized
        Api->>Client: 401 Unauthorized
    else OK
        Api->>Client: 200 OK
    end
```
