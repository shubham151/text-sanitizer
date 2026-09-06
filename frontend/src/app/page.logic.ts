import { useState, useEffect } from 'react';
import { State, ApiResponse } from '../types';

function get(): State {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(function init() {
    fetch('/api/visit', { method: 'POST' })
      .then(function parse(res: Response) {
        return res.json();
      })
      .then(function update(data: ApiResponse) {
        if (data.visits) setVisits(data.visits);
      })
      .catch(function log(err: unknown) {
        console.error(err);
      });
  }, []);

  function submit(): void {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    
    fetch(`/api/sanitize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then(async function parse(res: Response) {
        if (!res.ok) throw new Error('Failed to sanitize');
        return res.json();
      })
      .then(function update(data: ApiResponse) {
        if (data.sanitized_text) setResult(data.sanitized_text);
      })
      .catch(function err(e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error';
        setError(msg);
      })
      .finally(function finish() {
        setLoading(false);
      });
  }

  function copy(target: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(target);
    } else {
      const area = document.createElement("textarea");
      area.value = target;
      area.style.position = "absolute";
      area.style.left = "-999999px";
      document.body.prepend(area);
      area.select();
      try { document.execCommand('copy'); } catch (e) { console.error(e); }
      area.remove();
    }
    setCopied(true);
    setTimeout(function reset() {
      setCopied(false);
    }, 2000);
  }

  function reset(): void {
    setText('');
    setResult('');
    setError('');
  }

  return { text, setText, result, setResult, loading, error, setError, copied, copy, visits, submit, reset };
}

const Logic = { get };
export { Logic };
