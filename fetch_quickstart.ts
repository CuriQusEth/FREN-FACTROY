import https from "https";

https.get("https://docs.base.org/ai-agents/quickstart", (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => { console.log(data.substring(0, 500)); });
}).on("error", (err) => {
  console.error(err.message);
});
