create table if not exists inbound_events (
  id bigserial primary key,
  source text not null,
  raw_payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists transcript_ingest (
  id bigserial primary key,
  source_ref text not null,
  transcript text not null,
  tags jsonb default '{}'::jsonb,
  status text not null default 'pending_review',
  created_at timestamptz default now()
);
