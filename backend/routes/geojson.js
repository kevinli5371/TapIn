const express = require('express');
const fs = require('fs');
const router = express.Router();

router.post('/', (req, res) => {
    try {
        const data = req.body;

        // Create GeoJSON structure
        const geoJson = {
            type: "FeatureCollection",
            features: []
        };

        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            const content = data.choices[0].message.content;

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
            const outputDir = '../frontend/src'; // Change this to your desired directory

            // Create the directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Write the file to the specified directory
            const outputPath = `${outputDir}/places.geojson`;
            fs.writeFileSync(outputPath, JSON.stringify(geoJson, null, 2));
            console.log(`GeoJSON file created: ${outputPath}`);

            res.status(200).json({ message: 'GeoJSON file created successfully', path: outputPath });
        } else {
            res.status(400).json({ error: 'Invalid data format' });
        }
    } catch (err) {
        console.error('Error processing data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;