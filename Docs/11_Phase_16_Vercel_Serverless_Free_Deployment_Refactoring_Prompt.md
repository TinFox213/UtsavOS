# **Phase 16: Vercel Free Tier (Hobby) Serverless Architecture Refactoring & Zero-Downtime Deployment Specification**

This technical specification details the structural refactoring required to run a full-stack Vite, React 19, and TypeScript single-page application with serverless `/api/v1/*` micro-endpoints completely within the constraints of the Vercel Hobby (Free) Tier.

# **1\. Architectural Objective & Platform Pitfall Mitigations**

When porting a unified frontend and backend codebase to Vercel Serverless runtime environments, standard Node.js patterns and local Vite middleware encounter distinct incompatibilities. The table below outlines the primary failure modes and the structural mitigations enforced in Phase 16\.

| Failure Mode on Vercel Free Tier | Underlying Platform Cause | Architectural Mitigation Applied |
| :---- | :---- | :---- |
| **`req.on('data')` Hanging / `504 Gateway Timeout`** | Local Vite middleware reads incoming payloads via raw Node streams (`req.on('data')`). In contrast, Vercel Serverless Function runtimes pre-parse `req.body` upstream before handler invocation, causing manual stream listeners to block until worker timeout. | Implement a **Dual-Runtime Universal Body Parser (`parseIncomingBody`)** that resolves `req.body` immediately if pre-parsed, gracefully falling back to Node stream ingestion during local Vite dev sessions. |
| **`ERR_MODULE_NOT_FOUND` in `/api/v1/*` Modules** | Vercel isolates and builds `/api/**/*.ts` into discrete AWS Lambda bundles independently from the Vite bundler. Deep relative imports targeting client-side directories (`../../src/...`) fail module resolution during deployment packaging. | Encapsulate `api/v1/ai-generate.ts` and `api/v1/health-and-test.ts` as **100% self-contained serverless units**. Inline or extract shared logic to `api/_lib/`, keeping the total function count at `2` (comfortably below the 12-function Hobby limit). |
| **`vercel.json` Schema Parsing Rejections** | The Vercel deployment engine throws an error if legacy routing primitives (`routes`) are mixed with modern declarations (`rewrites`, `headers`, or `cleanUrls`). | Standardize configuration using the modern Vercel schema with explicit build properties (`framework: "vite"`, `outputDirectory: "dist"`, `functions`, `rewrites`, and `headers`). |
| **`tsc` Ambient Type Collision** | Unified builds fail when `tsc` evaluates client DOM globals against Node server modules without defined compilation scopes. | Explicitly separate compilation concerns by isolating Vite production output (`dist/`) while supplying Node type definitions scoped for execution within `@vercel/node`. |
| **Cold Start / First-Deploy `500 Internal Error`** | Unconditional instantiation of external SDKs (such as `@google/genai`) causes runtime initialization crashes if target environment variables (`GEMINI_API_KEY`) are missing on first commit. | Implement runtime configuration guards that divert to a **Deterministic Parameter-Reactive Synthesizer** returning `200 OK` until live keys are populated. |

# **2\. Copy-Pasteable Execution Prompt for Antigravity Engine**

Execute Phase 16: Refactor the current repository structure for 100% free, zero-error deployment on Vercel Hobby (Serverless Functions \+ Vite Static SPA) without breaking any existing Phase 01–15 features or unit tests.

Perform the following exact structural updates:

\#\#\# Step 1: Upgrade \`vercel.json\` to Modern Vercel Serverless \+ SPA Schema

Replace \`vercel.json\` at the project root with the following valid schema (never mix legacy \`routes\` with \`rewrites\` or \`headers\`, and keep total functions under the Vercel Hobby 12-function limit):

{

  "\$schema": "https\://openapi.vercel.sh/vercel.json",

  "version": 2,

  "framework": "vite",

  "buildCommand": "npm run build",

  "outputDirectory": "dist",

  "functions": {

    "api/\*\*/\*.ts": {

      "maxDuration": 30

    }

  },

  "rewrites": \[

    {

      "source": "/api/(.\*)",

      "destination": "/api/\$1"

    },

    {

      "source": "/((?\!api/\|assets/\|favicon.ico\|robots.txt).\*)",

      "destination": "/index.html"

    }

  \],

  "headers": \[

    {

      "source": "/(.\*)",

      "headers": \[

        { "key": "X-Content-Type-Options", "value": "nosniff" },

        { "key": "X-Frame-Options", "value": "DENY" },

        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },

        { "key": "X-XSS-Protection", "value": "1; mode=block" },

        { "key": "Permissions-Policy", "value": "camera=(), geolocation=(self), microphone=(self)" }

      \]

    },

    {

      "source": "/assets/(.\*)",

      "headers": \[

        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }

      \]

    }

  \]

}

\#\#\# Step 2: Create \`.vercelignore\` to Keep Serverless Bundles Fast & Lightweight

Create \`.vercelignore\` at the project root so local documentation folders, coverage reports, and test artifacts do not bloat the Vercel Serverless Function bundle:

node\_modules

.git

coverage

playwright-report

test-results

Docs

docs

\*.log

\#\#\# Step 3: Make \`api/v1/ai-generate.ts\` 100% Self-Contained & Dual-Runtime Compatible (Vercel Serverless \+ Local Vite)

Refactor \`api/v1/ai-generate.ts\` so that:

1\. It does NOT rely on fragile deep relative imports (\`../../src/...\`) that can fail in Vercel's isolated Node serverless bundler. Inline the OWASP LLM01 prompt-injection regex check and the parameter-reactive fallback synthesizer directly inside \`api/v1/ai-generate.ts\` (or in a sibling \`api/\_lib/\` helper).

2\. It implements a universal body parser (\`parseIncomingBody\`) that reads \`req.body\` first on Vercel and falls back to \`req.on('data')\` stream reading in local Vite dev middleware.

3\. It implements a universal JSON sender (\`sendJson(res, statusCode, payload)\`) compatible with both \`res.status(code).json(payload)\` (Vercel) and \`res.statusCode \= code; res.end(...)\` (Node HTTP).

4\. It checks \`process.env.GEMINI\_API\_KEY\`. When present, it calls \`@google/genai\` (\`gemini-2.5-flash\`). If absent or rate-limited, it falls back cleanly (\`200 OK\`) to the parameter-reactive dynamic synthesizer so the live Vercel URL never returns a 500 error.

\#\#\# Step 4: Make \`api/v1/health-and-test.ts\` Self-Contained & Dual-Runtime Compatible

Ensure \`GET /api/v1/health-and-test\` uses the same universal \`sendJson\` helper and returns \`200 OK\` on both Vercel and local Vite dev.

\#\#\# Step 5: Verify Client-Side Fetch Paths & Build Scripts

Ensure \`src/services/geminiService.ts\` calls the relative URL \`'/api/v1/ai-generate'\`, \`@types/node\` is present in \`devDependencies\`, and \`npx tsc \--noEmit\`, \`npx vitest run\`, and \`npm run build\` all pass with 0 errors.

# **3\. Production Implementation Details**

## **Dual-Runtime Universal Helper Module (`api/_lib/http.ts`)**

import type { IncomingMessage, ServerResponse } from 'http';

export interface VercelCompatibleRequest extends IncomingMessage {

  body?: any;

  query?: Record\<string, string \| string\[\]\>;

  cookies?: Record\<string, string\>;

}

export interface VercelCompatibleResponse extends ServerResponse {

  status?: (statusCode: number) \=\> VercelCompatibleResponse;

  json?: (data: any) \=\> void;

}

export async function parseIncomingBody(req: VercelCompatibleRequest): Promise\<any\> {

  if (req.body \!== undefined && req.body \!== null) {

    if (typeof req.body \=== 'string') {

      try {

        return JSON.parse(req.body);

      } catch {

        return req.body;

      }

    }

    return req.body;

  }

  return new Promise((resolve, reject) \=\> {

    let raw \= '';

    req.on('data', (chunk) \=\> {

      raw \+= chunk;

    });

    req.on('end', () \=\> {

      if (\!raw.trim()) {

        resolve({});

        return;

      }

      try {

        resolve(JSON.parse(raw));

      } catch (err) {

        reject(new Error('Invalid JSON payload received in request stream'));

      }

    });

    req.on('error', (err) \=\> reject(err));

  });

}

export function sendJson(

  res: VercelCompatibleResponse,

  statusCode: number,

  payload: Record\<string, any\>

): void {

  if (typeof res.status \=== 'function' && typeof res.json \=== 'function') {

    res.status(statusCode).json(payload);

    return;

  }

  res.statusCode \= statusCode;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.end(JSON.stringify(payload));

}

## **Serverless Endpoint (`api/v1/health-and-test.ts`)**

t  
import type { VercelRequest, VercelResponse } from '@vercel/node';  
import { sendJson } from '../\_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {  
if (req.method \!== 'GET') {  
return sendJson(res, 405, {  
status: 'error',  
message: 'Method Not Allowed'  
});  
}

return sendJson(res, 200, {  
status: 'healthy',  
timestamp: new Date().toISOString(),  
environment: process.env.VERCEL\_ENV \|\| 'development',  
geminiKeyConfigured: Boolean(process.env.GEMINI\_API\_KEY)  
});  
}

\#\# 4\. Verification & Deployment Sequence

1\. \*\*Repository Synchronization\*\*: Commit all structural refactors and push to the remote tracking branch.

2\. \*\*Project Provisioning\*\*: Import the repository via the Vercel Dashboard or run \`npx vercel \--prod\`.

3\. \*\*Configuration Audit\*\*: Confirm that \*\*Framework Preset\*\* is auto-detected as \`Vite\` and \*\*Output Directory\*\* is set to \`dist\`.

4\. \*\*Environment Secrets\*\*: Add \`GEMINI\_API\_KEY\` to \*\*Project Settings \> Environment Variables\*\* (configured for Production, Preview, and Development).

5\. \*\*Runtime Validation\*\*: Execute a sanity query against the provisioned health endpoint:

   \* Target: \`https\://\<deployed-domain\>.vercel.app/api/v1/health-and-test\`

   \* Target Status: \`200 OK\`

   \* Verification Check: Confirm JSON response contains \`"status": "healthy"\`.  
