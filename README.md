🍺 Pub Crawl Planner
A smart web application for planning walking pub crawl routes. This app supports multiple map providers (Google Maps, Mapbox, Geoapify) and routing strategies, designed with a specific focus on API cost optimization via a serverless architecture.

🚀 Features
Multi-Provider Support: Choose between Google Maps (best data), Mapbox (best visuals), or Geoapify (most affordable).

Smart Routing:

Shortest Walk: Linear efficient path.

Circular: "Boomerang" logic that routes you back to your start location.

Most Popular: (Google only) Prioritizes highly-rated venues.

Risk Analysis Engine: Automatically scans routes for potential issues (e.g., "This stop looks like a restaurant, not a pub" or "This venue opens late").

Eco Mode (Cost Control): A toggle in the Google Maps version that switches to a "Basic Tier" backend, reducing API costs by ~50% by disabling expensive data fields (Ratings/Hours).
