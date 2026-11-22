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

- **Status:** Beta — current release `v1.4.0-beta`
- **Download:** [Releases page](https://github.com/reqsery/mc-mod-porter/releases/tag/v1.4.0-beta) —
  `auto-porter-1.4.0-beta.jar` (one cross-platform JAR for the GUI and the CLI) or, on Windows,
  `MC-Mod-Porter-1.4.0-beta-windows.zip` (`MC-Mod-Porter.exe` with its own Java runtime)
- **Requires:** Java 21+ to run the JAR (the Windows app needs no Java install); building the ported mod needs the
  target's JDK (see [Supported Versions & JDK](/mc-mod-porter/supported-versions/))
- **Video:** [Auto-Porter demo on YouTube](https://www.youtube.com/watch?v=bEKUnVigAlw)
- **License:** MIT + Commons Clause
- **Support:** [Discord](https://discord.gg/vV2USr9phF) · [GitHub Discussions](https://github.com/reqsery/mc-mod-porter/discussions)

![MC Mod Porter v1.4.0-beta desktop GUI with detected source mappings and remap options](/mc-mod-porter-gui.png)

## The Golden Rule

:::note[The knowledge base is the single source of truth.]
Every API change in `auto-porter` is backed by a verified source (Mojang, Fabric, NeoForge official docs).
**No guessing. No hallucinations.**
:::

If an entry cannot be linked to an official Mojang, FabricMC, NeoForged or Gradle source, it is not added. Wikis,
search snippets and compile-only claims are not treated as primary evidence. See
[Knowledge Base & Migration Rules](/mc-mod-porter/knowledge-base/) for the full accuracy policy.

## What it does

The auto-porter handles the **mechanical, repetitive part** of version porting. It copies your project to
`<mod>-ported-<target>` and then:

1. **Build scripts + Gradle wrapper** — `build.gradle` / `build.gradle.kts` (Groovy and Kotlin DSL), hard-coded
   and property-driven versions alike: Loom and ModDevGradle plugins, `neoForge { version }`, Fabric Loader/API,
   Minecraft, the Java toolchain, the 26.x Loom changes (`net.fabricmc.fabric-loom`, no mappings, `mod*` → plain
   configurations, `remapJar` → `jar`), and the Gradle wrapper the official Fabric example mod / NeoForge MDK use
2. **`gradle.properties`** — Minecraft, Fabric Loader/API, Loom, NeoForge, ModDevGradle, Forge and Architectury
   versions and ranges
3. **Yarn → Mojang remapping** of `.java` / `.kt` sources, using Yarn and Mojang's official mappings (automatic when
   Yarn sources go to 26.x, which has no Yarn)
4. **Java sources** — verified find-and-replace rules for every version hop crossed, plus mixin target renames
5. **Resources/data** — pack formats, shaders, tags and worldgen for 26.2/26.3 upgrades
6. **Manual-review warnings** for semantic 26.2/26.3 changes it can't safely rewrite
7. **Mod metadata** — `fabric.mod.json`, the `mods.toml` Minecraft/NeoForge ranges and mixin `compatibilityLevel`
8. **Access widener ↔ class tweaker** for 26.x
9. **Stale version check** — lists any old version numbers still left in the build files
10. **Compile check** — `gradlew compileJava` with an automatically chosen JDK

Each port writes a machine-readable report to `build/port-report.json` and the full build output to
`port-build.log`. Every step is explained in [Architecture & Pipeline](/mc-mod-porter/architecture-and-pipeline/),
every flag and button in the [CLI & GUI Reference](/mc-mod-porter/cli-and-gui-reference/), and every automatic
change in [Migration Rules](/mc-mod-porter/migration-rules/).

## What it does not do

**Logic changes.** If your code uses APIs that were completely redesigned, you need to fix those manually — for
26.2/26.3 upgrades the tool tells you where. Semantic API changes, mixins and third-party dependencies can require
manual fixes; a completed port is **not** a guarantee that every mod compiles or runs. Always review the output,
warnings and `port-report.json`.

It also does **not**: edit `settings.gradle`, Architectury Loom / ForgeGradle plugin versions or third-party
dependency versions (the stale version check points them out), remap Mojang names back to Yarn, or decompile
anything.

:::caution[Source projects only]
Auto-Porter needs a **mod source/project folder** containing `build.gradle`, `gradle.properties`,
`gradlew`/`gradlew.bat` and `src/`. Compiled mod JARs from Modrinth/CurseForge cannot be ported. If you have a source
ZIP, extract it first.
:::

## Porting by hand with the repository

The repository is also a reference you can use without the tool:

1. **Check** `knowledge-base/minecraft/` for breaking API changes between versions
2. **Look up** `patterns/` for quick cross-version rename tables
3. **Find** `knowledge-base/loaders/` for correct dependency versions
4. **Verify** `java/` for Java toolchain requirements
5. **Run** `auto-porter` to apply the changes it automates, then fix the rest by hand

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

## What's new in v1.4.0-beta

- **NeoForge build fix:** porting to 26.1.2 (or any version) now updates hard-coded `id 'net.neoforged.moddev' version '…'`
  and `neoForge { version = "…" }` values instead of leaving the 1.21.1 ones behind.
- **Build tooling migration:** Loom and ModDevGradle plugin versions, Fabric Loader/API and NeoForge literals, the
  Gradle wrapper, the Java toolchain for every Java version, mixin `compatibilityLevel`, the 26.x Loom changes
  (`net.fabricmc.fabric-loom`, `mod*` configurations, `remapJar`), `"fabric"` → `"fabric-api"`, and Parchment on 26.x
  — in Groovy and Kotlin DSL.
- **Yarn → Mojang source remapping** with `--remap`, `--no-remap` and `--source-mappings`, plus matching GUI options.
- **Stale version check** after patching.
- **Version data rebuilt from official sources** — Fabric example mod, NeoForge MDKs and Maven metadata — for all
  39 supported versions.
- **GUI:** source mappings and remap dropdowns, progress that moves through every step (it no longer sits at 0%),
  readable symbols in the log.
- **Windows app:** `MC-Mod-Porter.exe` with its own Java runtime, plus an install script for Start Menu and Desktop
  shortcuts.
- Unknown CLI options now stop with an error instead of being ignored.
- Fixed version rules that only fired for one exact source → target pair, and rules that used `1.19.0`.

Full changelog: [v1.3.0-beta...v1.4.0-beta](https://github.com/reqsery/mc-mod-porter/compare/v1.3.0-beta...v1.4.0-beta)
