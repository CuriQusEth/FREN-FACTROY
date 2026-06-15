import https from "https";

https.get("https://docs.base.org/ai-agents/skills/references/install.md", (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => { console.log(data); });
}).on("error", (err) => {
  console.error(err.message);
});
