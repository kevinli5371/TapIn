import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import the mapbox CSS
// Access environment variables directly from process.env

function Map() {
    
    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/ansnn/cm8uqmtkq006o01s02crtekl0',
            center: [-87.6298, 41.8781], // Chicago, Illinois coordinates [lng, lat]
            zoom: 15, // Initial zoom level
            pitch: 45, // Initial pitch (tilt) angle in degrees
        });
        
        map.on('click', (event) => {
            const features = map.queryRenderedFeatures(event.point, {
                layers: ['chicago-parks-test3'], // Replace with your layer name
            });

            if (!features.length) {
                return;
            }
            const feature = features[0]; // Declare 'feature' using 'const'

            // Create and display the popup
            new mapboxgl.Popup({ offset: [0, -15] })
                .setLngLat(event.lngLat)
                .setHTML(`
                    <h3>${feature.properties.NAME || 'Park'}</h3>
                    <p>${feature.properties.description || 'No description available'}</p>
                `)
                .addTo(map);
        });
        return () => map.remove();
    }, []);

    return (
        <div
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
            id="map"   
        />
    )
}

export default Map;