import { NextResponse } from "next/server";

export type ApiErrorBody = {
  error: { code: string; message: string };
};

export function jsonError(code: string, message: string, status: number): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function jsonRateLimited(message: string, retryAfterSec: number): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: { code: "rate_limited", message } },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}
