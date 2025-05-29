chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "copy-link") {
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) {
    return;
  }

  const raw = new URL(tab.url);
  let base = raw.origin + raw.pathname;
  const project = raw.searchParams.get("project");
  if (project) {
    base += "?project=" + project;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (text) => {
      navigator.clipboard.writeText(text).then(() => {
        const div = document.createElement("div");
        div.textContent = "📋 copied!";
        Object.assign(div.style, {
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "#323232",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          zIndex: 9999,
        });
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2000);
      });
    },
    args: [base],
  });
});
