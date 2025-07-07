const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Ask OpenAI for feedback
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a career coach and resume expert." },
        { role: "user", content: `Please analyze this resume and provide feedback and suggestions:\n\n${resumeText}` }
      ],
      max_tokens: 500,
    });

    fs.unlinkSync(pdfPath);

    res.json({ feedback: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume analysis failed' });
  }
});

module.exports = router;
