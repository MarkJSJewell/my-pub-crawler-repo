export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Geoapify API Key missing' });
  }

  const { type, text, lat, lon, radius, categories } = req.body;

  try {
    let url = '';

    if (type === 'geocode') {
      url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
    } 
    else if (type === 'places') {
      // Geoapify expects "lon,lat" for the circle filter
      url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&limit=50&apiKey=${apiKey}`;
    }

    const apiRes = await fetch(url);
    
    // Check if Geoapify returned an error
    if (!apiRes.ok) {
        const errText = await apiRes.text();
        throw new Error(`Geoapify API Error: ${apiRes.status} ${errText}`);
    }

    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ error: error.message });
  }
}
