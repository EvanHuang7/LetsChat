-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_pic TEXT DEFAULT '',
  stickers TEXT[] DEFAULT ARRAY[
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2s0ZzY5ZThsMmhzcndpdGg0bXdnNDB3Mmd4eW9zNmUxcmJ2dnpzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGGDNsLvqsBOhuU0/giphy.gif'
  ],
  message_notification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moments
CREATE TABLE moments (
  id SERIAL PRIMARY KEY,
  poster_id INTEGER REFERENCES users(id),
  text TEXT,
  image TEXT,
  user_ids_of_like INTEGER[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  poster_id INTEGER REFERENCES users(id),
  moment_id INTEGER REFERENCES moments(id),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  latest_sent_message_id INTEGER REFERENCES messages(id),
  latest_sent_message_sequence INTEGER DEFAULT 0,
  is_group BOOLEAN NOT NULL,
  group_creater_id INTEGER REFERENCES users(id),
  group_name VARCHAR(255) DEFAULT '',
  group_image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation Members
CREATE TABLE conversation_users (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  user_id INTEGER REFERENCES users(id)
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  sender_id INTEGER REFERENCES users(id),
  sequence INTEGER NOT NULL,
  text TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convo Info Of User
CREATE TABLE convo_info_of_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  conversation_id INTEGER REFERENCES conversations(id),
  last_read_message_sequence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connections
CREATE TABLE connections (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  group_conversation_id INTEGER REFERENCES conversations(id),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
