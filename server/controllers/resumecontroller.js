const fs = require('fs');
const axios = require('axios');

exports.uploadResume = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const apiKey = process.env.RESUME_IO_API_KEY;
    const apiUrl = 'https://api.resume.io/v1/parse'; // Example endpoint, update if needed

    // Read the PDF file
    const fileData = fs.readFileSync(pdfPath);
    const formData = new FormData();
    formData.append('file', fileData, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Send to resume.io API
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${apiKey}`
      }
    });

    fs.unlinkSync(pdfPath);
    res.json({ analysis: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze resume', details: err.message });
  }
};
