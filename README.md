# 💬 ChitChat — Real-Time Chat Application

**Deploy Link** -> **https://chitchat-jemz.onrender.com** 

ChitChat is a **secure, real-time chat application** that allows users to communicate instantly with text, images, documents, and videos.  
It is built with a **modern full-stack architecture**, focusing on **performance, security, and scalability** 🚀

---

## 🌟 Key Highlights

- 🔐 Secure Login & Signup System  
- ⚡ Real-time Messaging using **Socket.io**  
- 📁 Media Sharing (Images, Documents, Videos)  
- 🧑‍💻 User Management (Add, Edit, Delete Users)  
- ☁️ Cloud-based File Storage  
- 🌐 Deployed on **Render**

---

## 🧩 Part 1: Login & Signup Functionality

### 🔐 Authentication Features

- **Secure Login & Signup system**
- User credentials are safely stored using **password hashing**
- JWT-based authentication for secure sessions

### 🧾 User Details Stored in Database

Each user has the following information stored securely:

- **Name**
- **Email**
- **Mobile Number**
- **Password (hashed)**

### 🔁 Unique User Validation

- **Email and Mobile Number must be unique**
- No two users can register using the same email or mobile number
- Prevents duplicate accounts and ensures data integrity

---

## 💬 Part 2: Real-Time Chat Application (Socket.io)

### ⚡ Instant Messaging

- Real-time **one-to-one chat**
- Messages are delivered instantly using **Socket.io**
- No page refresh required

### 💾 Chat Persistence

- All chat messages are:
  - **Saved in the database**
  - Retrieved when users reopen chats
- Ensures chat history is never lost

---

## 📎 Media & File Sharing

Users can send and receive:

- 🖼️ **Images**
- 📄 **Documents (PDF, DOC, etc.)**
- 🎥 **Videos**

Files are uploaded securely and stored using **Cloudinary**.

---

## 👥 User Management (CRUD Operations)

Admins or authorized users can:

- ➕ **Add Users**
- ✏️ **Edit User Details**
- ❌ **Delete Users**
- 👁️ **View User Information**

---

## 🛠️ Tech Stack Used

### 🌐 Frontend
- **React.js**
- **Tailwind CSS**
- **Shadcn**

### 🧠 Backend
- **Node.js**
- **Express.js**
- **Socket.io**
- **Postman**

### 🗄️ Database
- **MongoDB**
- **Mongoose**

### 🔐 Authentication & Security
- **JWT (JSON Web Token)**
- **bcrypt.js** (Password Hashing)

### ☁️ File Storage
- **Cloudinary**
- **Multer**

### 🚀 Deployment
- **Render**

---

## 🧪 Additional Features

- 🔒 Secure API routes using middleware
- ⚙️ Environment variables for sensitive data
- 📱 Responsive UI for all screen sizes
- 🧩 Modular and scalable code structure

---



