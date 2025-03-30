import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Map({ geoJsonData }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        // Initialize map only once
        if (!isInitializedRef.current && mapContainerRef.current) {
            mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
            
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/ansnn/cm8v53tl6007901s09lck52di',
                center: [-79.3832, 43.6532],
                zoom: 5,
            });

            map.on('load', () => {
                // Add source with initial data
                map.addSource('live-points', {
                    type: 'geojson',
                    data: geoJsonData || {
                        type: 'FeatureCollection',
                        features: [],
                    },
                });

                // Add layers
                map.addLayer({
                    id: 'live-points-glow',
                    type: 'circle',
                    source: 'live-points',
                    paint: {
                        'circle-radius': 14,
                        'circle-color': '#EE1D52',
                        'circle-opacity': 0.4,
                        'circle-blur': 1
                    }
                });
                
                map.addLayer({
                    id: 'live-points-layer',
                    type: 'circle',
                    source: 'live-points',
                    paint: {
                        'circle-radius': 8,
                        'circle-color': '#EE1D52',
                    },
                });

                // Event handlers
                map.on('click', 'live-points-layer', async (event) => {
                    const feature = event.features[0];
                    const tiktokLink = feature.properties.tiktokLink;
                    
                    let content = `<h3>${feature.properties.name || 'Live Point'}</h3>`;
                    
                    if (tiktokLink) {
                        try {
                            const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokLink)}`);
                            const data = await response.json();
                            content += data.html;
                        } catch (error) {
                            content += `<p><a href="${tiktokLink}" target="_blank">View on TikTok</a></p>`;
                        }
                    } else {
                        content += `<p>No content available</p>`;
                    }
                
                    new mapboxgl.Popup({ offset: [0, -15] })
                        .setLngLat(feature.geometry.coordinates)
                        .setHTML(content)
                        .addTo(map);
                });

                map.on('mouseenter', 'live-points-layer', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', 'live-points-layer', () => {
                    map.getCanvas().style.cursor = '';
                });
            });

            mapRef.current = map;
            isInitializedRef.current = true;
        }

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                isInitializedRef.current = false;
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Separate effect for updating data
    useEffect(() => {
        if (isInitializedRef.current && mapRef.current && geoJsonData) {
            const source = mapRef.current.getSource('live-points');
            if (source) {
                source.setData(geoJsonData);
            }
        }
    }, [geoJsonData]); // This will only update when geoJsonData changes

    return (
        <div
            ref={mapContainerRef}
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
        />
    );
}

export default Map;