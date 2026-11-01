export interface SecurityAuditResult {
  isSafe: boolean;
  sanitizedText: string;
  triggeredRule: string | null;
}

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s+key)/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on(load|error|click|mouseover)\s*=/gi,
  /drop\s+table|union\s+select|--\s*$/i,
];

export function auditAndSanitizeInput(rawInput: string): SecurityAuditResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { isSafe: true, sanitizedText: '', triggeredRule: null };
  }

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        sanitizedText: '',
        triggeredRule: `Blocked by OWASP LLM01 / XSS Guardrail: matched pattern (${pattern.source})`,
      };
    }
  }

  const sanitized = trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return { isSafe: true, sanitizedText: sanitized, triggeredRule: null };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(
  clientIp: string,
  maxRequests = 30,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const history = rateLimitStore.get(clientIp) || [];
  const validTimestamps = history.filter((t) => t > windowStart);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0] ?? now;
    rateLimitStore.set(clientIp, validTimestamps);
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(clientIp, validTimestamps);
  const oldest = validTimestamps[0] ?? now;

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    resetAt: oldest + windowMs,
  };
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
