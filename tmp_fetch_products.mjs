const url = process.argv[2];
if (!url) throw new Error('Missing url');

const res = await fetch(url);
const text = await res.text();
let j;
try { j = JSON.parse(text); } catch { /* ignore */ }
console.log(JSON.stringify({
  status: res.status,
  bodyText: text.slice(0, 200),
  itemsLength: j?.items?.length,
  total: j?.total,
}));

