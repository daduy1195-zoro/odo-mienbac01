const url = "https://script.google.com/macros/s/AKfycbxpf65_UM-GJL9dtt_HhGj4YJoygjPIQip9-TNxiWkRwVzdAIAMZIDLBbOnRgJ8cNgHWg/exec";

async function run() {
  console.log("Calling ping...");
  let res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "ping" })
  });
  console.log(await res.text());
}
run();
