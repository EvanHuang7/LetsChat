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
   - [⭐ Installation](#install)
   - [⭐ Create Database in PgAdmin](#create-local-db)
   - [⭐ Set Up AWS](#set-up-aws)
     - [🔐 Set up Cognito](#set-up-cognito)
     - [🗂️ Set up S3](#set-up-s3)
     - [🔑 Set up IAM](#set-up-iam)
     - [✉️ Set up SES](#set-up-ses)
     - [📣 Set up SNS](#set-up-sns)
   - [⭐ Set Up Environment Variables](#set-up-env-variables)
   - [⭐ Create Tables, Add Event Trigger, and Seed Mock Data](#create-table)
   - [⭐ Upload Images of Mock Data to AWS S3 Bucket](#upload-images-s3)
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
- PostgresSQL and PgAdmin

### <a name="clone-repo">⭐ Cloning the Repository</a>

```bash
git clone https://github.com/EvanHuang7/order-food.git
```

### <a name="install">⭐ Installation</a>

Install the project dependencies using npm:

```bash
cd order-food/server
npm install
cd ..
cd client
npm install
```

### <a name="create-local-db">⭐ Create Database in PgAdmin</a>

Create a local PostgreSQL database using pgAdmin, and note down your PostgreSQL **username, password, and database name**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any PostgreSQL setup tutorial on YouTube to complete this step.)

---

### <a name="set-up-aws">⭐ Set Up AWS</a>

Create an AWS account and ensure you qualify for the 12-month Free Tier if you're a new user. Otherwise, you may incur charges when using AWS services. Each AWS service has its own Free Tier policy—refer to the [AWS Free Tier page](https://aws.amazon.com/free) for details. (You can follow relevant AWS setup tutorials on YouTube to guide you through the steps below.)

> **⚠️ Note**
>
> - **✅ Minimum Requirement**
>
>   - **AWS Cognito** must be configured to use the app. User authentication won't work without it.
>
> - **🧩 Optional Services**
>   - **AWS S3**: Required to display mock data images. Without it, image uploading and seeded image display will be disabled, but all other features remain usable.
>   - **AWS IAM, SNS, and SES**: Required for the notification system to send and receive email alerts. The app will function without these, just without notifications.

#### <a name="set-up-cognito">🔐 Set up AWS Cognito and create a User Pool:</a>

1. Go to AWS Cognito service
2. Create a User Pool
   - Click **Create User pool** button
   - Select `Single-page application` as the application type
   - Enter your desired **application name** (eg. `appName-cognito-userpool`)
   - Under **Options for sign-in identifiers**, select both `Email` and `Username`
   - Under **Required attributes for sign-up**, select `email`
   - Click **Create user directory** button
3. Add "role" custom attribute
   - After creating the user pool, go to the **Authentication > Sign-up** tab and add a custom attribute named "role"
4. Note down the **User pool ID and User pool app client ID**—you'll need them later in the **Set Up Environment Variables step**

#### <a name="set-up-s3">🗂️ Set up AWS S3:</a>

1. Go to AWS S3 service
2. Create a S3 bucket
   - Click **Create bucket** button
   - Select `General purpose` for **bucket type**
   - Enter your desired **bucket name** (eg. `appName-s3-images`)
   - **Disable** "Block all public access" and **check** the check box of **warning alert** to acknowledge the disable action
   - Keep the rest of things by default in this page
   - Click **Create bucket** button
3. Configure created S3 bucket permission

   - Click the S3 bucket we just created to go to bucket info page
   - Click **Permissions** tab
   - Scroll to the bottom and click **Edit** button of **Bucket policy**
   - Copy and paste below script to update the policy allow all users to view the files in this S3 bucket.
   - ⚠️ Note: remember to change the **Placeholder of Bucket ARN** to your real **Bucket ARN** in this page

     ```
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "Statement1",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "Placeholder of Bucket ARN/*"
             }
         ]
     }
     ```

   - Click **Save changes** button

4. Note down the **S3 bucket name** for latter usage

#### <a name="set-up-iam">🔑 Set up AWS IAM:</a>

1. Go to AWS IAM service
2. Create an **AWS IAM user** with **full access to SES and SNS**:
3. Generate and note down the **IAM user Access Key ID and Secret Access Key**

#### <a name="set-up-ses">✉️ Set up AWS SES:</a>

1. Go to AWS SES service
2. Verify both your **sender email and recipient email** addresses
3. ⚠️ Note: In **sandbox mode**, SES requires the recipient email to be verified in the **Identities section**
4. Note down your **verified sender email**

#### <a name="set-up-sns">📣 Set up AWS SNS:</a>

1. Go to AWS SNS service
2. Create a topic for managing email or app notifications
3. Note down the **ARN of Topic**

---

### <a name="set-up-env-variables">⭐ Set Up Environment Variables</a>

Create a `.env` file under **client** folder of your project and add the following content:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=

NEXT_PUBLIC_VAPI_WEB_TOKEN=
```

Create another `.env` file under **server** folder of your project and add the following content:

```env
PORT=3001
DATABASE_URL="postgresql://myusername:mypassword@localhost:5432/mydatabasename?schema=public"

AWS_REGION=""
S3_BUCKET_NAME=""

AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
SES_VERIFIED_EMAIL=""

SNS_TOPIC_SUBSCRIBE_APP=""

GOOGLE_GENERATIVE_AI_API_KEY=""
```

- Replace the placeholder values with your actual credentials from AWS Cognito, Vapi, PostgreSQL, AWS S3, IAM User, SES, SNS, and Google Gemini (via Google AI Studio).
- Feel free to follow YouTube tutorials on Vapi and Google AI Studio to obtain the required tokens and configuration.

### <a name="create-table">⭐ Create Tables, Add Event Trigger, and Seed Mock Data</a>

Create the necessary tables, add an event trigger for the `create` event on the `Notification` table, and seed mock data into your local PostgreSQL database by running:

```bash
cd order-food/server
npx prisma migrate reset
npm run prisma:generate
npm run seed
```

### <a name="upload-images-s3">⭐ Upload Images of Mock Data to AWS S3 Bucket</a>

Upload the entire `mockDataImage` folder located in `order-food/client/public` to your AWS S3 bucket. This ensures that mock data images are properly displayed in the application.

### <a name="running-project">⭐ Running the Project</a>

Open **two separate terminal windows** and run the following commands to start the frontend and backend servers:

**Terminal 1** – Start the Client (Next.js App):

```bash
cd order-food/client
npm run dev
```

**Terminal 2** – Start the Server (Express API):

```bash
cd order-food/server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

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
