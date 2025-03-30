const express = require('express');
const dotenv = require('dotenv');
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // Import child_process to execute scripts
const recommendRoute = require('./routes/prompt');
const geojsonRoute = require('./routes/geojson'); // Import the new route

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    credentials: true,
}));

app.use(express.json());
app.use('/api/prompt', recommendRoute);
// app.use('/api/geojson', geojsonRoute); // Add the new route

// Endpoint to handle JSON updates
app.post("/api/update-json", (req, res) => {
  const { location, category, description, priceRange } = req.body;

  // Format the data as a single string
  const formattedData = `${location}; ${category}; ${description}`;

  // Write the data to test-prompt.json
  const outputDir = __dirname;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "test-prompt.json");
  fs.writeFile(outputPath, JSON.stringify({ prompt: formattedData }, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }
    res.status(200).json({ message: "File updated successfully" });
  });
});

// Endpoint to run test.js
app.post("/api/run-test", (req, res) => {
  // Execute the test.js file using Node.js
  exec("node test.js", { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing test.js: ${error.message}`);
      return res.status(500).json({ message: "Failed to execute test.js", error: error.message });
    }

    if (stderr) {
      console.error(`Error output from test.js: ${stderr}`);
      return res.status(500).json({ message: "Error in test.js execution", error: stderr });
    }

    console.log(`Output from test.js: ${stdout}`);
    res.status(200).json({ message: "test.js executed successfully", output: stdout });
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
