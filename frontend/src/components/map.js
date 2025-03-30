import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the mapbox CSS
// Access environment variables directly from process.env

function Map({ geoJsonData }) {
    
    useEffect(() => {
        if (!geoJsonData) return;

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/ansnn/cm8v53tl6007901s09lck52di',
            // style: 'mapbox://styles/mapbox/streets-v12',
            center: [-79.3832, 43.6532], // Toronto, Ontario coordinates [lng, lat]
            zoom: 5, // Initial zoom level
            // pitch: 45, // Initial pitch (tilt) angle in degrees
        });

        if (map && map.getSource('live-points')) {
            map.getSource('live-points').setData(geoJsonData);
          }
        
          map.on('load', () => {
            map.addSource('live-points', {
                type: 'geojson',
                data: geoJsonData || {
                    type: 'FeatureCollection',
                    features: [],
                },
            })

        // Add a glow effect layer (underneath the points)
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
        
        // Add the main points layer on top
        map.addLayer({
            id: 'live-points-layer',
            type: 'circle',
            source: 'live-points',
            paint: {
            'circle-radius': 8,
            'circle-color': '#EE1D52', //make this dynamic depending on the type of point 
            },
        })
        
        map.on('click', 'live-points-layer', (event) => {
            // Get the clicked feature
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
                            data-video-id="${videoId}" style="width: 100%; max-width: 250px;">
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

        // Change cursor to pointer when hovering over live points
        map.on('mouseenter', 'live-points-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change cursor back when leaving live points
        map.on('mouseleave', 'live-points-layer', () => {
            map.getCanvas().style.cursor = '';
        });
        });
        
        return () => map.remove();
    }, [geoJsonData]);

    return (
        <div
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
            id="map"   
        >
            {/* Add styling for TikTok embeds */}
            <style>{`
                .tiktok-embed-container {
                    width: 300px !important;
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
    )
}

export default Map;