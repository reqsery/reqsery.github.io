---
title: Architecture & Pipeline
description: Exactly what MC Mod Porter does to a project, step by step — copying, every file it edits, how Java sources are rewritten, build verification, JDK detection and the port report.
sidebar:
  label: Architecture & Pipeline
---

This page describes what `auto-porter` (v1.4.0-beta) **actually does**, taken from its source code. If something
here disagrees with an older guide, this page is the reference.

## Big picture

```text
your mod folder ──copy──▶ <mod>-ported-<target>/
                            │
   Inspecting project        detects Yarn / Mojang source mappings and decides whether to remap
   [1/9] build scripts       build.gradle(.kts): Java, Minecraft, Loom / ModDevGradle, loader/API versions,
                             26.x Loom changes, Parchment — plus the Gradle wrapper
   [2/9] gradle.properties   versions from the built-in version tables
   [3/9] remap               Yarn → Mojang names in .java / .kt sources (when needed)
   [4/9] version rules       literal find-and-replace rules, then mixin target renames
   [5/9] resources/data      26.2 / 26.3 upgrades only (pack formats, shaders, tags, worldgen)
   [6/9] warnings            26.2 / 26.3 upgrades only (things needing manual work)
   [7/9] mod metadata        fabric.mod.json, mods.toml / neoforge.mods.toml, *.mixins.json
   [8/9] access widener      .accesswidener ↔ .classtweaker for 26.x
   [9/9] stale versions      reports old version numbers still left in the build files
   [build]                   gradlew compileJava --no-daemon  (skipped with --no-build / --dry-run)
                            │
                            ▼
                  build/port-report.json  +  port-build.log
```

Everything runs on **one copy** of your project. Your original folder is never modified. The porter works on
**source projects only** — it never decompiles or remaps compiled mod JARs.

## 0. Input checks and the output folder

- The path must be a **folder**. A file path stops with
  `ERROR: Auto-Porter needs a mod source/project folder, not a compiled file.` (with an extra hint for `.jar` and
  `.zip`). A missing path stops with `ERROR: Mod path does not exist: …`.
- Both versions must be in the supported list, otherwise `ERROR: Unknown source version: …` (followed by the full
  supported list) or `ERROR: Unknown target version: …`. Versions are matched exactly after trimming spaces — `1.19`
  works, `1.19.0` does not.
- Unknown options stop the run with `Unknown option: … (see --help)` (exit code 1) instead of being ignored.
- The output folder is created **next to** the source: `<folder name>-ported-<target with dots → underscores>`,
  e.g. `mymod` → `mymod-ported-1_21_11`.

:::danger[Re-running a port deletes the previous output]
If the output folder already exists it is **deleted and recreated** (`Output dir already exists, removing: …`).
Any manual fixes you made inside `mymod-ported-1_21_11` are lost when you port to the same target again. Copy your
fixed project somewhere else (or commit it to git) before re-running.
:::

- The copy skips `build/`, `.gradle/` and `.git/` at the project root.
- On Linux/macOS the copied `gradlew` is made executable.

### Inspecting the project (source mappings)

Before copying, the porter prints which names the sources use and whether it will remap them:

```text
Inspecting project...
  Source mappings: YARN (build script uses Yarn 1.21.1+build.3)
  Remap sources  : yes (Yarn → Mojang) — 26.x has no Yarn: official Mojang names are required
```

| Detected | When |
|---|---|
| `YARN` | a `net.fabricmc:yarn:` mappings line (the build is read from it, or from `yarn_mappings` in `gradle.properties`) |
| `MOJANG` | `loom.officialMojangMappings()`, a NeoForge/Forge project, or a 26.x source version |
| `UNKNOWN` | no mappings declaration found |

`--source-mappings yarn|mojang` overrides the detection. Sources are remapped when they use **Yarn** and either the
target is **26.x** (Yarn doesn't exist there) or you pass `--remap`. `--no-remap` turns it off. 26.x sources are never
remapped — they already use official names.

### Mappings question when backporting from 26.x

When the source is **26.x** and the target is **older** and supports Fabric, the CLI asks:

```text
Mappings choice (required for pre-26.x Fabric builds):
  1) Mojang official  [loom.officialMojangMappings()]
  2) Yarn              [<yarn build>:v2]
Enter 1 or 2 [default: 1]:
```

26.x is unobfuscated and has no mappings line; older Fabric builds need one again. Pressing Enter picks Mojang. If
the target has no known Yarn build, choosing 2 falls back to Mojang. **The GUI always answers with the default
(Mojang).** The porter does not remap Mojang names back to Yarn.

## 1/9 — Build scripts and the Gradle wrapper

Files checked: the root `build.gradle(.kts)` plus build files **one folder deep** (e.g. `fabric/`, `neoforge/`,
`common/`), skipping sub-folders that contain their own `settings.gradle(.kts)` (separate projects).
`settings.gradle` itself is **never edited**. **Groovy and Kotlin DSL** are both handled (`id 'x' version 'y'` and
`id("x") version "y"`).

Versions written straight into the build script are updated as well as property-driven ones (`${project.x}` values
are left for step 2).

**Every project:**

| Change | Pattern |
|---|---|
| Java | `JavaLanguageVersion.of(N)`, `JavaVersion.VERSION_N` / `VERSION_1_8`, `sourceCompatibility` / `targetCompatibility`, `options.release = N`, `release.set(N)` → the target's Java ([table](/mc-mod-porter/supported-versions/#java-requirements)) |
| Minecraft | `com.mojang:minecraft:<version>` → target version |

**Fabric** (a build file containing `fabric-loom`):

| Change | Pattern |
|---|---|
| Loom plugin version | `id 'fabric-loom' / 'net.fabricmc.fabric-loom' / 'net.fabricmc.fabric-loom-remap' version '…'` → the target's Loom |
| Loader / API | `net.fabricmc:fabric-loader:…` and `net.fabricmc.fabric-api:fabric-api:…` literals → target versions |
| 26.x: plugin id | `fabric-loom` / `net.fabricmc.fabric-loom-remap` → `net.fabricmc.fabric-loom` |
| 26.x: mappings | `mappings loom.officialMojangMappings()`, `mappings "net.fabricmc:yarn:…"` and single-block `mappings loom.layered { … }` lines are removed |
| 26.x: configurations | `modImplementation`, `modCompileOnly`, `modCompileOnlyApi`, `modApi`, `modRuntimeOnly`, `modLocalRuntime` → `implementation`, `compileOnly`, `compileOnlyApi`, `api`, `runtimeOnly`, `localRuntime` |
| 26.x: tasks | `remapJar` → `jar`, `remapSourcesJar` → `sourcesJar` |
| before 26.x: plugin id | `net.fabricmc.fabric-loom` → `net.fabricmc.fabric-loom-remap` |
| before 26.x: Yarn | a hard-coded Yarn build → the target's Yarn build; if the sources were remapped, the Yarn line becomes `mappings loom.officialMojangMappings()` |
| before 26.x: re-add mappings | no `mappings` line but a `minecraft "com.mojang:minecraft:…"` line → `mappings loom.officialMojangMappings()` (or the Yarn line you chose) is inserted after it; `implementation` → `modImplementation` for loader and API |

**NeoForge** (ModDevGradle `net.neoforged.moddev`, NeoGradle, or a `net.neoforged:neoforge:` dependency):

| Change | Pattern |
|---|---|
| ModDevGradle | `id 'net.neoforged.moddev' version '…'` → the MDK's version for the target (e.g. `2.0.148`) |
| NeoForge | `neoForge { version = "…" }` (also on one line), `neoForge.version = "…"` and `net.neoforged:neoforge:…` → target NeoForge |
| 26.x: Parchment | `parchment { … }` blocks are commented out (the 26.x MDKs don't use Parchment) |

**Gradle wrapper** (`gradle/wrapper/gradle-wrapper.properties`): set to the version the official template uses for the
target — Fabric example mod for Fabric projects, NeoForge MDK for NeoForge projects
([values](/mc-mod-porter/supported-versions/#versions-the-porter-writes)). The old `distributionSha256Sum` line is
removed, since it would fail verification for the new download. Mixed Fabric + NeoForge projects and Architectury
Loom / ForgeGradle projects keep their wrapper, with a note in the log.

Things this step does **not** change: Architectury Loom / ForgeGradle plugin versions, and third-party dependency
versions (e.g. `jei-1.21.1-neoforge`) — [step 9](#99--stale-version-check) lists those for you.

## 2/9 — `gradle.properties`

Files checked: `gradle.properties`, `common/gradle.properties`, `fabric/gradle.properties`,
`neoforge/gradle.properties`. If none exist the step **fails** (`No gradle.properties found in …`).

Values come from the porter's built-in version tables for the target version. Only keys that **already exist** are
replaced (nothing new is added, except Yarn below):

| Key(s) | Set to |
|---|---|
| `minecraft_version` | target version |
| `minecraft_version_range` | `[<target>]` |
| `fabric_loader_version`, `loader_version` | Fabric Loader |
| `fabric_version`, `fabric_api_version` | Fabric API |
| `loom_version` | Loom |
| `architectury_api_version` | Architectury API (when known for the target) |
| `neoforge_version`, `neo_version` | NeoForge (only if the target has NeoForge) |
| `neo_version_range` | `[<NeoForge>,)` |
| `moddev_version`, `mdg_version` | ModDevGradle |
| `java_version` | the target's Java version |
| `forge_version` | Forge (only 1.16.1–1.20.1) |
| `yarn_mappings` | the target's Yarn build; **commented out** on 26.x or when the sources were remapped to Mojang; added after `minecraft_version` when you chose Yarn in the backport question |
| `parchment_*` | **commented out** on 26.x |

Keys with other names (`mc_version`, `fabric_api`, `neoforge_loader_version`, …) are **not** touched.

## 3/9 — Remapping (Yarn → Mojang)

Runs only when the [inspection](#inspecting-the-project-source-mappings) decided to remap. It works on **source
code**, never on compiled JARs.

**Mappings:** the porter downloads the Yarn `mergedv2` mappings for the project's Yarn build from
[maven.fabricmc.net](https://maven.fabricmc.net/net/fabricmc/yarn/) and Mojang's official client/server mappings for
the source Minecraft version from Mojang's
[version manifest](https://piston-meta.mojang.com/mc/game/version_manifest_v2.json), then joins them on the shared
obfuscated names. Files are downloaded **once** and cached in `~/.mc-mod-porter/mappings/` (change it with
`-Dmcmodporter.cache=<folder>`). No internet and no cache → the step fails with a message and the rest of the port
still runs.

**Files:** `.java` and `.kt` under `src/main` and `src/client` (`java/` and `kotlin/`), in the root project and in
`common/`, `fabric/` and `neoforge/`.

**What is renamed:**

- Minecraft classes — imports, fully-qualified names and nested classes (`AbstractBlock.Settings` →
  `BlockBehaviour.Properties`).
- Static methods and fields used through a known Minecraft class (`SomeClass.member`) — looked up on that class.
- Other methods and fields after `.` or `::` when the Yarn name has exactly **one** Mojang name across all of
  Minecraft (`this.textRenderer` → `this.font`, `context.drawTextWithShadow(…)` → `context.drawString(…)`).
- `@Override` methods, Kotlin `override fun`, and `@Shadow` members in mixins.

**What is never touched:** comments, string and character literals (including text blocks), names your mod declares
itself, and very common JDK method names (`add`, `get`, `of`, `size`, …) unless the owner is a known Minecraft class.

**Reported for manual work** (as `MANUAL` lines and in the report): a method whose Yarn overloads have different
Mojang names (`Identifier.of(…) has several Mojang names [fromNamespaceAndPath, parse]…`), wildcard
`net.minecraft…*` imports, and mixin target strings (`method = "…"`, `@At(target = "…")`, `@Accessor("…")`).

Example output:

```text
[3/9] Remapping sources (Yarn → Mojang)...
  Loading Yarn 1.21.1+build.3 + Mojang 1.21.1 mappings (cache: …/.mc-mod-porter/mappings)
  8262 classes mapped
  [OK] Remapped 16 name(s) in 1 of 1 source file(s)
       • src/main/java/example/MyScreen.java: remapped 16 name(s) Yarn → Mojang
       • class renames: DrawContext → GuiGraphics, Identifier → ResourceLocation, MinecraftClient → Minecraft, …
```

The version rules in step 4 then run on the Mojang names (for example `ResourceLocation` → `Identifier` for
1.21.11+).

:::caution[Remapping is not type-aware]
The remapper reads tokens, not types. A call on a local variable whose method name maps to different Mojang names in
different classes (for example `player.getBlockPos()`) is left alone, and the compile check shows it. Fix those by
hand using the target version's names.
:::

## 4/9 — Version rules (Java sources)

Files checked: every `.java` file under `src/main/java`, `common/src/main/java`, `fabric/src/main/java` and
`neoforge/src/main/java`.

### How the rules are chosen

1. Take the rules of **every adjacent version hop** between source and target, in order
   (`1.20.1→1.20.2`, `1.20.2→1.20.3`, …). Downgrades walk the list backwards.
2. Add rules defined **directly** for any `source → target` span inside the path.
3. Remove duplicates: rules with the same type and the same "find" text are merged — the **first** one wins.

### How a rule is applied

Each rule is a **literal find-and-replace** (`String.replace`) — not a regular expression, not a Java parser. Rules
run one after another over the whole file, so a later rule sees the result of earlier ones. The rule *type*
(`CLASS_RENAME`, `METHOD_RENAME`, `METHOD_SIGNATURE`, `FIELD_RENAME`, `IMPORT_CHANGE`, `MIXIN_TARGET`,
`TEXT_REPLACE`) is only a label for the report; all types are applied the same way.

Consequences worth knowing:

- Matches happen **anywhere** in the text — code, comments and strings alike — but only on the exact spelling in the
  rule (spacing, parameter names and line breaks included). Code written slightly differently is not changed.
- It cannot tell two classes with the same simple name apart and does not fix logic.

### Mixin targets (second pass)

After the rules, a small resolver renames **method names inside mixin targets**, both JVM descriptors
(`"Lnet/minecraft/…/Screen;render(…)"`) and dot form (`Screen.render(`). It currently knows the 1.21.11 ↔ 26.1 GUI
renames — see [Migration Rules](/mc-mod-porter/migration-rules/#mixin-target-renames).

## 5/9 — Resources and data (26.2 / 26.3 upgrades only)

Runs only when the port **upgrades through** `26.1.2 → 26.2` and/or `26.2 → 26.3`. Downgrades and all other
versions skip it. Details: [Migration Rules → resources](/mc-mod-porter/migration-rules/#resource-and-data-migrations).

## 6/9 — Migration warnings (26.2 / 26.3 upgrades only)

Searches `.java`, `.gradle`, `.kts`, `.json`, `.mcmeta` and shader files for APIs that changed in ways that can't be
rewritten safely and prints one line per hit:

```text
src/main/java/…/MyScreen.java: MANUAL 26.3 REVIEW for `GLFW.` - 26.3 input/windowing: GLFW constants are no longer valid; …
```

The full list of what it looks for is in [Migration Rules](/mc-mod-porter/migration-rules/#manual-review-warnings).

## 7/9 — Mod metadata

**`fabric.mod.json`** (every copy found in the project):

- `depends.minecraft` → `~<target>` (added if missing)
- `depends.fabricloader` → `>=<Fabric Loader version>` (added if missing)
- `depends.architectury` → `>=<Architectury version>` (only if it was already there)
- 26.x: the legacy `"fabric"` dependency id → `"fabric-api"`
- Gradle placeholders such as `"~${minecraft_version}"` are left alone (they are filled from `gradle.properties`).
- The file is re-written as pretty-printed JSON, so formatting and key order may change.

**`mods.toml` / `neoforge.mods.toml`:** the literal `versionRange` of the `minecraft` dependency → `[<target>,)` and of
the `neoforge` dependency → `[<NeoForge>,)`. `${…}` placeholders and `loaderVersion` are left alone.

**`*.mixins.json`:** `"compatibilityLevel": "JAVA_N"` → the target's Java (e.g. `JAVA_21` → `JAVA_25`).

**Not touched:** `pack.mcmeta` outside 26.2/26.3 upgrades, mod `version` fields.

## 8/9 — Access widener / class tweaker

Looks in `src/main/resources`, `fabric/src/main/resources` and `common/src/main/resources`.

| Target | What happens |
|---|---|
| 26.x | `*.accesswidener` → renamed to `*.classtweaker`; header namespace `named` → `official`; `fabric.mod.json` key `"accessWidener"` → `"classTweaker"`; file name updated in `build.gradle(.kts)` |
| older | the reverse: `*.classtweaker` → `*.accesswidener`, `official` → `named`, `"classTweaker"` → `"accessWidener"` |

## 9/9 — Stale version check

Before patching, the porter records the project's old version numbers: the source Minecraft version, the version
properties (`minecraft_version`, `neo_version`, `loader_version`, `fabric_version`, `loom_version`, `yarn_mappings`, …),
the plugin and dependency versions in the build scripts, and the Gradle wrapper version. After patching it searches
`build.gradle(.kts)`, the `gradle.properties` files and `gradle-wrapper.properties` for any of them (comments are
ignored) and lists every line that still contains one:

```text
[9/9] Checking build files for stale version numbers...
  [OK] WARNING: 1 stale version number(s) left in build files — review before building
       • build.gradle:2: still contains 1.21.1 (source Minecraft version) — implementation "mezz.jei:jei-1.21.1-neoforge:19.21.0.247"
```

These are usually third-party dependencies: look up the version built for your target and update them by hand. The
check only warns — it does not fail the port.

## Build verification

Unless `--no-build` or `--dry-run` is used, the porter runs in the ported folder:

```text
gradlew compileJava --no-daemon        (gradlew.bat on Windows)
```

It is a **compile check**, not a full `build` (no jar, no data generation, no tests).

**Which JDK it uses:** it reads the Java version from the root `build.gradle` (or `build.gradle.kts`) —
`JavaLanguageVersion.of(N)`, `sourceCompatibility`, `options.release`, or `….set(N)` — defaulting to **21** if none
is found. It then looks for a matching JDK (one that has `bin/javac` and a `release` file with
`JAVA_VERSION="N…"`) in this order: the JDK running the porter, `JAVA_HOME`, then common install folders
(Eclipse Adoptium/Temurin, Microsoft, Oracle `Program Files/Java`, Amazon Corretto, `/usr/lib/jvm`,
`/Library/Java/JavaVirtualMachines`, including folders with patch versions in their name). The one it finds is
passed to Gradle as `JAVA_HOME`.

- Required **25+** and not found → the build is not attempted:
  `Java 25 is required to build this mod but was not found. Install JDK 25 and make sure JAVA_HOME points to it, then retry.`
- Required 21 or lower and not found → it builds anyway with your normal environment.
- No `gradlew`/`gradlew.bat` in the ported folder → `No gradlew found at …`.

Output is streamed live and saved to **`port-build.log`** in the ported folder. The report keeps the important
lines: `…java:NN: error: …` plus 3 lines of context, `> Task … FAILED`, and the `* What went wrong:` block.

## The report and exit status

`build/port-report.json` in the ported folder:

```json
{
  "sourceMod": "C:/mods/mymod",
  "outputMod": "C:/mods/mymod-ported-1_21_11",
  "fromVersion": "1.21.4",
  "toVersion": "1.21.11",
  "sourceMappings": "MOJANG",
  "remapped": false,
  "startedAt": "2026-11-22 15:00:00",
  "steps": [
    { "step": "build.gradle",      "success": true, "message": "…", "changes": ["…"] },
    { "step": "gradle.properties", "success": true, "message": "…", "changes": ["minecraft_version: 1.21.4 → 1.21.11"] },
    { "step": "remap", … }, { "step": "sources", … }, { "step": "resources", … }, { "step": "warnings", … },
    { "step": "metadata", … }, { "step": "accesswidener", … }, { "step": "stale-versions", … },
    { "step": "build", "success": false, "exitCode": 1, "errors": "…", "logFile": "…/port-build.log" }
  ],
  "success": false,
  "completedAt": "2026-11-22 15:01:10"
}
```

With `--no-build` the build step is `"success": "skipped"`. The run ends with either
`STATUS: ✓ Port complete — mod ready for <target>` (exit code 0) or
`STATUS: ⚠ Port complete with issues — review port-report.json` (exit code 1) — the latter when a step failed
(for example no `gradle.properties`, or remapping could not download the mappings) or the compile check failed.
Stale-version warnings and `MANUAL` lines do not fail the port.

## Dry run

`--dry-run` does **not** copy anything. Against your **original** folder, in read-only mode, it previews the remap
(when one would run), the source rules, the resource step and the warning scan, then:

```text
[DRY RUN] build.gradle, gradle.properties, the Gradle wrapper and metadata would also be updated.
[DRY RUN] No files were modified.
```

It does not preview build-script, `gradle.properties`, wrapper, metadata or access-widener changes, and never builds.

## Where version numbers come from

The values written in steps 1, 2 and 7 come from the porter's built-in `VersionDatabase` and `BuildTooling` tables,
checked against the official Fabric example mod, NeoForge MDKs and Maven metadata — see the
[version table](/mc-mod-porter/supported-versions/#versions-the-porter-writes). The `auto-porter/templates/`
folders (written by `--setup-templates`) hold the same values but are **not** read during a port.
