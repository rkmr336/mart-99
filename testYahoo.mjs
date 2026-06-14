async function run() {
   const res = await fetch(`https://images.search.yahoo.com/search/images?p=${encodeURIComponent("Amul Taaza Milk 500ml")}`, {
     headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
   });
   const text = await res.text();
   const regex = /<img src='([^']+)'/g;
   const matches = [...text.matchAll(regex)];
   console.log("Found matches: ", matches.length);
   if (matches.length > 0) {
      console.log(matches[0][1]);
      console.log(matches[1]?.[1]);
   }
}
run();
