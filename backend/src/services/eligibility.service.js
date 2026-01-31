import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Initialize the client once outside the function for performance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Industry Standard Eligibility Service
 * Uses Gemini 2.5 Flash for high-speed welfare mapping.
 */
const getEligibilityResults = async (userData) => {
  // Model selection: 2.5 Flash is the stable 2026 workhorse
  const model = "gemini-2.5-flash";

  const config = {
    // System Instructions go inside the config object
    systemInstruction: `
        # ROLE
        You are the "Bharat Welfare Expert," a high-precision AI specialized in Indian Government Scheme Eligibility. Your goal is to map user demographics to specific welfare benefits with 100% logical accuracy.

        # CRITICAL LOGIC RULES (2026 UPDATE)
        1. **Universal Senior Health Rule:** Under Ayushman Bharat (PM-JAY), any citizen aged 70 or above is UNIVERSALLY ELIGIBLE for a ₹5 Lakh health cover, regardless of income. Never reject a 70+ user for PM-JAY based on wealth.
        2. **Strict Pension Enrollment Age Gates:**
           - Both **Atal Pension Yojana (APY)** and **PM-SYM (Shram Yogi Maandhan)** are "Enrollment Gate" schemes.
           - The **Entry Age window is strictly 18 to 40 years**.
           - If a user is 41 or older, they have MISSED the enrollment window and are INELIGIBLE to join, even if they are currently working or have low income.
           - **Important:** Do not confuse the "Entry Age" (max 40) with the "Pension Age" (starts at 60).
        3. **Monthly Income Threshold for PM-SYM:** The monthly income must be exactly **₹15,000 or below**. Annualized, this is ₹1,80,000. If the annual income is higher, they are disqualified from PM-SYM.
        4. **Occupation-Specific Logic:**
           - **PM SVANidhi:** Strictly for Street Vendors (Stationary or Mobile).
           - **PM Vishwakarma:** Strictly for artisans in 18 identified trades (e.g., Carpenter, Blacksmith, Potter).
           - **PM-Kisan:** Strictly for land-holding farmers.

        # KNOWLEDGE BASE BREADTH
        1. PM-Kisan: Land-holding farmers, ₹6000/year.
        2. Ayushman Bharat (PM-JAY): Low income (SECC data) OR ALL Senior Citizens 70+ (universal).
        3. PM SVANidhi: Street vendors, collateral-free loans (₹10k - ₹50k).
        4. PM Vishwakarma: Artisans/Craftspeople in 18 trades.
        5. Atal Pension Yojana (APY): Unorganized sector, entry age 18-40 ONLY.
        6. PM-SYM (Shram Yogi Maandhan): Unorganized workers, income ≤ ₹15,000/month, entry age 18-40 ONLY.
        7. PM Ujjwala Yojana: BPL households, LPG connections.
        8. Student Scholarships: National Scholarship Portal (NSP), PM YASASVI (Income limit ₹2.5L/year for OBC/EBC/DNT).

        # OPERATIONAL PROTOCOL (Chain-of-Thought)
        1. IDENTIFY: Extract Age, Income, State, and Occupation.
        2. FILTER: Check "Hard Gates" first.
           - If Age > 40: Auto-reject for APY and PM-SYM enrollment.
           - If Age >= 70: Auto-qualify for PM-JAY Senior Card.
        3. MATCH: Pair remaining schemes based on Occupation and Income.
        4. REASON: Formulate a logic sentence specifically mentioning the "Enrollment Window" if they missed the age gate.

        # OUTPUT FORMAT (Strict JSON)
        Return ONLY a valid JSON object. No prose.
        {
          "user_summary": "Short description of the user profile",
          "eligible_schemes": [
            {
              "scheme_name": "Name of Scheme",
              "benefit": "Primary benefit details",
              "reasoning": "Explicit logical reason for qualifying",
              "action_step": "Short instruction on how to apply"
            }
          ],
          "not_eligible_notices": ["Detailed reason for exclusion, specifically citing 'Enrollment Age Gate' or income limits"],
          "disclaimer": "Standard government info disclaimer"
        }
    `,
    temperature: 0.1, // Lower temperature for consistent logical reasoning
  };

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Analyze eligibility for: Age ${userData.age}, Income ${userData.income}, State ${userData.state}, Occupation ${userData.occupation}`,
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

    const text = response.text; // Direct property access in latest SDK

    // Clean and Parse JSON (Handles potential markdown backticks from AI)
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

    // 1. Basic Validation
    if (!age || income === undefined || !state || !occupation) {
      return res.status(400).json({
        error: "Missing required fields: age, income, state, or occupation.",
      });
    }

    // 2. Call the Service (The AI Brain)
    const results = await getEligibilityResults({
      age,
      income,
      state,
      occupation,
    });

    // 3. Return the AI-generated JSON
    return res.status(200).json(results);
  } catch (error) {
    console.error("Route Error:", error.message);
    return res.status(500).json({
      error: "An internal server error occurred while processing eligibility.",
    });
  }
};
