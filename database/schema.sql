-- Crear tablas para el sistema de votaciones OG Awards

-- Tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de premios/categorías
CREATE TABLE awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de nominados
CREATE TABLE nominees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  award_id UUID REFERENCES awards(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de votos
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  award_id UUID REFERENCES awards(id) ON DELETE CASCADE,
  rankings TEXT[] NOT NULL, -- Array de IDs de nominados en orden de preferencia
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, award_id) -- Un usuario solo puede votar una vez por premio
);

-- Índices para mejor rendimiento
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_award_id ON votes(award_id);
CREATE INDEX idx_nominees_award_id ON nominees(award_id);

-- Restricción para evitar votos duplicados
ALTER TABLE votes ADD CONSTRAINT check_user_award_unique 
  UNIQUE (user_id, award_id);
