-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  phone VARCHAR,
  password VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'member',
  isActive BOOLEAN NOT NULL DEFAULT true,
  refreshToken VARCHAR,
  profileImage VARCHAR,
  dateOfBirth DATE,
  address VARCHAR,
  emailVerified BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now()
);

-- Create memberships table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  price DECIMAL NOT NULL,
  duration INTEGER NOT NULL,
  type VARCHAR NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  benefits JSONB,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now(),
  userId UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  dayOfWeek VARCHAR NOT NULL,
  maxParticipants INTEGER NOT NULL DEFAULT 20,
  isActive BOOLEAN NOT NULL DEFAULT true,
  equipment JSONB,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now(),
  trainerId UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  isCancelled BOOLEAN NOT NULL DEFAULT false,
  hasAttended BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  userId UUID REFERENCES users(id) ON DELETE SET NULL,
  classId UUID REFERENCES classes(id) ON DELETE SET NULL,
  membershipId UUID REFERENCES memberships(id) ON DELETE SET NULL
);

-- Create routines table
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  difficulty VARCHAR NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT true,
  goals JSONB,
  notes JSONB,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP NOT NULL DEFAULT now(),
  userId UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  restTime INTEGER,
  description TEXT,
  notes JSONB,
  measurementType VARCHAR NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  routineId UUID REFERENCES routines(id) ON DELETE SET NULL
);

-- Create progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  weight DECIMAL,
  bodyFatPercentage DECIMAL,
  muscleMass DECIMAL,
  measurements JSONB,
  notes JSONB,
  createdAt TIMESTAMP NOT NULL DEFAULT now(),
  userId UUID REFERENCES users(id) ON DELETE SET NULL,
  exerciseId UUID REFERENCES exercises(id) ON DELETE SET NULL
);
