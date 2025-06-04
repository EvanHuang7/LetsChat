<div align="center">
  <h3 align="center">🌟 LetsChat</h3>
  <p align="center">
    🚀 <a href="https://letschat-qrze.onrender.com/" target="_blank"><b>Live App</b></a> &nbsp;|&nbsp;
    📂 <a href="https://github.com/EvanHuang7/LetsChat" target="_blank"><b>Source Code</b></a>
  </p>
</div>

## 📚 <a name="table">Table of Contents</a>

1. 📋 [Introduction](#introduction)
2. 🛠️ [Tech Stack](#tech-stack)
3. 🚀 [Features](#features)
4. 🧩 [Diagram and Screenshots](#diagram-screenshots)
5. ⚙️ [Installation and Start Project](#installation-start-project)
   - [⭐ Prerequisites](#prerequisites)
   - [⭐ Cloning the Repository](#clone-repo)
   - [⭐ Packages Installation](#install-packages)
   - [⭐ Create a Cluster in MongoDB](#create-mongodb-cluster)
   - [⭐ Set up Cloudinary](#set-up-cloudinary)
   - [⭐ Set up Stream.io](#set-up-stream)
   - [⭐ Set Up Environment Variables](#set-up-env-variables)
   - [⭐ Running the Project](#running-project)
6. ☁️ [Deploy App in Render](#deploy-app)
   - [🌐 Set up VPC](#set-up-vpc)
7. 👨‍💼 [About the Author](#about-the-author)

## <a name="introduction">📋 Introduction</a>

💬 **LetsChat** is a **MERN stack** (full-stack) real-time chat application that lets users connect with new friends and chat privately. Users can also create group chats, invite friends, and enjoy group messaging or even group video calls. In addition, users can post moments, as well as like and comment on others’ moments.

## <a name="tech-stack">🛠️ Tech Stack</a>

- **📡 Backend**:
  - **Node.js, Express.js, JavaScript**,
  - **MongoDB**
  - **Cloudinary** for file storage
- **🖥️ Frontend**:
  - **React.js, JavaScript**,
  - **Zustand** for state and API management
  - **Axios** for for HTTP requests
  - **Tailwind CSS** & **Daisy UI** for styling
- **⚙️ Real-Time & Communication**:
  - **Socket.io** for real-time chat and notifications
  - **Stream.io** for video calling features

## <a name="features">🚀 Features</a>

**🔐 Authentication**: Secure sign-up and sign-in with email and password, handled by **JWT**.

**🤝 Connect & Chat Privately**: Send and receive real-time friend requests and start private chats — all powered by **Socket.io**.

**👥 Create Groups & Invite Friends**: Create or join a group. As a group admin, invite friends to join and chat together.

**🎥 Start Video Calls**: Invite friends from private or group chats to join a video call via a system-generated link — powered by **Stream.io**.

**🖼️ Send Images & Add Stickers**: Send images in chat and save favorites to your personal sticker list.

**🔔 Real-Time Notifications**: Receive live message previews when a new message arrives and you're not viewing that conversation.

**📬 Unread Count & Online Status**: See unread message counts and live online status for each conversation.

**📝 Moments Feed**: View, comment on, and like moments from all users — or browse moments from a specific user. Users can also post their own.

**👤 Profile & Theme Settings**: Update your profile image and choose from 32 available themes.

**🎨 Modern UI/UX**: Clean, intuitive interface designed for clarity and ease of use.

**📱 Responsive Design**: Seamlessly adapts to any screen size or device.

## <a name="diagram-screenshots">🧩 Diagram and 📸 Screenshots</a>

- **🧩 Database Tables Diagram**: [drawSQL Diagram Link](https://drawsql.app/teams/evans-projects/diagrams/letschat-app)
- **📸 Screenshots**: [Miro Link](https://miro.com/app/board/uXjVIs-x_Hc=/?share_link_id=287651094618)

  ![🖼️ Screenshots Preview](https://res.cloudinary.com/dapo3wc6o/image/upload/v1749005825/LetsChat-App_yzbuox.jpg)

## <a name="installation-start-project">📦 Installation and ⚙️ Start Project</a>

Follow these steps to set up the project locally on your machine.

### <a name="prerequisites">⭐ Prerequisites</a>

Make sure you have the following installed on your machine:

- Git
- Node.js and npm(Node Package Manager)

### <a name="clone-repo">⭐ Cloning the Repository</a>

```bash
git clone https://github.com/EvanHuang7/LetsChat.git
```

### <a name="install-packages">⭐ Packages Installation</a>

Install the project dependencies using npm:

```bash
cd LetsChat/backend
npm install
cd ..
cd frontend
npm install
```

### <a name="create-mongodb-cluster">⭐ Create a Cluster in MongoDB</a>

Create a cluster by selecting a free plan and `Drivers` connection method under a project in MongoDB, and note down your cluster **connection string**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any MongoDB setup tutorial on YouTube to complete this step.)
- ⚠️ **Note**: Make sure your MongoDB proejct has public access
  - Go to **SECURITY > Network Access** tab
  - Click **ADD IP ADDRESS** button
  - Click **ALLOW ACCESS FROM ANYWHERE** button
  - Click **Confirm** button

### <a name="set-up-cloudinary">⭐ Set up Cloudinary</a>

Set up your free Cloudinary account and note down your Cloudinary **API key, API Secret and Cloud Name**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any Cloudinary setup tutorial on YouTube to complete this step.)

### <a name="set-up-stream">⭐ Set up Stream.io</a>
Set up your free Stream.io account and note down your Stream.io **API key, API Secret**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any Stream.io setup tutorial on YouTube to complete this step.)

### <a name="set-up-env-variables">⭐ Set Up Environment Variables</a>

Create a `.env` file under **backend** folder of your project and add the following content:

```env
PORT = 5001
MONGODB_URL = 
JWT_SECRET =
NODE_ENV = development

CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

STREAM_API_KEY = 
STREAM_API_SECRET = 
```

- Replace the placeholder values with your actual credentials from MongoDB, Cloudinary, Stream.io.
  - 📌 Note: For `JWT_SECRET`, you can use `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` command line to generate a random key for it.

### <a name="running-project">⭐ Running the Project</a>

Open **two separate terminal windows** and run the following commands to start the frontend and backend servers:

**Terminal 1** – Start the Client (Vite App):

```bash
cd LetsChat/frontend
npm run dev
```

**Terminal 2** – Start the Server (Express API):

```bash
cd LetsChat/backend
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the project.

## <a name="deploy-app">☁️ Deploy App in AWS Cloud</a>

To deploy your app to AWS, start by creating an AWS account. If you're a new user, you may be eligible for the 12-month Free Tier. Be aware that not all services are fully free—each AWS service has its own Free Tier limitations. For full details, refer to the [AWS Free Tier page](https://aws.amazon.com/free).

You can also find step-by-step AWS setup tutorials on YouTube to guide you visually through the process.

> ⚠️ **Important**: Most AWS services used in this deployment—such as EC2, RDS, and others—are only free for **one active instance** under the Free Tier.
>
> To avoid unexpected charges, ensure you **delete any existing instances** of these services before deploying your app.

Follow these steps to deploy app in AWS Cloud:

---

### <a name="set-up-vpc">🌐 Set up VPC for secure Networking</a>

1. Go to AWS VPC service and make sure you are in the correct **AWS region** closest to you (eg. `us-east-1`) by checking the top right of dashboard
2. Create a **new VPC**
   - Go to the **Virtual Private Cloud > Your VPCs** tab and click **Create VPC** button
3. 🎉🎉🎉 Check Your Deployed App 🎉🎉🎉
   - You should be able to view all restaurants on the homepage and see the menu items of any restaurant on its individual page—**no sign-in required**.
   - To test full functionality, **sign in** as a **Customer**, **Restaurant**, or **Driver** user.
   - If everything is working correctly, **congratulations**—you’ve successfully deployed your app to the AWS cloud! 🥳🥳🥳

---

## <a name="about-the-author">👨‍💼 About the Author</a>

Hi! I'm Evan Huang — a full-stack software developer with 4+ years of experience in web applications, real-time systems, and cloud integration. I’m passionate about building scalable products with clean architecture, elegant UI/UX, and modern technologies like React, Node.js, PostgreSQL, and AWS.

This food delivery app project was completed on **June 2, 2025**, and reflects my focus on blending AI, cloud infrastructure, and responsive design into real-world solutions.

Feel free to connect with me in LinkedIn or GitHub!

<a href="https://www.linkedin.com/in/evan-huang-97336b1a9/" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926619/Screenshot_2025-06-02_at_22.40.32_mxzsbh.png" alt="LinkedIn" width="150" />
</a>
<br/>
<a href="https://github.com/EvanHuang7" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926611/Screenshot_2025-06-02_at_22.52.45_jtlfww.png" alt="GitHub" width="150" />
</a>
