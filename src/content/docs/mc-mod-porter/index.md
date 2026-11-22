---
title: MC Mod Porter — Overview
description: What MC Mod Porter does, what it does not do, and the Golden Rule behind its knowledge base.
sidebar:
  label: Overview & Golden Rule
---

MC Mod Porter is a tool for porting **Minecraft Java Edition mods** across supported versions — from **1.16** through
the **26.x** calendar versioning format.

Supported loaders are **Fabric** and **NeoForge** where support data is available for the selected Minecraft version
(the older 1.16-era templates also carry Forge/Architectury data).

- **Status:** Beta — current release `v1.3.0-beta`
- **Download:** [`auto-porter-1.3.0-beta.jar`](https://github.com/reqsery/mc-mod-porter/releases/tag/v1.3.0-beta) — one cross-platform JAR for both the GUI and the CLI
- **Requires:** Java 21+ to run the porter (see [Supported Versions & JDK](/mc-mod-porter/supported-versions/))
- **Video:** [Auto-Porter demo on YouTube](https://www.youtube.com/watch?v=bEKUnVigAlw)
- **License:** MIT + Commons Clause
- **Support:** [Discord](https://discord.gg/vV2USr9phF) · [GitHub Discussions](https://github.com/reqsery/mc-mod-porter/discussions)

![MC Mod Porter v1.3.0-beta desktop GUI](/mc-mod-porter-gui.png)

## The Golden Rule

:::note[The knowledge base is the single source of truth.]
Every API change in `auto-porter` is backed by a verified source (Mojang, Fabric, NeoForge official docs).
**No guessing. No hallucinations.**
:::

If an entry cannot be linked to an official Mojang, FabricMC, NeoForged or Gradle source, it is not added. Wikis,
search snippets and compile-only claims are not treated as primary evidence. See
[Knowledge Base & Migration Rules](/mc-mod-porter/knowledge-base/) for the full accuracy policy.

## What it does

The auto-porter handles the **mechanical, repetitive part** of version porting:

1. Updates `build.gradle` plugin versions
2. Updates `gradle.properties` dependency versions
3. Applies Java source/API migration patches
4. Updates Fabric/NeoForge mod metadata (`fabric.mod.json`, `neoforge.mods.toml`)
5. Runs build verification and reports remaining errors
6. Uses the verified migration knowledge base for supported version hops

Each port writes a machine-readable report to `build/port-report.json` in the ported project, and a migration warning
scanner flags code that needs manual work.

## What it does not do

**Logic changes.** If your code uses APIs that were completely redesigned, you need to fix those manually — the tool
tells you where. Semantic API changes, mixins and third-party dependencies can require manual fixes; a completed port
is **not** a guarantee that every mod compiles or runs. Always review the output, warnings and `port-report.json`.

:::caution[Source projects only]
Auto-Porter needs a **mod source/project folder** containing `build.gradle`, `gradle.properties`,
`gradlew`/`gradlew.bat` and `src/`. Compiled mod JARs from Modrinth/CurseForge cannot be ported. If you have a source
ZIP, extract it first.
:::

## How it works

1. **Check** `knowledge-base/minecraft/` for breaking API changes between versions
2. **Look up** `patterns/` for quick cross-version rename tables
3. **Find** `knowledge-base/loaders/` for correct dependency versions
4. **Verify** `java/` for Java toolchain requirements
5. **Run** `auto-porter` to automatically apply known patterns

## Repository layout

```text
auto-porter/        GUI + CLI tool: ports a mod folder to a target MC version
scripts/            Utility scripts (port.sh wrapper, validate-kb.sh)

knowledge-base/
  minecraft/        one file per adjacent version hop (e.g. 1.19.4_to_1.20.md)
  loaders/
    fabric/versions.md     Fabric Loader + API version table
    neoforge/versions.md   NeoForge version table

patterns/
  method-renames.md  Verified method rename table
  class-moves.md     Verified class move/rename table
  signatures.md      Code change examples

java/               java17.md, java21.md, java25.md toolchain notes
docs/               CONTRIBUTING.md, TROUBLESHOOTING.md, FAQ.md
```

## What's new in v1.3.0-beta

- Minecraft **26.3** version data, templates and migration rules for Fabric and NeoForge, with warnings for changes that need manual work.
- Fixed Linux/macOS Gradle wrapper permissions after porting and before GUI Build/Run Client tasks.
- GUI quick links with icons: Discord, GitHub, Contribute, Report Bug, Suggest Feature.
- Completion messages pointing to bug reports and Discord support.
- Improved shared GUI/CLI Java detection for Java 25 builds and JDK folders containing patch versions.
- Fixed detection of NeoForge's `neo_version` property; automatic build output now streams to the GUI logs.
- Updated NeoForge metadata handling and Gradle wrapper versions for 26.3 projects.

Full changelog: [v1.2.0-beta...v1.3.0-beta](https://github.com/reqsery/mc-mod-porter/compare/v1.2.0-beta...v1.3.0-beta)
