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
                map.on('click', 'live-points-layer', (event) => {
                    const feature = event.features[0];
                    
                    // Create a container for the popup content
                    const container = document.createElement('div');
                    
                    // Add the title and description
                    container.innerHTML = `
                        <h3>${feature.properties.name || 'Live Point'}</h3>
                        <p>${feature.properties.address || 'No address available'}</p>
                    `;
                    
                    // Create a div for the TikTok embed
                    const embedDiv = document.createElement('div');
                    embedDiv.className = 'tiktok-embed-container';
                    
                    // Transform the TikTok link into an embed code
                    const tiktokLink = feature.properties.tiktokLink;
                    if (tiktokLink) {
                        // Extract video ID from TikTok URL - handles various TikTok URL formats
                        let videoId = '';
                        
                        // Parse the URL to extract the video ID
                        if (tiktokLink.includes('/video/')) {
                            videoId = tiktokLink.split('/video/')[1].split('?')[0];
                        }
                        
                        if (videoId) {
                            embedDiv.innerHTML = `
                                <blockquote class="tiktok-embed" cite="${tiktokLink}" 
                                    data-video-id="${videoId}" style="width: 100%; max-width: 350px;">
                                    <section></section>
                                </blockquote>
                            `;
                            
                            // Add the TikTok embed script
                            const script = document.createElement('script');
                            script.src = 'https://www.tiktok.com/embed.js';
                            script.async = true;
                            
                            // Append the embed div and script to the container
                            container.appendChild(embedDiv);
                            container.appendChild(script);
                        } else {
                            // If we couldn't parse the video ID, just show the link
                            container.innerHTML += `<p><a href="${tiktokLink}" target="_blank">View on TikTok</a></p>`;
                        }
                    }
                    
                    // Create and display the popup with the custom container
                    new mapboxgl.Popup({ offset: [0, -15], maxWidth: '350px' })
                        .setLngLat(feature.geometry.coordinates)
                        .setDOMContent(container)
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
            id="map"   
        >
            {/* Add styling for TikTok embeds */}
            <style>{`
                .tiktok-embed-container {
                    width: 500px !important;
                    max-width: 100%;
                    overflow: hidden;
                    margin-top: 10px;
                }
                
                .tiktok-embed-container blockquote {
                    max-width: 100% !important;
                    margin: 0;
                }
                
                .mapboxgl-popup-content {
                    padding: 15px;
                    max-width: 350px;
                }
                
                .mapboxgl-popup-content h3 {
                    margin-top: 0;
                    margin-bottom: 8px;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
}

export default Map;