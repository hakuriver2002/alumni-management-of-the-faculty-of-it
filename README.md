# Introduction

Xin chào thầy và các bạn, 

Cùng với sự phát triển không ngừng của ngành công nghệ thông tin và tin học văn phòng vào đời sống xã hội thì việc sử dụng máy tính trong công tác quản lý đã trở thành một nhu cầu cấp thiết. Nền tảng quản lý thông tin cựu sinh viên và hoạt động cựu sinh viên đề cập đến một nền tảng thông tin toàn diện tích hợp quản lý công việc cựu sinh viên và các tiện ích được thiết lập cho các nhóm cựu sinh viên cụ thể với sự trợ giúp của công nghệ 4.0

Từ đó, nhóm chúng em xây dựng dự án quan trọng về hệ thống quản lý thông tin cựu sinh viên nhằm phát triển một cổng thông tin trao đổi linh hoạt và hiệu quả.

# Getting Started

## Feature

- CRUD
- Validation
- Security
- Responsive
- User module + Admin module

## Requirement

- Nodejs >= 18.11
- MongoDBCompass >= 1.36

## Technologies

- NodeJS
- ExpressJS
- cookie/session
- CSS
- Boostrap 5
- MongoDB
- JWT

## Installation

```
$ git clone https://gitlab.duthu.net/S52000882/alumni-management-of-the-faculty-of-it.git
$ cd alumni-management-of-the-faculty-of-it

```

Tải thư viện và chạy

```
$ npm install
$ npm run dev
```


Tài khoản dùng để đăng nhập trang Dashboard

```
admin@gmail.com
admin123
```
## Endpoints

### HTML

#### Client Module

| HTTP Method | URL                                | Description         | Note             |
| ----------- | ---------------------------------- | ------------------- | ---------------- |
| `GET`       | http://localhost:5050/api/home     | Home Page           |                  |
| `GET`       | http://localhost:5050/api/login    | Login Page          |                  |
| `GET`       | http://localhost:5050/api/signup   | Signup Page         |                  |
| `GET`       | http://localhost:5050/api/add-info | Add Infomation Page | Require to Login |

#### Admin Module

| HTTP Method | URL                                       | Description     | Note             |
| ----------- | ----------------------------------------- | --------------- | ---------------- |
| `GET`       | http://localhost:5050/api/admin/login     | Admin Login     |                  |
| `GET`       | http://localhost:5050/api/admin/logout    | Admin Logout    | Require to Login |
| `GET`       | http://localhost:5050/api/admin/dashboard | Dashboard       | Require to login |
| `GET`       | http://localhost:5050/api/admin/users     | Manage Users    | Require to login |
| `GET`       | http://localhost:5050/api/admin/alu       | Manage Alumnies | Require to login |
| `GET`       | http://localhost:5050/api/admin/events    | Manage Events   | Require to login |
| `GET`       | http://localhost:5050/api/admin/jobs      | Manage jobs     | Require to login |

### User - CRUD

#### User Service

| HTTP Method | URL                                    | Description           | Note             |
| ----------- | -------------------------------------- | --------------------- | ---------------- |
| `GET`       | http://localhost:5050/api/login        | Login account         |                  |
| `GET`       | http://localhost:5050/api/signup       | Signup account        |                  |
| `GET`       | http://localhost:5050/api/logout       | Logout account        | Require to login |
| `GET`       | http://localhost:5050/api/add-info     | Add infomation acount | Require to login |
| `GET`       | http://localhost:5050/api/home#about   | About us              |                  |
| `GET`       | http://localhost:5050/api/home#team    | Team                  |                  |
| `GET`       | http://localhost:5050/api/home#gallery | Gallery               |                  |
| `GET`       | http://localhost:5050/api/home#contact | Contact us            |                  |
| `GET`       | http://localhost:5050/api/home#events  | List events           | Require to login |
| `GET`       | http://localhost:5050/api/events/:id   | Detail event          | Require to login |
| `GET`       | http://localhost:5050/api/alum         | List alumni           | Require to login |
| `GET`       | http://localhost:5050/api/jobs         | List job              | Require to login |
| `GET`       | http://localhost:5050/api/jobs/:id     | Detail job            | Require to login |
| `GET`       | http://localhost:5050/api/profile      | My Profile            | Require to login |
| `POST`      | http://localhost:5050/api/profile      | Update Profile        | Require to login |

### Admin - CRUD

#### User Management

| HTTP Method | URL                                              | Description  |
| ----------- | ------------------------------------------------ | ------------ |
| `GET`       | http://localhost:5050/api/admin/users            | Manage Users |
| `POST`      | http://localhost:5050/api/admin/users/:id        | Verify User  |
| `DELETE`    | http://localhost:5050/api/admin/users/delete/:id | User Delele  |

#### Alumni Management

| HTTP Method | URL                                            | Description     |
| ----------- | ---------------------------------------------- | --------------- |
| `GET`       | http://localhost:5050/api/admin/alu            | Manage Alumnies |
| `GET`       | http://localhost:5050/api/admin/alu/:id        | Alumni Detail   |
| `GET`       | http://localhost:5050/api/admin/alu/create     | Add Alumni Page |
| `POST`      | http://localhost:5050/api/admin/alu/create     | Create Alumni   |
| `POST`      | http://localhost:5050/api/admin/alu/update/:id | Update Alumni   |
| `DELETE`    | http://localhost:5050/api/admin/alu/delete/:id | Delele Alumni   |

#### Event Management

| HTTP Method | URL                                               | Description    |
| ----------- | ------------------------------------------------- | -------------- |
| `GET`       | http://localhost:5050/api/admin/events            | Manage Evenet  |
| `GET`       | http://localhost:5050/api/admin/events/create     | Add Event Page |
| `POST`      | http://localhost:5050/api/admin/events/create     | Create Event   |
| `POST`      | http://localhost:5050/api/admin/events/update/:id | Update Event   |
| `DELETE`    | http://localhost:5050/api/admin/events/delete/:id | Delele Event   |

#### Job Management

| HTTP Method | URL                                             | Description  |
| ----------- | ----------------------------------------------- | ------------ |
| `GET`       | http://localhost:5050/api/admin/jobs            | Manage Jobs  |
| `GET`       | http://localhost:5050/api/admin/jobs/create     | Add Job Page |
| `POST`      | http://localhost:5050/api/admin/jobs/create     | Create Job   |
| `POST`      | http://localhost:5050/api/admin/jobs/update/:id | Update Job   |
| `DELETE`    | http://localhost:5050/api/admin/jobs/delete/:id | Delele Job   |
