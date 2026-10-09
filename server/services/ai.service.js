export const processAiQuery = async (prompt, userContext = {}) => {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt must be a non-empty string');
  }

  const lower = prompt.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      if (process.env.GEMINI_API_KEY) {
        const fetchRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are NextCampus AI Assistant for Oxford Brookes University campus. Prompt: ${prompt}` }] }]
          })
        });
        const data = await fetchRes.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return {
            reply: data.candidates[0].content.parts[0].text,
            category: 'ai_live',
            suggestedAction: null,
            isLiveModel: true,
            engineName: 'Live Gemini Pro Engine'
          };
        }
      }
    } catch (err) {
      console.warn('[NextCampus AI] External provider error fallback to demo service:', err.message);
    }
  }

  // Clearly labeled Demo Response Service as required when credentials are unavailable
  let reply = "Hello! I am NextCampus AI Assistant. I can assist you with campus navigation, SmartRoom availability, facility complaints, EcoCampus metrics, and SkillCampus student projects.";
  let category = "general";
  let suggestedAction = null;
  let richCards = null;

  if (lower.includes('turing') || lower.includes('b-204') || lower.includes('reach') || lower.includes('directions') || lower.includes('lab') || lower.includes('where')) {
    reply = "To reach the Distributed Systems & Multimedia Computer Laboratory (Room B-204) in Alan Turing Hall (Block A-01) from the Central Library:\n\nThe fastest route is via the 2nd Floor Covered Skybridge. It provides step-free ADA accessibility and directly connects into Turing Hall Level 2. Total walking time is approx. 4 minutes (320 meters).";
    category = "navigation";
    suggestedAction = "/campus-map";
    richCards = {
      type: "spatial",
      building: "Alan Turing Hall (Block A-01)",
      room: "B-204",
      occupancy: "18 / 60",
      co2: "420 ppm",
      temp: "21.8°C",
      distance: "320m • ~4 mins walk"
    };
  } else if (lower.includes('report') || lower.includes('broken') || lower.includes('projector') || lower.includes('glitch') || lower.includes('complaint') || lower.includes('issue') || lower.includes('maintenance')) {
    reply = "You can submit an instant dispatch ticket through NextCampus Care. In active learning spaces like Turing Hall B-204, classroom AV incidents are automatically tagged under Tier 1 Rapid Response SLA (<45 minutes resolution) before upcoming class sessions.";
    category = "care";
    suggestedAction = "/complaints";
    richCards = {
      type: "care_ticket",
      ticketId: "#NC-9402",
      category: "Classroom AV / HDMI",
      priority: "Medium Urgent",
      sla: "<45m"
    };
  } else if (lower.includes('library') || lower.includes('pod') || lower.includes('study') || lower.includes('book')) {
    reply = "Central Library contains 16 Acoustic Quiet Study Pods on Level 3. Pods 1-4 feature ANC Glass, 100W USB-C PD power, and dimmable warm LED lighting. Tap below to inspect study pods.";
    category = "smartrooms";
    suggestedAction = "/smartroom";
    richCards = {
      type: "pod",
      building: "Central Library",
      availablePods: "4 / 16 Pods Free",
      status: "Instant Tap-In"
    };
  } else if (lower.includes('eco') || lower.includes('solar') || lower.includes('green') || lower.includes('waste')) {
    reply = "Oxford Brookes EcoCampus reports a 78% Sustainability Score (Grade A-). Current solar generation is 88.8 MWh with 82% daily waste diversion across 48 IoT SmartBins.";
    category = "ecocampus";
    suggestedAction = "/ecocampus";
  }

  return {
    reply,
    category,
    suggestedAction,
    richCards,
    isLiveModel: false,
    engineName: "Simulated Copilot Engine (Demo Service)"
  };
};

export default { processAiQuery };
