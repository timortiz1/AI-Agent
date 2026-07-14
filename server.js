import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.get('/health', async (_req, res) => {
  try {
    const result = await pool.query('select now()');
    res.json({ ok: true, db: !!result.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/webhooks/ringcentral', async (req, res) => {
  const validationToken = req.header('Validation-Token');
  if (validationToken) {
    res.set('Validation-Token', validationToken);
    return res.status(200).send('Validation token echoed');
  }

  const payload = req.body;
  await pool.query(
    'insert into inbound_events(raw_payload, source) values ($1, $2)',
    [payload, 'ringcentral']
  );

  res.status(200).json({ received: true });
});

app.post('/ingest/transcript', async (req, res) => {
  const { sourceRef, transcript, tags } = req.body;
  await pool.query(
    'insert into transcript_ingest(source_ref, transcript, tags, status) values ($1, $2, $3, $4)',
    [sourceRef, transcript, tags || {}, 'pending_review']
  );
  res.status(200).json({ ok: true, sourceRef });
});

app.listen(process.env.PORT || 10000, () => {
  console.log('bestbuy-bot-api running');
});
