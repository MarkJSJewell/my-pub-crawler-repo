export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = process.env.MAPBOX_ACCESS_TOKEN;
  const { lng, lat, type } = req.body;

  if (!token) {
    return res.status(500).json({ error: 'Mapbox Token missing in server environment' });
  }

  // Helper function to fetch data
  const fetchMapbox = async (query) => {
    // We use "limit=50" to get maximum candidates
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${lng},${lat}&types=poi&limit=50&access_token=${token}`;
    const apiRes = await fetch(url);
    return await apiRes.json();
  };

  try {
    // 1. First Try: Search for the specific term (e.g., "pub")
    let data = await fetchMapbox(type);

    // 2. Fallback: If "pub" returns nothing (common in Mapbox), try "bar"
    // "bar" is a broader category in Mapbox's index that captures most pubs
    if (!data.features || data.features.length === 0) {
      if (type === 'pub') {
         console.log("Retrying search with 'bar'...");
         data = await fetchMapbox('bar');
      }
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Mapbox API Error:', error);
    res.status(500).json({ error: 'Failed to fetch from Mapbox' });
  }
}