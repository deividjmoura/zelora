-- Identity and profiles.
-- Firebase owns credentials; this schema only stores the domain user and its
-- authorization data. No passwords, CPF, full addresses or documents yet.

CREATE TABLE roles (
  code text PRIMARY KEY,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO roles (code, description) VALUES
  ('contractor', 'Contratante'),
  ('professional', 'Profissional'),
  ('admin', 'Administrador');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL UNIQUE,
  email text,
  email_verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_firebase_uid_not_empty CHECK (length(firebase_uid) BETWEEN 1 AND 128)
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_code text NOT NULL REFERENCES roles(code) ON UPDATE CASCADE ON DELETE RESTRICT,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_code)
);

CREATE INDEX user_roles_role_code_idx ON user_roles (role_code);

CREATE TABLE contractor_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contractor_profiles_display_name_not_empty CHECK (length(display_name) BETWEEN 1 AND 120)
);

CREATE TABLE professional_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  headline text,
  bio text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT professional_profiles_display_name_not_empty CHECK (length(display_name) BETWEEN 1 AND 120)
);
