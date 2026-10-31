// src/shared/securityGuardrails.ts

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

/**
 * Evaluates raw user input against OWASP LLM01 prompt injection, SQL injection,
 * and Cross-Site Scripting patterns. Returns sanitized text or rejection reason.
 */
export function auditAndSanitizeInput(rawInput: string): SecurityAuditResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isSafe: true,
      sanitizedText: '',
      triggeredRule: null,
    };
  }

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        sanitizedText: '',
        triggeredRule: `Blocked by OWASP LLM01 / XSS Guardrail: matched restricted pattern (${pattern.source})`,
      };
    }
  }

  // Sanitize angle brackets to prevent DOM XSS injection
  const sanitized = trimmed
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    isSafe: true,
    sanitizedText: sanitized,
    triggeredRule: null,
  };
}
