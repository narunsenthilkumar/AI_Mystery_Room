# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The AI Mystery Room development team takes security seriously, especially around:
1. **API Key Protection**: Never embedding `GEMINI_API_KEY` or MongoDB connection credentials into client-side bundles.
2. **Anti-Cheat Sequestration**: Ensuring culprit identities and solutions cannot be exfiltrated through DOM inspection, network tabs, or unauthenticated endpoints before formal accusations are lodged.
3. **Prompt Injection Mitigations**: Ensuring user-supplied mystery premises cannot hijack Gemini system instructions.

If you discover a security vulnerability or security bug, please do not disclose it publicly via GitHub issues. Instead, please report it privately:

- Contact: **security@aimysteryroom.local** or contact the repository owner directly.
- Include a detailed description of the vulnerability, steps to reproduce, and potential impact.

We will acknowledge receipt within 48 hours and work on a prompt remediation.
