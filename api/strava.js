// api/strava.js — Vercel Serverless Function
// Proxies Strava API calls, auto-refreshes access token, handles CORS

export default async function handler(req, res) {
  // Allow your site (and localhost for testing) to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const accessToken = await getValidToken();
    const endpoint = req.query.endpoint || 'athlete/activities';
    const perPage = req.query.per_page || '50';

    const stravaRes = await fetch(
      `https://www.strava.com/api/v3/${endpoint}?per_page=${perPage}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!stravaRes.ok) {
      const err = await stravaRes.json();
      return res.status(stravaRes.status).json({ error: err });
    }

    const data = await stravaRes.json();
    // Cache for 15 minutes on CDN edge
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (err) {
    console.error('Strava proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getValidToken() {
  // Use environment variables set in Vercel dashboard
  const clientId     = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Strava environment variables. Check Vercel settings.');
  }

  // Always refresh — serverless functions are stateless
  // Strava refresh tokens are long-lived and don't expire on use
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Token refresh failed: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  return data.access_token;
}
