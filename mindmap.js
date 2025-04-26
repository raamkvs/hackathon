// Simple mind map generator using Mermaid.js syntax
document.addEventListener('DOMContentLoaded', () => {
  const mindmapContainer = document.getElementById('mindmap');
  if (!mindmapContainer) return;

  chrome.storage.local.get('scrapedHistory', ({ scrapedHistory }) => {
    if (!scrapedHistory || !Array.isArray(scrapedHistory)) {
      mindmapContainer.textContent = 'No history data available.';
      return;
    }

    // Import categorization logic
    // For extension, you may need to inline categorizeUrl or use ES6 modules
    function categorizeUrl(url) {
      const categories = [
        { name: 'Social Media', keywords: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'reddit', 'pinterest', 'snapchat'] },
        { name: 'Entertainment', keywords: ['youtube', 'netflix', 'primevideo', 'hulu', 'spotify', 'hotstar', 'twitch', 'vimeo'] },
        { name: 'News', keywords: ['nytimes', 'bbc', 'cnn', 'theguardian', 'news', 'washingtonpost', 'indiatimes', 'reuters', 'bloomberg'] },
        { name: 'Shopping', keywords: ['amazon', 'flipkart', 'ebay', 'aliexpress', 'walmart', 'shopify', 'bestbuy', 'myntra'] },
        { name: 'Work/Study', keywords: ['gmail', 'outlook', 'office', 'docs', 'meet', 'zoom', 'slack', 'teams', 'canvas', 'coursera', 'udemy', 'khanacademy'] },
        { name: 'Other', keywords: [] }
      ];
      for (const category of categories) {
        for (const keyword of category.keywords) {
          if (url.toLowerCase().includes(keyword)) {
            return category.name;
          }
        }
      }
      return 'Other';
    }

    // Group by category and site
    const categoryMap = {};
    scrapedHistory.forEach(entry => {
      const cat = categorizeUrl(entry.url);
      if (!categoryMap[cat]) categoryMap[cat] = {};
      const domain = (new URL(entry.url)).hostname.replace('www.', '');
      if (!categoryMap[cat][domain]) categoryMap[cat][domain] = 0;
      categoryMap[cat][domain] += 1;
    });

    // Build Mermaid mindmap syntax
    let mindmap = 'mindmap\n';
    mindmap += '  root((Distraction Behaviors))\n';
    Object.entries(categoryMap).forEach(([cat, sites]) => {
      mindmap += `    ${cat}\n`;
      Object.entries(sites).forEach(([site, count]) => {
        mindmap += `      ${site} (${count})\n`;
      });
    });

    // Render with Mermaid
    mindmapContainer.innerHTML = `<pre class='mermaid'>${mindmap}</pre>`;
    if (window.mermaid) {
      window.mermaid.init(undefined, mindmapContainer.querySelectorAll('.mermaid'));
    }

    // Introspection questions
    const questionsDiv = document.createElement('div');
    questionsDiv.style.marginTop = '2em';
    questionsDiv.innerHTML = '<h2>Introspective Questions</h2>';
    if (window.generateQuestions) {
      const questions = window.generateQuestions(categoryMap);
      questions.forEach(q => {
        const p = document.createElement('p');
        p.textContent = q;
        questionsDiv.appendChild(p);
      });
    } else {
      questionsDiv.innerHTML += '<p>Unable to generate questions.</p>';
    }
    mindmapContainer.appendChild(questionsDiv);
  });
});
