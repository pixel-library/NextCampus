export const processAiQuery = async (prompt, userContext = {}) => {
  // Simulated AI response for campus queries
  const lower = prompt.toLowerCase();

  if (lower.includes('room') || lower.includes('class') || lower.includes('lab')) {
    return {
      reply: "SmartRooms currently report 84% average occupancy across the Academic Block. Lab 4B is open and available until 5:00 PM.",
      category: "smartrooms",
      suggestedAction: "/smartroom"
    };
  }

  if (lower.includes('map') || lower.includes('where') || lower.includes('library') || lower.includes('canteen')) {
    return {
      reply: "Central Library is located in Sector 3 (Building B). Central Canteen is open near the East Lawn.",
      category: "navigation",
      suggestedAction: "/campus-map"
    };
  }

  if (lower.includes('complaint') || lower.includes('issue') || lower.includes('wifi') || lower.includes('clean')) {
    return {
      reply: "You can lodge an official ticket on NextCampus Care. Current resolution SLA for infrastructure complaints is under 4 hours.",
      category: "care",
      suggestedAction: "/complaints"
    };
  }

  return {
    reply: `Hello! I am NextCampus AI Assistant. I can assist you with campus navigation, SmartRoom availability, ticket status, EcoCampus metrics, and SkillCampus student projects. How can I help you today?`,
    category: "general",
    suggestedAction: null
  };
};
