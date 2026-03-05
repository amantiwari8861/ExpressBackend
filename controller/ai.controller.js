const openAiClient = require("../config/openai");
const fs = require("fs");
const path = require("path");
const chatMemory = [
  {
    role: "system",
    content:
      "Respond in a professional, neutral technical tone. and output should be approx 20 words long.",
  },
];
exports.chat = async (req, res) => {
  const { message } = req.body;
  chatMemory.push({
    role: "user",
    content: message,
  });
  const response = await openAiClient.responses.create({
    model: "gpt-5.2",
    input: chatMemory,
  });
  chatMemory.push({
    role: "assistant",
    content: response.output_text,
  });
  console.log(chatMemory);
  res.status(200).send({ status: true, message: response.output_text });
};
exports.sentimentAnalysis = async (req, res) => {
  const { comment } = req.body;
  const response = await openAiClient.responses.create({
    model: "gpt-5-mini",
    input: `Give me 1 Word Answer that given comment is Positive,Negative or Neutral. """${comment}"""`,
  });
  res.status(200).send({ status: true, sentiment: response.output_text });
};
exports.generateImage = async (req, res) => {
  console.log("generating image....");

  const { prompt } = req.body;
  const result = await openAiClient.images.generate({
    model: "gpt-image-1",
    prompt,
  });

  // Save the image to a file
  const b64_json = result.data[0].b64_json;
  console.log("image generated!....");

  const imagesDir = path.join(__dirname, "..", "images");

  // ✅ Ensure directory exists (safe)
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  const image_bytes = Buffer.from(b64_json, "base64");

  fs.writeFileSync(path.join(imagesDir, Date.now() + ".png"), image_bytes);
  res.status(201).send({ status: true, b64_json });
};

// const { GoogleGenAI } = require("@google/genai");
// const fs = require("fs");
// const path = require("path");

// exports.generateNanoBananaImage = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     const response = await ai.models.generateContent({
//       model: process.env.GEMINI_MODEL, // e.g. "gemini-1.5-flash"
//       contents: prompt,
//       // For image generation models use appropriate model like:
//       // model: "gemini-1.5-pro"
//     });

//     const candidate = response.candidates?.[0];
//     if (!candidate?.content?.parts) {
//       throw new Error("No image generated in the response.");
//     }

//     for (const part of candidate.content.parts) {
//       if (part.inlineData) {
//         const base64String = part.inlineData.data;
//         const buffer = Buffer.from(base64String, "base64");

//         const fileName = `${Date.now()}.png`;
//         const filePath = path.join(__dirname, "..", "images", fileName);

//         if (!fs.existsSync(path.dirname(filePath))) {
//           fs.mkdirSync(path.dirname(filePath), { recursive: true });
//         }

//         fs.writeFileSync(filePath, buffer);

//         return res.json({
//           message: "Image generated successfully",
//           base_64: base64String,
//           filePath,
//         });
//       }
//     }

//     return res.status(500).json({ error: "No image data found." });

//   } catch (error) {
//     console.error("❌ Error:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };
