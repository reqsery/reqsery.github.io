---
title: Architecture & Pipeline
description: Exactly what MC Mod Porter does to a project, step by step — copying, every file it edits, how Java sources are rewritten, build verification, JDK detection and the port report.
sidebar:
  label: Architecture & Pipeline
---

This page describes what `auto-porter` (v1.3.0-beta) **actually does**, taken from its source code. If something
here disagrees with an older guide, this page is the reference.

## Big picture

```text
your mod folder ──copy──▶ <mod>-ported-<target>/
                            │
   [1/7] build.gradle        structural changes only (26.x Loom id, mappings, Java 21↔25)
   [2/7] gradle.properties   versions from the built-in VersionDatabase
   [3/7] Java sources        literal find-and-replace rules, then mixin target renames
   [4/7] resources/data      26.2 / 26.3 upgrades only (pack formats, shaders, tags, worldgen)
   [5/7] warnings            26.2 / 26.3 upgrades only (things needing manual work)
   [6/7] mod metadata        fabric.mod.json, mods.toml / neoforge.mods.toml
   [7/7] access widener      .accesswidener ↔ .classtweaker for 26.x
   [build]                   gradlew compileJava --no-daemon  (skipped with --no-build / --dry-run)
                            │
                            ▼
                  build/port-report.json  +  port-build.log
```

Everything runs on **one copy** of your project. Your original folder is never modified.

## 0. Input checks and the output folder

- The path must be a **folder**. A file path stops with
  `ERROR: Auto-Porter needs a mod source/project folder, not a compiled file.` (with an extra hint for `.jar` and
  `.zip`). A missing path stops with `ERROR: Mod path does not exist: …`.
- Both versions must be in the supported list, otherwise `ERROR: Unknown source version: …` (followed by the full
  supported list) or `ERROR: Unknown target version: …`. Versions are matched exactly after trimming spaces — `1.19`
  works, `1.19.0` does not.
- The output folder is created **next to** the source: `<folder name>-ported-<target with dots → underscores>`,
  e.g. `mymod` → `mymod-ported-1_21_11`.

:::danger[Re-running a port deletes the previous output]
If the output folder already exists it is **deleted and recreated** (`Output dir already exists, removing: …`).
Any manual fixes you made inside `mymod-ported-1_21_11` are lost when you port to the same target again. Copy your
fixed project somewhere else (or commit it to git) before re-running.
:::

- The copy skips `build/`, `.gradle/` and `.git/` at the project root.
- On Linux/macOS the copied `gradlew` is made executable.

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
(Mojang).**

## 1/7 — `build.gradle` / `build.gradle.kts`

Files checked: the root `build.gradle(.kts)` plus build files **one folder deep** (e.g. `fabric/`, `neoforge/`,
`common/`), skipping sub-folders that contain their own `settings.gradle(.kts)` (separate projects).
`settings.gradle` itself is **never edited**.

:::caution[Loader, Loom and dependency versions are not edited here]
Version numbers change through `gradle.properties` (step 2). If your build file hard-codes versions (for example
`id 'fabric-loom' version '1.7-SNAPSHOT'` or `"net.fabricmc:fabric-loader:0.15.11"`), they stay as they were —
update them by hand from the [version table](/mc-mod-porter/supported-versions/).
:::

**When the target is 26.x:**

| Change | Pattern |
|---|---|
| Loom plugin id | `id 'fabric-loom'` and `id 'net.fabricmc.fabric-loom-remap'` → `id 'net.fabricmc.fabric-loom'` |
| Remove mappings | `mappings loom.officialMojangMappings()` (with or without `=`), `mappings "net.fabricmc:yarn:…"` and single-block `mappings loom.layered { … }` lines are deleted |
| Fabric deps | `modImplementation "net.fabricmc:fabric-loader:…"` / `"net.fabricmc.fabric-api:fabric-api:…"` → `implementation` |
| Java 21 → 25 | `JavaLanguageVersion.of(21)`, `sourceCompatibility`/`targetCompatibility = JavaVersion.VERSION_21` or `= 21`, `….options.release = 21` |
| Gradle wrapper (26.3 only) | Fabric-only project → Gradle **9.6.0**; NeoForge-only → **9.2.1**; both → left alone with a "review manually" note |

**When the target is older than 26.x** (always runs, mostly matters for backports from 26.x):

| Change | Pattern |
|---|---|
| Loom plugin id | `id 'net.fabricmc.fabric-loom'` → `id 'net.fabricmc.fabric-loom-remap'` |
| Re-add mappings | if there is no `mappings ` line but a `minecraft "com.mojang:minecraft:…"` line, a `mappings loom.officialMojangMappings()` line (or the Yarn line you chose) is inserted right after it |
| Fabric deps | `implementation` → `modImplementation` for fabric-loader and fabric-api |
| Java 25 → 21 | the same four patterns as above, reversed |

Things this step does **not** do:

- It only switches Java **21 ↔ 25**. Porting 1.21 → 1.18 leaves `JavaLanguageVersion.of(21)` alone (1.18 needs 17).
- The patterns are written for **Groovy** syntax (`id 'x'`, `modImplementation "x"`). Kotlin DSL files are found,
  and the Java-version patterns work there, but `id("fabric-loom")` and `modImplementation("…")` are **not**
  rewritten.
- Plugin blocks for NeoForge (ModDevGradle / NeoGradle) and Architectury are not changed.

## 2/7 — `gradle.properties`

Files checked: `gradle.properties`, `common/gradle.properties`, `fabric/gradle.properties`,
`neoforge/gradle.properties`. If none exist the step **fails** (`No gradle.properties found in …`).

Values come from the porter's built-in **VersionDatabase** for the target version. Only keys that **already exist**
are replaced (nothing new is added, except Yarn below):

| Key(s) | Set to |
|---|---|
| `minecraft_version` | target version |
| `fabric_loader_version`, `loader_version` | Fabric Loader |
| `fabric_version`, `fabric_api_version` | Fabric API |
| `loom_version` | Loom |
| `architectury_api_version` | Architectury API (when known for the target) |
| `neoforge_version`, `neo_version` | NeoForge (only if the target has NeoForge) |
| `forge_version` | Forge (only 1.16–1.20.1) |
| `minecraft_version_range` | `[<target>]` |
| `yarn_mappings` | only when you chose Yarn in the backport question — updated, or added after `minecraft_version` |

Keys with other names (`mc_version`, `fabric_api`, `neoforge_loader_version`, …) are **not** touched.

## 3/7 — Java sources

Files checked: every `.java` file under `src/main/java`, `common/src/main/java`, `fabric/src/main/java` and
`neoforge/src/main/java`. Other source sets (`src/client/java`, `src/test/java`, Kotlin files) are **not** patched.

### How the rules are chosen

1. Take the rules of **every adjacent version hop** between source and target, in order
   (`1.20.1→1.20.2`, `1.20.2→1.20.3`, …). Downgrades walk the list backwards.
2. Add rules defined **directly** for the exact `source → target` pair.
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
- The build file lists the JavaParser library as a dependency, but the porter does not use it.

### Mixin targets (second pass)

After the rules, a small resolver renames **method names inside mixin targets**, both JVM descriptors
(`"Lnet/minecraft/…/Screen;render(…)"`) and dot form (`Screen.render(`). It currently knows the 1.21.11 ↔ 26.1 GUI
renames — see [Migration Rules](/mc-mod-porter/migration-rules/#mixin-target-renames).

## 4/7 — Resources and data (26.2 / 26.3 upgrades only)

Runs only when the port **upgrades through** `26.1.2 → 26.2` and/or `26.2 → 26.3`. Downgrades and all other
versions skip it. Details: [Migration Rules → resources](/mc-mod-porter/migration-rules/#resource-and-data-migrations).

## 5/7 — Migration warnings (26.2 / 26.3 upgrades only)

Searches `.java`, `.gradle`, `.kts`, `.json`, `.mcmeta` and shader files for APIs that changed in ways that can't be
rewritten safely and prints one line per hit:

```text
src/main/java/…/MyScreen.java: MANUAL 26.3 REVIEW for `GLFW.` - 26.3 input/windowing: GLFW constants are no longer valid; …
```

The full list of what it looks for is in [Migration Rules](/mc-mod-porter/migration-rules/#manual-review-warnings).

## 6/7 — Mod metadata

**`fabric.mod.json`** (every copy found in the project):

- `depends.minecraft` → `~<target>` (added if missing)
- `depends.fabricloader` → `>=<Fabric Loader version>` (added if missing)
- `depends.architectury` → `>=<Architectury version>` (only if it was already there)
- The file is re-written as pretty-printed JSON, so formatting and key order may change.

**`mods.toml` / `neoforge.mods.toml`:** only the `versionRange` of the `minecraft` dependency changes, to
`[<target>,)`. `loaderVersion` and the `neoforge` dependency range are **left alone**.

**Not touched:** `*.mixins.json` (update `compatibilityLevel` yourself, e.g. `JAVA_21`/`JAVA_25`), `pack.mcmeta`
outside 26.2/26.3 upgrades, mod `version` fields.

## 7/7 — Access widener / class tweaker

Looks in `src/main/resources`, `fabric/src/main/resources` and `common/src/main/resources`.

| Target | What happens |
|---|---|
| 26.x | `*.accesswidener` → renamed to `*.classtweaker`; header namespace `named` → `official`; `fabric.mod.json` key `"accessWidener"` → `"classTweaker"`; file name updated in `build.gradle(.kts)` |
| older | the reverse: `*.classtweaker` → `*.accesswidener`, `official` → `named`, `"classTweaker"` → `"accessWidener"` |

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
  "startedAt": "2026-11-22 15:00:00",
  "steps": [
    { "step": "build.gradle",      "success": true, "message": "…", "changes": ["…"] },
    { "step": "gradle.properties", "success": true, "message": "…", "changes": ["minecraft_version: 1.21.4 → 1.21.11"] },
    { "step": "sources", … }, { "step": "resources", … }, { "step": "warnings", … },
    { "step": "metadata", … }, { "step": "accesswidener", … },
    { "step": "build", "success": false, "exitCode": 1, "errors": "…", "logFile": "…/port-build.log" }
  ],
  "success": false,
  "completedAt": "2026-11-22 15:01:10"
}
```

With `--no-build` the build step is `"success": "skipped"`. The run ends with either
`STATUS: ✓ Port complete — mod ready for <target>` (exit code 0) or
`STATUS: ⚠ Port complete with issues — review port-report.json` (exit code 1) — the latter when the
`gradle.properties` step failed or the compile check failed.

## Dry run

`--dry-run` does **not** copy anything. It runs the source rules, the resource step and the warning scan against your
**original** folder in read-only mode and prints what would change, then:

```text
[DRY RUN] build.gradle and gradle.properties would also be updated.
[DRY RUN] No files were modified.
```

It does not preview `build.gradle`, `gradle.properties`, metadata or access-widener changes, and never builds.

## Where version numbers come from

The values written in step 2 and step 6 come from the porter's built-in `VersionDatabase` — see the
[version table](/mc-mod-porter/supported-versions/#versions-the-porter-writes). The `auto-porter/templates/`
folders and `--setup-templates` are **not** used during a port (and the older templates are out of date).
