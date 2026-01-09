export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight check
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: Geoapify API Key is missing.' });
  }

  const { type, text, lat, lon, radius, categories } = req.body;

  try {
    let url = '';

    if (type === 'geocode') {
      if (!text) throw new Error("Search text is missing");
      url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
    } 
    else if (type === 'places') {
      if (!lat || !lon) throw new Error("Coordinates missing for place search");
      // Fix: Ensure radius is a number
      const searchRadius = radius || 2000;
      url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${searchRadius}&limit=50&apiKey=${apiKey}`;
    } 
    else {
      return res.status(400).json({ error: 'Invalid request type. Must be "geocode" or "places".' });
    }

    // Fetch from Geoapify
    const apiRes = await fetch(url);
    
    // Check if the external API failed (e.g. 401 Unauthorized)
    if (!apiRes.ok) {
        const errText = await apiRes.text();
        console.error("Geoapify API Error:", errText);
        throw new Error(`Geoapify Failed: ${apiRes.status} ${errText}`);
    }

    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Backend Handler Error:', error);
    // Return JSON error so frontend doesn't crash with "Unexpected token <"
    res.status(500).json({ error: error.message });
  }
}
