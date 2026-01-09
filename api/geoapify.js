export default async function handler(req, res) {
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
    return res.status(500).json({ error: 'Server Error: Geoapify API Key is missing.' });
  }

  const { type, text, lat, lon, radius, categories, waypoints } = req.body;

  try {
    let url = '';

    if (type === 'geocode') {
      if (!text) throw new Error("Search text is missing");
      url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
    } 
    else if (type === 'places') {
      if (!lat || !lon) throw new Error("Coordinates missing for place search");
      const searchRadius = radius || 2000;
      url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${searchRadius}&limit=50&apiKey=${apiKey}`;
    } 
    else if (type === 'routing') {
      // New: Calculate actual street path
      // waypoints format: "lat1,lon1|lat2,lon2|..."
      if (!waypoints) throw new Error("Waypoints missing for routing");
      url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=walk&details=instruction_details&apiKey=${apiKey}`;
    }
    else {
      return res.status(400).json({ error: 'Invalid request type.' });
    }

    const apiRes = await fetch(url);
    
    if (!apiRes.ok) {
        const errText = await apiRes.text();
        console.error("Geoapify API Error:", errText);
        throw new Error(`Geoapify Failed: ${apiRes.status} ${errText}`);
    }

    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Backend Handler Error:', error);
    res.status(500).json({ error: error.message });
  }
}
