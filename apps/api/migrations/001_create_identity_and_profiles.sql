-- Zelora identity foundation.
-- Firebase remains the credential provider; passwords are never stored here.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(320),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  display_name VARCHAR(120) NOT NULL,
  account_status VARCHAR(16) NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(16) NOT NULL CHECK (role IN ('contractor', 'professional')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role)
);

CREATE TABLE contractor_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE professional_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  public_name VARCHAR(120),
  bio VARCHAR(2000),
  profile_status VARCHAR(16) NOT NULL DEFAULT 'draft'
    CHECK (profile_status IN ('draft', 'published', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX users_account_status_idx ON users(account_status);
CREATE INDEX professional_profiles_status_idx ON professional_profiles(profile_status);

-- Deliberately excluded from this first migration:
-- CPF, phone, residential addresses, documents, payment data and message content.
-- A role/profile must be provisioned by trusted server-side application logic;
-- never accept role assignments directly from an untrusted client.
