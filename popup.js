document.getElementById('scrapeButton').addEventListener('click', () => {
  const oneWeekAgo = (new Date()).getTime() - (7 * 24 * 60 * 60 * 1000);  // Past week
  
  // Query Chrome history
  chrome.history.search({
    text: '',
    startTime: oneWeekAgo,   // You can adjust the timeframe
    maxResults: 1000         // Adjust for how much data you want
  }, function(results) {
    // Structure the output in a readable format
    const structuredData = results.map(item => ({
      title: item.title,
      url: item.url,
      lastVisitTime: new Date(item.lastVisitTime).toLocaleString(),
      visitCount: item.visitCount
    }));

    // Display the output in the popup
    document.getElementById('output').textContent = JSON.stringify(structuredData, null, 2);

    // Optionally store data in local storage
    chrome.storage.local.set({ scrapedHistory: structuredData }, function() {
      console.log('History data saved.');
    });
  });
});

// Add event listener to dashboard link to open dashboard.html in extension context
const dashboardLink = document.getElementById('dashboardLink');
if (dashboardLink && chrome && chrome.runtime && chrome.tabs) {
  dashboardLink.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  });
}
