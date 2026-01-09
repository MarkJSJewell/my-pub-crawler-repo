export default async function handler(req, res) {
  // 1. CORS Headers (Allows your frontend to talk to this backend)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Geoapify API Key missing in Vercel Settings' });
  }

  const { type, text, lat, lon, radius, categories } = req.body;

  try {
    let url = '';

    // --- CASE A: GEOCODING (Convert Address -> Lat/Lon) ---
    if (type === 'geocode') {
      // We assume UK/Europe context if the user inputs a short postcode, 
      // but standard text search works globally.
      url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
    } 
    
    // --- CASE B: PLACES SEARCH (Find Pubs near Lat/Lon) ---
    else if (type === 'places') {
      // Note: Geoapify takes "lon,lat" for circles, not "lat,lon"
      url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&limit=50&apiKey=${apiKey}`;
    } else {
        return res.status(400).json({ error: 'Invalid request type' });
    }

    // 3. Fetch from Geoapify
    const apiRes = await fetch(url);
    const data = await apiRes.json();

    res.status(200).json(data);

  } catch (error) {
    console.error('Geoapify Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
