# Tickets API

Simple API to manage tickets hosted on Deno deploy.

## Local developement

Local developement requires a few env variables:

- `API_KEY` - Arbitrary string value, that needs to match `Authorization` bearer
- `API_KEY_RESEND` - Ask Pawel, we will be happy to give it to contributors
- `ADMIN_RECIPIENTS` - Comma-separated admin emails

```
API_KEY=XXX API_KEY_RESEND=XXX ADMIN_RECIPIENTS=XXX deno run --unstable-kv --allow-env --allow-net index.ts
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

### GET /:eventId

```
curl --request GET \
  --url http://localhost:8000/:eventId \
  --header 'Authorization: Bearer XXX'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    Client->>Api: GET /:eventId
    Api->>Db: kv.list()
    Db->>Api: Entry[]
    alt Unauthorized
        Api->>Client: 401 Unauthorized
    else OK
        Api->>Client: 200 OK
    end
```

### GET /:eventId/:ticketId

```
curl --request GET \
  --url http://localhost:8000/:eventId/:ticketId \
  --header 'Authorization: Bearer XXX'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    Client->>Api: GET /:eventId/:ticketId
    Api->>Db: kv.get()
    Db->>Api: Entry
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
	"email": "pablo@picasso.com",
	"eventName": "#2: \"Design Secrets for Developers\" by Thomas Reeve and \"Type-safe localization of Unsplash.com\" by Oliver Ash",
	"eventDate": "Thursday, 27/06/2024, 18:00",
	"eventLocation": "Vulcan Works, 34-38 Guildhall Rd, Northampton, NN1 1EW"
}'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    participant Resend
    Client->>Api: POST /
    Api->>Db: kv.set()
    Db->>Api: Entry
    Api->>Resend: resend.emails.send() (client)
    Api->>Resend: resend.emails.send() (admins)
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

### PUT /

```
curl --request PUT \
  --url http://localhost:8000/ \
  --header 'Authorization: Bearer XXX' \
  --header 'Content-Type: application/json' \
  --data '{
	"ticketId": "123",
	"ticketToken": "123",
	"eventId": 123,
	"eventName": "#2: \"Design Secrets for Developers\" by Thomas Reeve and \"Type-safe localization of Unsplash.com\" by Oliver Ash",
	"eventDate": "Thursday, 27/06/2024, 18:00",
	"eventLocation": "Vulcan Works, 34-38 Guildhall Rd, Northampton, NN1 1EW"
}'
```

```mermaid
sequenceDiagram
    participant Client
    participant Api
    participant Db as KV Database
    participant Resend
    Client->>Api: PUT /
    Api->>Db: kv.set()
    Db->>Api: Entry
    Api->>Resend: resend.emails.send() (client)
    Api->>Resend: resend.emails.send() (admins)
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

### DELETE /:eventId/:ticketId

```
curl --request DELETE \
  --url http://localhost:8000/:eventId/:ticketId \
  --header 'Authorization: Bearer XXX' \
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
