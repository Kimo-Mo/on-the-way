// ─── Global API Response Wrapper ─────────────────────────────────────────────
// Every backend response is wrapped in this envelope.
// The actual payload lives at `response.data.data` after Axios unwraps the HTTP body.

export interface ApiResponse<T> {
  data: T | null;
  isSuccess: boolean;
  error: { message: string } | string | null;
}
