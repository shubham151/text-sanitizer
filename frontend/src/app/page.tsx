'use client';

import { Logic } from './page.logic';

function header(visits: number | null) {
  return (
    <header>
      <div className="flex items-center justify-between mb-[10px]">
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-accent m-0">Privacy Tool</p>
        {visits !== null && <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted m-0">Total Visits: {visits.toLocaleString()}</p>}
      </div>
      <h1 className="text-[34px] font-semibold tracking-tight mb-[12px] text-balance">Text Sanitizer</h1>
      <p className="max-w-[64ch] text-muted m-0">Protect privacy by instantly removing PII. Paste your content below to replace sensitive entities with safe placeholders.</p>
    </header>
  );
}

function input(text: string, set: (v: string) => void, submit: () => void, reset: () => void, loading: boolean, err: string, result: string) {
  return (
    <section>
      <h2 className="text-[13px] font-mono font-semibold tracking-[0.1em] uppercase text-muted m-0 mb-[16px] pb-[8px] border-b border-line">Input</h2>
      <div className="bg-surface border border-line rounded-[3px] p-[16px] md:p-[18px]">
        <textarea className="w-full bg-transparent border-0 outline-none text-[15px] text-ink placeholder:text-faint resize-y min-h-[160px]" placeholder="Paste your content here..." value={text} onChange={function change(e) { set(e.target.value); }} />
        <div className="mt-[16px] flex justify-end gap-[12px] border-t border-line pt-[16px]">
          <button onClick={reset} disabled={loading || (!text && !result && !err)} className="text-muted hover:text-ink px-[16px] py-[6px] rounded-[3px] font-medium text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Reset</button>
          <button onClick={submit} disabled={loading || !text.trim()} className="bg-accent text-surface px-[16px] py-[6px] rounded-[3px] font-medium text-[14px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">{loading ? 'Sanitizing...' : 'Sanitize Text'}</button>
        </div>
      </div>
      {err && <div className="mt-4 flex gap-4 p-4 bg-warn-soft border-l-[3px] border-warn rounded-[3px]"><p className="m-0 text-[14px] text-warn font-medium">{err}</p></div>}
    </section>
  );
}

function result(text: string, loading: boolean, copy: (t: string) => void, copied: boolean) {
  if (!text && !loading) return null;
  return (
    <section>
      <h2 className="text-[13px] font-mono font-semibold tracking-[0.1em] uppercase text-muted m-0 mb-[16px] pb-[8px] border-b border-line flex justify-between items-end">
        <span>Result</span>
        {text && (
          <button onClick={function act() { copy(text); }} className="text-[11px] text-accent hover:text-ink transition-colors flex items-center gap-[4px]">
            {copied ? <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!</> : <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy Output</>}
          </button>
        )}
      </h2>
      <div className="bg-surface-2 border border-line rounded-[3px] p-[16px] md:p-[18px]">
        {loading ? (
          <div className="animate-pulse flex flex-col gap-3"><div className="h-4 bg-line-strong rounded w-3/4"></div><div className="h-4 bg-line-strong rounded w-1/2"></div><div className="h-4 bg-line-strong rounded w-5/6"></div></div>
        ) : (
          <div className="font-mono text-[13.5px] whitespace-pre-wrap text-ink">{text}</div>
        )}
      </div>
    </section>
  );
}

function info() {
  return (
    <section>
      <h2 className="text-[13px] font-mono font-semibold tracking-[0.1em] uppercase text-muted m-0 mb-[16px] pb-[8px] border-b border-line">How it Works</h2>
      <div className="flex flex-col gap-[2px]">
        <div className="grid grid-cols-[34px_1fr] gap-[16px] p-[16px] md:p-[18px] bg-surface border border-line rounded-[3px] border-l-[3px] border-l-accent"><div className="font-mono text-[12px] text-faint pt-[2px]">01</div><div><h3 className="m-0 mb-[4px] text-[15px] font-semibold">Entity Detection</h3><p className="m-0 text-muted text-[14px]">Uses advanced NLP to detect sensitive entities.</p></div></div>
        <div className="grid grid-cols-[34px_1fr] gap-[16px] p-[16px] md:p-[18px] bg-surface border border-line rounded-[3px]"><div className="font-mono text-[12px] text-faint pt-[2px]">02</div><div><h3 className="m-0 mb-[4px] text-[15px] font-semibold">Safe Anonymization</h3><p className="m-0 text-muted text-[14px]">Securely replaces PII with placeholders.</p></div></div>
      </div>
    </section>
  );
}

function view() {
  const state = Logic.get();
  return (
    <div className="max-w-[1180px] mx-auto px-[28px] py-[56px] pb-[96px] flex flex-col gap-[44px]">
      {header(state.visits)}
      {input(state.text, state.setText, state.submit, state.reset, state.loading, state.error, state.result)}
      {result(state.result, state.loading, state.copy, state.copied)}
      {info()}
    </div>
  );
}

export default view;
