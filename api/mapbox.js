export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { lng, lat, type } = req.body;
  const token = process.env.MAPBOX_ACCESS_TOKEN; // Add to Vercel Env Vars

  // Example for POI search
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${type}.json?proximity=${lng},${lat}&types=poi&limit=50&access_token=${token}`;

  const apiRes = await fetch(url);
  const data = await apiRes.json();
  res.status(200).json(data);
}