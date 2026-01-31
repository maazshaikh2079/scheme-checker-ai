import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getEligibilityResults = async (userData) => {
  const model = "gemini-2.5-flash";

  const config = {
    // Enable Google Search to research specific occupations typed by the user
    tools: [{ googleSearch: {} }],
    systemInstruction: `
        # ROLE
        You are the "Bharat Welfare Expert," a high-precision AI specialized in Indian Government Scheme Eligibility.

        # DYNAMIC RESEARCH PROTOCOL
        1. If the user provides a specific occupation (e.g., "Mochi", "Zari Worker", "Gig Worker"), use Google Search to verify if that trade falls under:
           - The 18 identified trades of **PM Vishwakarma**.
           - The unorganized worker category for **PM-SYM** or **APY**.
           - State-specific artisan boards (especially for UP, Maharashtra, etc.).
        2. Use current 2026 data to ensure schemes haven't been renamed or updated.

        # CRITICAL LOGIC RULES (2026 UPDATE)
        1. **Universal Senior Health Rule:** Under Ayushman Bharat (PM-JAY), any citizen aged 70 or above is UNIVERSALLY ELIGIBLE for a ₹5 Lakh health cover, regardless of income.
        2. **Strict Pension Enrollment Age Gates:**
           - Entry Age window for APY and PM-SYM is strictly **18 to 40 years**.
           - Age 41+ = Ineligible to join.
        3. **Monthly Income Threshold for PM-SYM:** Monthly income must be **₹15,000 or below**.
        4. **Occupation-Specific Logic:** Match typed occupations to official categories (e.g., "Blacksmith" -> PM Vishwakarma).

        # KNOWLEDGE BASE BREADTH
        1. PM-Kisan, PM-JAY (70+ Universal), PM SVANidhi, PM Vishwakarma, APY, PM-SYM, PM Ujjwala, Student Scholarships.

        # OUTPUT FORMAT (Strict JSON)
        Return ONLY a valid JSON object.
        {
          "user_summary": "Description including findings from occupation research",
          "eligible_schemes": [
            {
              "scheme_name": "Name",
              "benefit": "Details",
              "reasoning": "Explain research findings (e.g., 'Google Search confirms this trade is covered under...')",
              "action_step": "How to apply"
            }
          ],
          "not_eligible_notices": ["Reasons for exclusion"],
          "disclaimer": "Standard disclaimer"
        }
    `,
    temperature: 0.1,
  };

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Research and analyze eligibility for: Age ${userData.age}, Income ${userData.income}, State ${userData.state}, Occupation ${userData.occupation}`,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    // Extract text from the AI response
    const text = response.text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Eligibility Service Error:", error.message);
    throw new Error("AI Logic failed to process eligibility.");
  }
};

// --- Local Testing Block ---
// Run with: node src/services/eligibility.service.js
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const testUser = {
    age: 24,
    income: 80000,
    state: "Bihar",
    occupation: "Artisan (Pottery)",
  };
  getEligibilityResults(testUser).then((res) =>
    console.log(JSON.stringify(res, null, 2))
  );
}

export const checkEligibility = async (req, res) => {
  try {
    const { age, income, state, occupation } = req.body;

    if (!age || income === undefined || !state || !occupation) {
      return res.status(400).json({
        error: "Missing required fields: age, income, state, or occupation.",
      });
    }

    const results = await getEligibilityResults({
      age,
      income,
      state,
      occupation,
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Route Error:", error.message);
    return res.status(500).json({
      error: "An internal server error occurred while processing eligibility.",
    });
  }
};
