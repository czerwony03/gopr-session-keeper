function getCSRFToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.content : null;
}

function sendKeepAliveRequest() {
  const csrfToken = getCSRFToken();
  if (!csrfToken) {
    console.warn("CSRF token not found. Skipping keep-alive request.");
    return;
  }

  fetch("https://gopr24.pl/registry-mnt/child-regions", {
    method: "POST",
    headers: {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      "x-csrf-token": csrfToken
    },
    body: "depdrop_parents%5B0%5D=&depdrop_all_params%5Bregistrymntsearch-region_id%5D=",
    credentials: "include"
  })
    .then((res) => {
      if (res.ok) {
        console.log("✅ Keep-alive request successful at", new Date().toLocaleTimeString());
      } else {
        console.warn("⚠️ Keep-alive failed:", res.status);
      }
    })
    .catch((err) => {
      console.error("🚨 Keep-alive error:", err);
    });
}

// Call every 4 minutes
setInterval(sendKeepAliveRequest, 1 * 60 * 1000);

// Run immediately on load
sendKeepAliveRequest();
