const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3030';
const adId = process.env.AD_ID || '120246154998080636';
const apiKey = process.env.ADS_API_KEY || '';

const headers = {};
if (apiKey) headers.authorization = `Bearer ${apiKey}`;

const response = await fetch(`${baseUrl}/ads/ads/${adId}`, { headers });
const body = await response.json();

console.log(JSON.stringify(body, null, 2));
if (!response.ok || body.ok === false) process.exit(1);
