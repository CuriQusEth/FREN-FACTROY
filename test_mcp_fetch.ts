import https from "https";

https.get("https://mcp.base.org/", (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => { console.log("STATUS: ", res.statusCode); console.log("DATA: ", data); });
}).on("error", (err) => {
  console.error(err.message);
});
