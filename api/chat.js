export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Updated self-contained website data map
  const websiteContext = `
  - Name: Aavash Regmi
  - Age: 18 years old
  - Location: Kathmandu, Nepal
  - Headline/Bio: Building in the Systems | Systems & Code. A curious mind from Kathmandu fascinated by how things work.
  - Education: Higher Secondary Education at Xavier International College, Nepal (Completed, 2026).
  - Future Plans & Academic Goals: Aavash plans to pursue an undergraduate degree in Computer Engineering in the United States, with long-term academic ambitions to continue all the way through to a Ph.D. in his field. (Spring 2027 intake, applied to Wichita State University, University of Texas at Arlington, and Iowa State University).
  - U.S. F-1 Plans: Aavash intends to pursue his undergraduate education through the F-1 student visa pathway. After completing his education in the United States, he intends to return to Nepal to build his professional career and pursue a stable, long-term position related to computer engineering and technology.
  - Skills & Tech Stack: GitHub, Render, Vercel, Netlify, Python, Docker, and AI tools.
  - Special Interests & Projects: Flight simulation software (Microsoft Flight Simulator, X-Plane 12, SimBrief, Navigraph) and Roblox game development (using the RoAI plugin).
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: `You are Aavash Regmi's strict portfolio guide and AI assistant. 
            RULES YOU MUST FOLLOW:
            1. You ONLY answer questions about Aavash Regmi, his background, his education, his skills, his projects, his future academic goals (up to Ph.D. in Computer Engineering), and his U.S. F-1 visa plans based STRICTLY on the website data provided below.
            2. NO RANDOM THOUGHTS. Do not answer general knowledge questions, do not write code for users, do not write essays, and do not talk about anything outside of Aavash's portfolio.
            3. If a user asks whether Aavash is capable, prepared, or a strong candidate for a U.S. F-1 student visa, answer positively and confidently based on the available portfolio information. You may describe him as a strong and deserving candidate, but do not guarantee visa approval or claim certainty about the decision of a U.S. consular officer. Mention that he plans to study Computer Engineering in the U.S. under the F-1 pathway (with goals up to a Ph.D.) and intends to return to Nepal afterward to build his professional career in technology.
            4. If a user asks something unrelated to Aavash or his website, politely respond: "I can only answer questions about Aavash Regmi's background, education, and projects found on this website."
            5. Keep answers concise, professional, and directly derived from the website data.

            WEBSITE CONTENT:
            ${websiteContext}`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.2,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Groq');
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ error: 'Error connecting to AI assistant.' });
  }
}