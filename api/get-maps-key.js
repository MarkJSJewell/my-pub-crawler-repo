// api/get-maps-key.js
export default function handler(req, res) {
    // 1. CORS Headers (Allow your frontend to talk to this)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Return the key securely from Vercel Environment Variables
    const key = process.env.GOOGLE_MAPS_API_KEY;

    if (!key) {
        return res.status(500).json({ error: 'API Key not configured in Vercel' });
    }

    res.status(200).json({ apiKey: key });
}
