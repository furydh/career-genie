const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Ask Gemini for feedback
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      `You are a career coach and resume expert. Please analyze this resume and provide concise, actionable feedback.

Format your response as:
KEY STRENGTHS: [2-3 main strengths]
AREAS FOR IMPROVEMENT: [2-3 specific areas to improve]
RECOMMENDATIONS: [2-3 actionable suggestions]

Keep it concise and professional.

Resume text:
${resumeText}`
    ]);
    const response = await result.response;
    const feedback = response.text();

    fs.unlinkSync(pdfPath);

    res.json({ feedback: feedback });
  } catch (err) {
    console.error(err);
    
    // Clean up the uploaded file
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error('Error cleaning up file:', cleanupErr);
      }
    }

    // Handle rate limit errors specifically
    if (err.status === 429) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait a moment and try again.' 
      });
    }

    res.status(500).json({ error: 'Resume analysis failed. Please try again later.' });
  }
});

router.post('/score', upload.single('resume'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Ask Gemini for scoring only
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      `You are a professional resume reviewer. Analyze this resume and provide ONLY a score out of 10.

Be specific with the score (like 7.5/10, 8.2/10, etc.) and provide a brief 1-2 sentence explanation of why you gave that score.

Format your response exactly as:
SCORE: [score]/10
REASON: [brief explanation in 1-2 sentences]

Keep it concise and professional.

Resume text:
${resumeText}`
    ]);
    const response = await result.response;
    const analysis = response.text();

    fs.unlinkSync(pdfPath);

    res.json({ analysis: analysis });
  } catch (err) {
    console.error(err);
    
    // Clean up the uploaded file
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error('Error cleaning up file:', cleanupErr);
      }
    }

    // Handle rate limit errors specifically
    if (err.status === 429) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait a moment and try again.' 
      });
    }

    res.status(500).json({ error: 'Resume scoring failed. Please try again later.' });
  }
});

module.exports = router;
