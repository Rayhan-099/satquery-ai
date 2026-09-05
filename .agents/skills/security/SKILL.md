---
name: security
description: Use whenever implementing file uploads, user-controlled inputs, LLM tools, external APIs, model endpoints, authentication, authorization, storage, or anything that can execute or access resources.
---

# SatQuery Security

SatQuery combines:

- LLMs
- uploaded files
- satellite imagery
- analytical tools
- external APIs
- model endpoints

Treat all user-controlled data as untrusted.

## File uploads

Validate:

- MIME type
- file extension
- file structure
- file size
- decompression limits

Protect against:

- malicious files
- path traversal
- archive bombs
- unexpected formats

## LLM tool use

Never allow the LLM to freely execute arbitrary shell commands.

Tool arguments must be:

- schema validated
- type checked
- range checked
- authorized

## Network

Protect against:

- SSRF
- unauthorized external access
- malicious URLs

## Authentication / authorization

Users must only access scenes and resources they are authorized to access.

Use opaque resource identifiers where appropriate.

## Secrets

Never commit:

- API keys
- tokens
- passwords
- private credentials

Use environment variables or secure secret storage.

## Web security

Protect against:

- XSS
- injection
- unsafe HTML
- malicious filenames

## Principle

Convenience must never bypass validation or authorization.
