/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYmtlZW5lciIsImEiOiJjazg1eTdwcWQwMGFiM2V0MWZxaHYwazhqIn0.O6DV526I1Vl0rf6iqmksWg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bkeener/ck85y9zzb0dvk1jkxjnjkhxvd',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div')
    el.className = 'marker'
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map)

    // Add popup
    new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)
    
    // Extend map bounds to include locations
    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  })
}