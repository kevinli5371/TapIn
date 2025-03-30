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
            center: [-87.6298, 41.8781], // Chicago, Illinois coordinates [lng, lat]
            zoom: 14.5, // Initial zoom level
            pitch: 45, // Initial pitch (tilt) angle in degrees
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
            
            // Create and display the popup for the live point
            new mapboxgl.Popup({ offset: [0, -15] })
                .setLngLat(feature.geometry.coordinates)
                .setHTML(`
                    <h3>${feature.properties.name || 'Live Point'}</h3>
                    <p>${feature.properties.tiktokLink || 'No description available'}</p>
                `)
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
        />
    )
}

export default Map;