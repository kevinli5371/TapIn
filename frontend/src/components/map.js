import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
// Access environment variables directly from process.env

function Map() {
    const mapContainerRef = useRef(null);
    
    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40], // Initial map center [lng, lat]
            zoom: 9, // Initial zoom level
            attributionControl: false, // Disable the default attribution control
        });
        return () => map.remove();
    }, []);

    return (
        <div
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
            ref={mapContainerRef}   
        />
    )
}

export default Map;