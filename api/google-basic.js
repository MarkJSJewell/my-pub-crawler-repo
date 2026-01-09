export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { location, radius } = req.body;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const [lat, lng] = location.split(',');

  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      // CRITICAL: Basic Fields ONLY. No Ratings.
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location'
    },
    body: JSON.stringify({
      includedTypes: ['bar', 'pub'],
      locationRestriction: {
        circle: { center: { latitude: parseFloat(lat), longitude: parseFloat(lng) }, radius: parseFloat(radius) }
      }
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}