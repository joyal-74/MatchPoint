# 🏆 MatchPoint – Sports Tournament Management Platform

MatchPoint is a **sports tournament management platform** designed to simplify the way tournaments are created, managed, and experienced. It empowers organizers with powerful tools while giving players, teams, and fans a fully interactive experience with **live scores, streaming, chats, and more**.

---

## 🚀 Features

### 👤 Role-Based Authentication

* Secure login & registration.
* Four roles with unique permissions:

  * **Admin** → Full access, manage platform & subscriptions.
  * **Organizer** → Create/manage tournaments, schedule matches, update scores.
  * **Team/Player** → Join tournaments, manage team profiles, view stats.
  * **Viewer/Fan** → Subscribe, watch live matches, interact in live chat.

### 🏟 Tournament Management

* Create & manage tournaments (league, knockout, friendly).
* Define tournament rules, categories, and match schedules.
* Automated bracket generation & standings.
* Easy team registration & player assignment.

### 📊 Live Match Experience

* **Real-time score updates** with seamless refresh.
* **Live streaming integration** for an immersive fan experience.
* **Commentary support** text for detailed updates.
* Match statistics: runs, goals, fouls, wickets, possession, etc. (customizable per sport).

### 💬 Communication

* **Team Chat** → Private channel for each team to collaborate.
* **Live Chat During Streaming** → Fans and players can interact in real time.
* Moderator controls for safe & fun engagement.

### 💳 Subscription System

* Multiple subscription plans for fans.
* Unlock premium features: HD streaming, ad-free experience, exclusive stats.
* Payment gateway integration for smooth transactions.

### 📱 Responsive & User-Friendly UI

* Mobile-first design for accessibility on all devices.
* Dashboard view for quick insights into tournaments, teams, and matches.
* Dark/light mode support.

---

## 🔧 Tech Stack

* **Frontend**: React.js, Redux, Tailwind CSS
* **Backend**: Node.js, Express.js, clean architecture
* **Database**: MongoDB / PostgreSQL
* **Authentication**: JWT, Role-Based Access Control
* **Real-time Features**: Socket.io (for live chat, live scores)
* **Streaming**: WebRTC.
* **Deployment**: Docker, AWS EC2 / Vercel / Netlify
* **Payment**: Razorpay / Stripe

---

## 📂 Project Structure

```
MatchPoint/
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── app/
│   │   ├── domain/
│   │   ├── infra/
│   │   └── implementation/
│   └── server.ts
├── frontend/             # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   └── routes/
│   │   └── services/
│   │   └── types/
│   │   └── utils/
│   │   └── validators/
│   └── App.tsx
├── docs/                 # Documentation & assets
├── README.md
└── package.json
```

---

## ⚡ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/joyalk-74/matchpoint.git
   cd matchpoint
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Setup Environment Variables**
   Create `.env` files in both `backend/` and `frontend/` with required configs:

   ```
   PORT=5000
   MONGO_URI=your_mongo_connection
   ```

4. **Run the project**

   ```bash
   # Run backend
   cd backend
   npm run dev

   # Run frontend
   cd ../frontend
   npm start
   ```


## 🔮 Future Enhancements


* Multi-language support for international tournaments.
* Fantasy league integration for fans.
* Offline mode (progressive web app).
* Automated referee/umpire assistance.

---

## 🤝 Contribution

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**MatchPoint** is built with ❤️ by Joyal Kuriakose and contributors.