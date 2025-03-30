const express = require('express');
const dotenv = require('dotenv');
const recommendRoute = require('./routes/prompt');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/api/prompt', recommendRoute);

app.listen(PORT, () => {
  
  console.log(`Server running on port ${PORT}`);
});
