const fs = require('fs');
const http = require('http');

// Remove node-fetch since you're using http.request
// const fetch = require('node-fetch');

const data = JSON.parse(fs.readFileSync('./test-prompt.json', 'utf8'));
const postData = JSON.stringify(data);

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/prompt',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        try {
            // Store the raw response data
            fs.writeFileSync('retrievedData.json', responseData);
            
            const result = JSON.parse(responseData);
            
            // Create GeoJSON structure
            const geoJson = {
                type: "FeatureCollection",
                features: []
            };
            
            if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
                const content = result.choices[0].message.content;
                
                // Split into individual recommendations
                const recommendations = content.split(/\n(?=\d+\. Name:)/);
                
                recommendations.forEach(rec => {
                    if (rec.trim()) {
                        const nameMatch = rec.match(/Name: (.+?)(\n|$)/);
                        const linkMatch = rec.match(/TikTok link: (.+?)(\n|$)/);
                        const addressMatch = rec.match(/Address: (.+?)(\n|$)/);
                        const coordMatch = rec.match(/Coordinates: (.+?)(\n|$)/);
                        
                        if (nameMatch && linkMatch && addressMatch && coordMatch) {
                            // Parse coordinates from string like "37.7749, -122.4194"
                            const coordString = coordMatch[1].trim();
                            const [lat, lng] = coordString.split(',').map(coord => parseFloat(coord.trim()));
                            
                            // Create GeoJSON feature
                            const feature = {
                                type: "Feature",
                                properties: {
                                    name: nameMatch[1].trim(),
                                    tiktokLink: linkMatch[1].trim(),
                                    address: addressMatch[1].trim()
                                },
                                geometry: {
                                    type: "Point",
                                    // GeoJSON uses [longitude, latitude] order
                                    coordinates: [lng, lat]
                                }
                            };
                            
                            geoJson.features.push(feature);
                        }
                    }
                });
                
                // Write GeoJSON to file
                fs.writeFileSync('places.geojson', JSON.stringify(geoJson, null, 2));
                console.log('GeoJSON file created: places.geojson');
            }
        } catch (err) {
            console.error('Error processing data:', err);
        }
    });
});

req.on('error', (error) => {
    console.error('Request failed:', error.message);
});

req.write(postData);
req.end();