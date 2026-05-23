@AGENTS.md

## Standing rules from global config (cross-project)

These are enforced globally in `~/.claude/CLAUDE.md`. Summarized here for
contributors who don't have access to the global config. Read the source file
for the full context.

1. **Memory pipeline after every commit** — `nohup ~/.claude/scripts/update-memory-pipeline.sh all` fires after each commit. Not optional.
   Reference: `~/.claude/projects/-Users-ahmadsharaf/memory/MEMORY.md`

2. **Scoped memory = source of truth, MEMORY.md = index** — detailed lessons live in `feedback-*.md` / `project-*.md` files; MEMORY.md is the pointer table.
   Reference: `~/.claude/projects/-Users-ahmadsharaf/memory/MEMORY.md`

3. **Fix everything, no "non-blocking ignored" category** — warnings and lint errors are treated as failures.
   Reference: `~/.claude/projects/-Users-ahmadsharaf/memory/feedback-ai-security-checklist.md`

4. **Never defer a task unless Ahmad explicitly asks** — don't leave partial work or TODOs without a signal.

5. **Session auto-config** — Remote Control auto-starts, session names to `basename($PWD)`.

6. **Documentation parity** — every feature ships with docs in the same session (local commit + remote push).
   Reference: `~/.claude/CLAUDE.md` §"Plan-before-code for big changes"

7. **Multi-step Redis sentinel for reminders** — stepped reminder queues (e.g. cart abandoned 1h/4h/24h cadence) use Redis sentinel keys to track which step fired, not simple TTL locks.
   Reference: `~/.claude/projects/-Users-ahmadsharaf-Desktop-projects-force-website-builder/memory/`

8. **Discoverability status-chip pattern for buried features** — any feature with a toggle buried 3+ taps deep MUST surface its state on the Settings overview card (e.g. "DM ordering: ON/OFF" chip on the WhatsApp connection card).
   Reference: commit `917a268a` (FWB)

9. **Version-agnostic lookup for externally-versioned names** — Meta template names can be renamed via Reset-to-Draft. Dropdowns must resolve by base-name match (strip `_v2`, `_v3` suffixes) not exact-name lookup.
   Reference: commit `1507ef67` (FWB)
