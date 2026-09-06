CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MEMBER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  preferred_engine TEXT NOT NULL,
  passions JSONB NOT NULL DEFAULT '[]'::jsonb,
  other_passion TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL,
  portfolio TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending review',
  assigned_engine TEXT NOT NULL DEFAULT '',
  admin_note TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  value_cents INTEGER NOT NULL DEFAULT 0,
  health TEXT NOT NULL DEFAULT 'On track',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  engine TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  due_date DATE NOT NULL,
  owner_initials TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  owner_initials TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_initials TEXT NOT NULL,
  engine TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO clients (id, name, relationship_type, owner_name, value_cents, health) VALUES
  ('client-northstar', 'Northstar Studio', 'Service retainer', 'Alex Lee', 1840000, 'On track'),
  ('client-morrow', 'Morrow House', 'Asset license / Product', 'Jordan Kim', 960000, 'On track'),
  ('client-field-notes', 'Field Notes Co.', 'Campaign / Launch', 'Alex Lee', 1280000, 'Needs review'),
  ('client-common-ground', 'Common Ground', 'Media / Advisory', 'Rae King', 620000, 'Waiting')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, name, client_name, engine, progress, due_date, owner_initials) VALUES
  ('project-northstar', 'Northstar identity system', 'Northstar Studio', 'Service', 78, CURRENT_DATE, 'AL'),
  ('project-atlas', 'Atlas UI Kit v2.4', 'Morrow House', 'Asset', 92, CURRENT_DATE + 3, 'JK'),
  ('project-field-notes', 'Field Notes launch campaign', 'Field Notes Co.', 'Service', 54, CURRENT_DATE + 4, 'AL'),
  ('project-signal', 'Signal / Season 01', 'Field Notes Co.', 'Media', 41, CURRENT_DATE + 13, 'RK')
ON CONFLICT (id) DO NOTHING;

INSERT INTO files (id, name, file_type, owner_initials, updated_at) VALUES
  ('file-northstar', 'Northstar / Brand system / Direction v3', 'Presentation', 'AL', NOW() - INTERVAL '2 hours'),
  ('file-morrow', 'Morrow House / License agreement', 'Contract', 'JK', NOW() - INTERVAL '1 day'),
  ('file-signal', 'Signal / Season 01 / Production brief', 'Document', 'RK', NOW() - INTERVAL '1 day'),
  ('file-field-notes', 'Field Notes / Launch assets', 'Folder', 'AL', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO approvals (id, title, context, requested_at, owner_initials, engine, status) VALUES
  ('approval-homepage', 'Homepage direction v3', 'Northstar Studio / Service', NOW() - INTERVAL '2 hours', 'NS', 'Service', 'PENDING'),
  ('approval-license', 'License renewal / Atlas UI Kit', 'Morrow House / Asset', NOW() - INTERVAL '1 day', 'MH', 'Asset', 'PENDING'),
  ('approval-picture-lock', 'Picture lock / Scene 042', 'The Long Way Home / Media', NOW() - INTERVAL '1 day', 'TH', 'Media', 'PENDING')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, invoice_number, client_name, description, amount_cents, status, due_date) VALUES
  ('invoice-1048', '#INV-1048', 'Northstar Studio', 'September retainer', 1840000, 'OPEN', CURRENT_DATE + 5),
  ('invoice-1047', '#INV-1047', 'Morrow House', 'Studio license renewal', 960000, 'PAID', CURRENT_DATE - 12),
  ('invoice-1046', '#INV-1046', 'Field Notes Co.', 'Launch campaign / Milestone 02', 640000, 'OPEN', CURRENT_DATE + 9)
ON CONFLICT (id) DO NOTHING;
