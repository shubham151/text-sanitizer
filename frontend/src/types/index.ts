export interface State {
  text: string;
  setText: (v: string) => void;
  result: string;
  setResult: (v: string) => void;
  loading: boolean;
  error: string;
  setError: (v: string) => void;
  copied: boolean;
  copy: (t: string) => void;
  visits: number | null;
  submit: () => void;
  reset: () => void;
}

export interface ApiResponse {
  sanitized_text?: string;
  visits?: number;
  error?: string;
}
