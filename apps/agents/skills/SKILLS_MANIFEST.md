# 🎯 Agentic Skills Manifest

This manifest tracks the expert playbooks available for automated agent activation. Agents SHOULD consult these skills before performing related tasks.

## 📁 Backend Skills (`f:\project 555\skills\backend`)

| Skill | Trigger Keywords | Description |
| :--- | :--- | :--- |
| **`backend-architect`** | architecture, microservices, scaling, system design | Scalable API design and microservices patterns. |
| **`backend-dev-guidelines`** | route, controller, prisma, express, logic | Senior-level standards for routes and database access. |
| **`backend-security-coder`** | security, auth, encryption, validation, audit | Expert security patterns and vulnerability mitigation. |
| **`firebase`** | firestore, firebase, auth rules, collections | Deep-dive guide for Firebase ecosystem and security rules. |
| **`api-design-principles`** | api, rest, endpoint, json, swagger | Universal standards for clean, maintainable API shapes. |
| **`backend-development-feature-development`** | feature, implementation, workflow, delivery | Orchestration for end-to-end backend feature delivery. |
| **`mcp-builder`** | mcp, server, tool, integration | Playbook for building custom MCP servers (Node/Python). |
| **`docx`** | proposal, contract, docx, document | Expert DOCX generation and manipulation logic. |
| **`theme-factory`** | theme, branding, luxury, style | Consistent brand application and theme orchestration. |
| **`internal-comms`** | message, template, whatsapp, comms | Template-based communication for deal milestones. |
| **`docusign`** | sign, signature, docusign, contract | Automation for e-signature workflows and status tracking. |
| **`stripe`** | payment, stripe, earnest, commission | Financial transaction orchestration and security. |
| **`artifacts-builder`** | artifact, react, preview, whatsapp-card | Visual proposal artifacts and interactive previews. |
| **`file-organizer`** | archive, deal, filing, tax, summary | Automated deal document organization and archival. |
| **`agent-orchestrator`** | multi-agent, workflow, complex-task | Advanced orchestration for multi-agent deal flows. |
| **`agent-memory-systems`** | memory, persistence, state, long-term | Long-term memory and state management for agents. |
| **`whatsapp-automation`** | whatsapp, automation, api, messaging | Deep integration with WhatsApp Business API. |
| **`pdf`** | pdf, report, export, form-fill | Production-grade PDF generation and manipulation. |
| **`pptx`** | presentation, pptx, pitch, slides | Dynamic PowerPoint generation for property pitches. |
| **`xlsx`** | spreadsheet, excel, xlsx, budget | Financial reporting and deal tracking spreadsheets. |
| **`vercel-deployment`** | vercel, deploy, production, ci-cd | Production-grade deployment and Vercel optimization. |
| **`nextjs`** | nextjs, app-router, server-components | Best practices for modern Next.js architecture. |

## 🤖 Automatic Activation Protocol
1.  **Context Recognition**: When a user request matches the "Trigger Keywords", the agent MUST read the corresponding `SKILL.md` in the skill directory.
2.  **Constraint Enforcement**: The instructions within the skill become MANDATORY constraints for the current task.
3.  **Proactive Suggestion**: If the agent identifies a task could be improved by a skill, it should mention: *"I am activating the `[Skill Name]` playbook to ensure production-grade standards."*
