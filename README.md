# 📚 Peer Learning Tracker – Frontend

This is the frontend for the **Peer Learning Tracker** project – a platform to track group-based learning goals and progress. Built using **Next.js**, **Tailwind CSS**, and communicates with a **Node.js + MongoDB** backend via API. Authentication is handled using **JWT tokens**.

---

## 🔗 Live Demo

Frontend deployed on Vercel:  
➡️ [https://peer-learning-five.vercel.app](https://peer-learning-five.vercel.app)

---

## 🛠️ Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Authentication:** JWT Token-based auth (Login/Register)
- **API Communication:** Axios
- **Backend:** Node.js + Express (see [Backend Repo](https://github.com/shishirshetty77/Peer-Learning-Tracker-Goal-Backend))
- **Database:** MongoDB

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shishirshetty77/Peer-Learning-Tracker-Goal-frontend.git
cd Peer-Learning-Tracker-Goal-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add the following line:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> Replace `http://localhost:3000` with the backend URL if it's running on a different port or hosted remotely.

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Login Credentials

You can create a new account 

---

## 📁 Project Structure Overview

```
/components     → Reusable UI components
/pages          → Page-level components (Next.js routing)
/public         → Static assets
/styles         → Global styles (Tailwind + custom)
```

---

## 📄 Backend

The backend repo is hosted at:  
➡️ [Peer-Learning-Tracker-Goal-Backend](https://github.com/shishirshetty77/Peer-Learning-Tracker-Goal-Backend)

---

## 📌 Notes

- Make sure your backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`.
- JWT token is stored securely on the client side.
- All relevant project instructions and API details can be found in the respective repo README files.

---

## 🙋‍♂️ Need Help?

Feel free to reach out if you face any issues running the project or have any questions!

---
```
