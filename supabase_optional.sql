-- OPSIONAL: skema awal jika dosen mewajibkan Supabase.
create table if not exists profiles (
  id uuid primary key,
  name text,
  created_at timestamptz default now()
);
create table if not exists questions (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  tag text,
  author_id uuid,
  created_at timestamptz default now()
);
create table if not exists answers (
  id bigint generated always as identity primary key,
  question_id bigint references questions(id) on delete cascade,
  body text not null,
  author_id uuid,
  created_at timestamptz default now()
);
