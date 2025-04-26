// List of distraction categories and associated keywords/domains
const DISTRACTION_CATEGORIES = [
  { name: 'Social Media', keywords: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'reddit', 'pinterest', 'snapchat'] },
  { name: 'Entertainment', keywords: ['youtube', 'netflix', 'primevideo', 'hulu', 'spotify', 'hotstar', 'twitch', 'vimeo'] },
  { name: 'News', keywords: ['nytimes', 'bbc', 'cnn', 'theguardian', 'news', 'washingtonpost', 'indiatimes', 'reuters', 'bloomberg'] },
  { name: 'Shopping', keywords: ['amazon', 'flipkart', 'ebay', 'aliexpress', 'walmart', 'shopify', 'bestbuy', 'myntra'] },
  { name: 'Work/Study', keywords: ['gmail', 'outlook', 'office', 'docs', 'meet', 'zoom', 'slack', 'teams', 'canvas', 'coursera', 'udemy', 'khanacademy'] },
  { name: 'Other', keywords: [] }
];

function categorizeUrl(url) {
  for (const category of DISTRACTION_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (url.toLowerCase().includes(keyword)) {
        return category.name;
      }
    }
  }
  return 'Other';
}

// Export for usage in popup.js
if (typeof module !== 'undefined') {
  module.exports = { DISTRACTION_CATEGORIES, categorizeUrl };
}
