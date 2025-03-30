const fetch = require('node-fetch');
const fs = require('fs');
const http = require('http');

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
            const result = JSON.parse(responseData);
            
            if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
                const content = result.choices[0].message.content;
                
                // Split into individual recommendations
                const recommendations = content.split(/\n(?=\d+\. Name:)/);
                
                console.log('TikTok Recommendations:');
                recommendations.forEach(rec => {
                    if (rec.trim()) {
                        const nameMatch = rec.match(/Name: (.+?)(\n|$)/);
                        const linkMatch = rec.match(/TikTok link: (.+?)(\n|$)/);
                        const addressMatch = rec.match(/Address: (.+?)(\n|$)/);
                        const coordMatch = rec.match(/Coordinates: (.+?)(\n|$)/);
                        
                        if (nameMatch && linkMatch && addressMatch && coordMatch) {
                            console.log(rec.trim() + '\n');
                        } else {
                            console.log('Incomplete recommendation:', rec.trim());
                        }
                    }
                });
            } else if (result.citations && result.citations.length > 0) {
                console.log('TikTok Links (full details not available):');
                result.citations.forEach((url, index) => {
                    console.log(`${index + 1}. TikTok link: ${url}`);
                });
            } else {
                console.log('No recommendations found in the response');
            }
        } catch (err) {
            console.error('Error parsing response:', err);
            console.log('Raw response:', responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('Request failed:', error.message);
});

req.write(postData);
req.end();