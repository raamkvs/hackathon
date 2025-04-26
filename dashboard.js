// dashboard.js
// Handles the Know Thyself button click for dashboard.html

// Replace with your Supabase Edge Function URL
const SUPABASE_INSERT_HISTORY_URL = 'https://wslrvkjwzgpsdniurizg.supabase.co/functions/v1/smart-task';
const USER_ID = 'd3f5e7c2-1b2a-4e4b-9c1a-8f5d7e6c3b2a'; // Sample user UUID

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('knowThyselfBtn');
  if (!btn) return;
  btn.addEventListener('click', async function() {
    console.log('Know Thyself button clicked');
    if (chrome && chrome.history) {
      // Fetch Chrome history (last 7 days, up to 1000 entries)
      const oneWeekAgo = (new Date()).getTime() - (7 * 24 * 60 * 60 * 1000);
      chrome.history.search({
        text: '',
        startTime: oneWeekAgo,
        maxResults: 1000
      }, async function(results) {
        // Prepare data for Supabase
        const historyData = results.map(item => ({
          url: item.url,
          title: item.title,
          lastVisitTime: item.lastVisitTime,
          visitCount: item.visitCount || 1
        }));
        // POST to Supabase Edge Function
        try {
          const res = await fetch(SUPABASE_INSERT_HISTORY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: USER_ID, history: historyData })
          });
          const data = await res.json();
          console.log('Supabase insert response:', data);
          // Optionally, show a message or proceed to open know-thyself.html
          if (chrome.runtime && chrome.tabs) {
            chrome.tabs.create({ url: chrome.runtime.getURL('know-thyself.html') });
          } else {
            window.open('know-thyself.html', '_blank');
          }
        } catch (err) {
          alert('Failed to upload history to Supabase: ' + err.message);
        }
      });
    } else {
      // Fallback: just open the page
      if (chrome.runtime && chrome.tabs) {
        chrome.tabs.create({ url: chrome.runtime.getURL('know-thyself.html') });
      } else {
        window.open('know-thyself.html', '_blank');
      }
    }
  });
});
