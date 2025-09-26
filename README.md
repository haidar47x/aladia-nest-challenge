### Checklist

- [x] **Monorepo**: Build a structured monorepo of modules that follows MVC and CSR patterns
- [x] **Gateway**: Implement `gateway` app
- [x] **Authentication**: Implement `authentication` app
    - [x] Implement JWT login flow on `/auth/login`
    - [x] Implement `auth/register`
    - [x] Implement `auth/users` for fetching users
- [x] **Network Service**: Implement `NetworkService` for internal communication via `TCP` from Gateway to Authentication
- [x] **Validation**: Implement validation with `class-validator`
- [x] **Database**: Persistence using `mongodb`
- [x] **Logging**: Centralized module
- [x] **Unit Tests**: Unit test for controllers
- [x] **Health Checks**: `<gateway>/health`
  - [x] Gateway microservice hit
  - [x] NetworkService hit
  - [x] Authentication microservice hit
  - [x] MongoDB hit
- [x] **Rate Limiting**
- [x] **Caching**: via `cache-manager` for `/users`
- [x] **Error Handling**: Centralized error handler
- [x] **Swagger**: `<gateway>/api`
- [x] **Docker**: Dockerized all services
- [x] **Postman Collection**: [Link to Collection](https://haidar47x-4349353.postman.co/workspace/Haidar's-Workspace's-Workspace~b7b2e0e3-f487-4680-8014-d7b4d8ff438f/collection/48799541-86928dbb-5d2f-41a3-8f29-041695ce687a?action=share&source=copy-link&creator=48799541) or [JSON Download](https://github.com/haidar47x/aladia-nest-challenge/raw/refs/heads/master/docs/challenge.postman_collection.json)
- [x] **Documentation**: GitHub `README.md` for usage and architectural documentation
- [ ] **Walkthrough**: Video walkthrough

### Architecture

![High Level Diagram](./github/diagram.png)

### Usage

The application can be run inside Docker or as a regular Node.js app.

#### Docker

If Docker is installed, we can simply build and run the services:
```bash
$ docker-compose up --build
```

#### Node.js

To run the app using Node.js, we'll need to clone this repository:

```bash
$ git clone https://github.com/haidar47x/aladia-nest-challenge.git && cd aladia-nest-challenge

# Install dependencies
$ npm install
```

Then, we can run the application using the `start:all` command:
```
$ npm start:all
```

We can run the unit tests as well:
```bash
$ jest .
```