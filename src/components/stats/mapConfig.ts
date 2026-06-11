// Shared viewBox for the donor district map. The d3 projection runs server-side
// (DonorMapSection) into this coordinate space; the client only renders the
// resulting path strings, so d3-geo and the ~700KB GeoJSON never reach the browser.
export const MAP_WIDTH = 460
export const MAP_HEIGHT = 640
