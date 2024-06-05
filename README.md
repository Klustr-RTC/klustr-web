<div align="center">
  <img src="https://klustr.netlify.app/klustr.png" width="100px" style="border-radius:10px;" align="center" >
  <h1>Klustr</h1>
  <div align="center" style="display:flex; gap:16px;">
    <img src="https://img.shields.io/github/languages/top/Klustr-RTC/klustr-web" alt="shields">
    <img src="https://img.shields.io/github/forks/Klustr-RTC/klustr-web" alt="shields">
    <img src="https://img.shields.io/github/stars/Klustr-RTC/klustr-web" alt="shields">
  </div>
</div>

#### [Live Site](https://klustr.netlify.app) | [Youtube Video](https://www.youtube.com/watch?v=KGh4CIZ1KHo) | [Backend](https://github.com/Klustr-RTC/klustr-api)

## Project Description

Klustr is a chat application that allows users to communicate in rooms. Rooms can be public or private. Users can join rooms, send messages, and participate in audio/video chats. The application includes features like message persistence, room management, and profile editing.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a basic understanding of React, Tailwind CSS, .NET, and PostgreSQL.
- You have a PostgreSQL database setup.

## Technologies Used

- React
- SignalR
- WebRTC (peer.js)
- Tailwind CSS
- React Router

## Installation

1. Clone the repository:

```sh
git clone https://github.com/Klustr-RTC/klustr-web.git
```

2. Navigate to the project directory:

```sh
cd klustr-web
```

3. Install the dependencies:

```sh
npm install
```

4. Create a `.env.local` file in the root directory and add the environment variables as mentioned in the `vite-env.d.ts` file in `src` directory.
5. Start the development server:

```sh
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Features

- **Authentication:**

  - User registration and login with JWT.

- **Room Management:**

  - Create rooms (public or private).
  - Manage room members and permissions.
  - Delete rooms created by the user.
  - Generate shareable links for rooms, which can be regenerated to invalidate the old link.

- **Join Room:**

  - Join rooms from the home page by clicking on room cards and filtering rooms.
  - Join rooms using a shareable link (no join code required if the link is valid).
  - Private rooms require a join code for access.

- **Messaging:**

  - Send and receive messages in chat rooms.
  - Option to save messages to the database or keep them in local storage.
  - Timestamps displayed for each message using `react-timeago`.

- **Audio/Video Chat:**

  - Join audio/video rooms and interact with other participants.
  - Enable/disable camera and microphone.
  - Integrated chat functionality within audio/video rooms.
  - WebRTC for audio/video communication.
  - SignalR for real-time communication.

- **Profile Management:**

  - View and edit user profile.
  - View rooms created by the user.

- **Filtering and Searching:**
  - Filter rooms based on visibility (public/private), type (chat/audio-video), name, and description.

## Contributors

<a href="https://github.com/Klustr-RTC/klustr-web/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Klustr-RTC/klustr-web" />
</a>

## Contact Information

For inquiries or support, please contact:

- [Email](mailto:nileshdarji28200@gmail.com)
