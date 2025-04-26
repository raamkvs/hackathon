// Introspective question generator based on mind map data
function generateQuestions(categoryMap) {
  const questions = [];
  Object.entries(categoryMap).forEach(([cat, sites]) => {
    let total = 0;
    Object.values(sites).forEach(count => total += count);
    if (cat !== 'Other' && total > 0) {
      questions.push(`You visited ${cat} sites ${total} times. What were you seeking or avoiding?`);
      Object.entries(sites).forEach(([site, count]) => {
        if (count > 5) {
          questions.push(`You visited ${site} (${cat}) ${count} times. What drew you there so often?`);
        }
      });
    }
  });
  if (questions.length === 0) {
    questions.push("No significant distraction patterns detected. Well done!");
  }
  return questions;
}

// For usage in mindmap.html
if (typeof window !== 'undefined') {
  window.generateQuestions = generateQuestions;
}
