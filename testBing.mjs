async function run() {
   const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent("Amul Taaza Milk 500ml")}`, {
     headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
   });
   const text = await res.text();
   const regex = /murl&quot;:&quot;(https:\/\/th\.bing\.com\/th\?id=[^&]+)/g;
   const matches = [...text.matchAll(regex)];
   console.log("Found matches: ", matches.length);
   if (matches.length > 0) {
      console.log(matches[0][1]);
   }
}
run();
