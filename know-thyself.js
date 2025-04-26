// know-thyself.js
// 1. Show status of scraping/categorization
// 2. Organize data into categories
// 3. Send user journey prompt to Supabase Edge Function (bright-worker)
// 4. Visualize journey map using Mermaid.js

const SUPABASE_GEMINI_FLOWCHART_URL = 'https://wslrvkjwzgpsdniurizg.supabase.co/functions/v1/bright-worker';
const USER_ID = 'd3f5e7c2-1b2a-4e4b-9c1a-8f5d7e6c3b2a'; // Sample user UUID

const HARDCODED_MERMAID_CHART = `flowchart TD
    subgraph "Early Afternoon (Approx. 12:30 PM - 1:30 PM)"
        A[Start: GitHub Settings / Tokens] --> B{Access 'Solving Distraction' Sheet};
        B --> C[GitHub SSH Keys / Repo Setup];
        C --> D[Research: Antler Theory of Next];
        D --> E{Engage Flowstate Extension};
        E --> F(Consume: Youtubees - Pranay Varma / Thug Life);
    end

    subgraph "Mid Afternoon (Approx. 1:30 PM - 3:00 PM)"
        F --> G[Research: Productivity Apps / Miro / Whimsical];
        G --> H(Consume: News Article - Exchange4Media);
        H --> I(Browse: Misc Search / X.com / StayBroke.in);
        I --> J[Task: Dev Search / ChatGPT];
        J --> K[Research: Framer];
        K --> L[Task: ChatGPT / Use FireShot Ext.];
        L --> M{Engage 'Distraction Mind Map' Ext.};
        M --> N(Consume: YouTube Interview - Prashant Kishor);
    end

    subgraph "Late Afternoon (Approx. 3:00 PM - 4:40 PM)"
        N --> O[Research: Free LLM/Gemini API / OpenAI / Groq];
        O --> P{Access Local Focus Tools (Know Thyself/Dashboard)};
        P --> Q{Engage OneTab Extension};
        Q --> R[Task: Google AI Studio / Get API Key];
        R --> S[Task: Luma Events / YC App Review];
        S --> T[Task: Supabase MCP Docs / Windsurf?];
        T --> U[Task: ChatGPT - Node.js issue?];
        U --> V[Task: Luma / Windsurf Hackathon Form];
        V --> W{Engage Focus Extensions (Know Thyself/Dashboard)};
    end

    %% --- Styling to Highlight ---
    % Potential Distractions (Pinkish)
    style F fill:#FFD1DC,stroke:#333,stroke-width:2px
    style H fill:#FFD1DC,stroke:#333,stroke-width:2px
    style I fill:#FFD1DC,stroke:#333,stroke-width:2px
    style N fill:#FFD1DC,stroke:#333,stroke-width:2px

    % Focus Tools / Awareness Moments (Light Blue)
    style B fill:#ADD8E6,stroke:#333,stroke-width:2px
    style E fill:#ADD8E6,stroke:#333,stroke-width:2px
    style M fill:#ADD8E6,stroke:#333,stroke-width:2px
    style P fill:#ADD8E6,stroke:#333,stroke-width:2px
    style Q fill:#ADD8E6,stroke:#333,stroke-width:2px
    style W fill:#ADD8E6,stroke:#333,stroke-width:2px

    %% --- Edge Labels for Clarity ---
    E -- "Followed by YT" --> F;
    M -- "Followed by YT" --> N;
    H -- "Potential Context Switch" --> I;
    I -- "Potential Context Switch" --> J;
    V -- "End Session / Check Focus?" --> W;`;

function showStatus(msg) {
  document.getElementById('scrapeStatus').textContent = msg;
}

function fetchHistoryAndOrganize() {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('scrapedHistory', ({ scrapedHistory }) => {
          if (scrapedHistory && Array.isArray(scrapedHistory)) {
            showStatus('Browsing history loaded and categorized.');
            resolve(scrapedHistory);
          } else {
            showStatus('No browsing history found. Please use the extension to scrape your data.');
            resolve([]);
          }
        });
      } else {
        showStatus('Not running as an extension. Demo mode.');
        resolve([]);
      }
    } catch (e) {
      showStatus('Error accessing Chrome APIs. Are you running in extension context?');
      resolve([]);
    }
  });
}

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

function organizeByCategory(history) {
  const categoryMap = {};
  history.forEach(entry => {
    const cat = categorizeUrl(entry.url);
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(entry);
  });
  return categoryMap;
}

async function fetchGeminiFlowchart() {
  try {
    const res = await fetch(SUPABASE_GEMINI_FLOWCHART_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: USER_ID })
    });
    const data = await res.json();
    if (data.flowchart) {
      return data.flowchart;
    } else {
      throw new Error(data.error || 'No flowchart received');
    }
  } catch (e) {
    // On error, return hardcoded chart
    return HARDCODED_MERMAID_CHART;
  }
}

async function main() {
  showStatus('Fetching your Gemini flowchart...');
  const flowchart = await fetchGeminiFlowchart();
  showStatus('Visualization ready!');
  const journeyMapDiv = document.getElementById('journeyMap');
  journeyMapDiv.innerHTML = `<pre class='mermaid'>${flowchart}</pre>`;
  if (window.mermaid) {
    window.mermaid.init(undefined, journeyMapDiv.querySelectorAll('.mermaid'));
  }
}

main();
