import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function tick() {
  const { rows } = await pool.query(
    "select id, source_ref, transcript, tags from transcript_ingest where status='pending_review' order by created_at asc limit 10"
  );

  for (const row of rows) {
    await pool.query(
      "update transcript_ingest set status='ready_for_review' where id=$1",
      [row.id]
    );
  }
}

setInterval(() => {
  tick().catch(err => console.error(err));
}, 10000);

console.log('worker started');
