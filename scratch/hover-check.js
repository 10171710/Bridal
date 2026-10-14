const PORT = 9333;
const fileUrl = process.argv[2];
const cpu = () => new Promise(r => setTimeout(r, 300));

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(resolve => {
      const mid = ++id;
      pending.set(mid, resolve);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  }
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');
  await send('CSS.enable');
  await send('Page.navigate', { url: fileUrl });
  await cpu(); await cpu(); await cpu(); await cpu();

  const ev = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return r.result && r.result.result ? r.result.result.value : undefined;
  };
  const styleExpr = `(()=>{const e=document.querySelector('.hero-actions .btn-outline-brand');const cs=getComputedStyle(e);return JSON.stringify({color:cs.color,bg:cs.backgroundColor,border:cs.borderTopColor,w:cs.borderTopWidth});})()`;

  const before = await ev(styleExpr);

  const doc = await send('DOM.getDocument', { depth: -1 });
  const q = await send('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: '.hero-actions .btn-outline-brand' });
  await send('CSS.forcePseudoState', { nodeId: q.result.nodeId, forcedPseudoClasses: ['hover'] });
  await cpu();
  const after = await ev(styleExpr);

  console.log('BEFORE ' + before);
  console.log('AFTER  ' + after);
  ws.close();
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
