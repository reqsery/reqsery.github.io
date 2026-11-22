---
title: CLI & GUI Reference
description: Every MC Mod Porter command-line command and flag, and every control, status and message in the desktop GUI.
sidebar:
  label: CLI & GUI Reference
---

One JAR does both: `java -jar auto-porter-1.3.0-beta.jar` with **no arguments** opens the GUI; **any** argument
runs the command line. The porter itself needs **Java 21+**.

## Command line

```text
auto-porter <modPath> <fromVer> <toVer> [--dry-run] [--no-build]
auto-porter --list-versions
auto-porter --setup-templates
auto-porter --help
```

### Commands

| Command | What it does |
|---|---|
| `--help` | Prints the usage above and three examples |
| `--list-versions` | Prints every supported version and its loaders, e.g. `1.20.1     Fabric, Forge`, `1.21.11    Fabric, NeoForge`, `26.1.1     Fabric` |
| `--setup-templates` | Writes `templates/<version>/gradle.properties` + `template-info.json` into a `templates` folder **in the current directory**, from the built-in version data. Existing templates are skipped. Not needed for porting — the porter never reads these files |
| `<modPath> <fromVer> <toVer>` | Ports the project — see [Architecture & Pipeline](/mc-mod-porter/architecture-and-pipeline/) |

The special commands are only recognised as the **first** argument.

### Port arguments

| Argument | Meaning |
|---|---|
| `modPath` | Path to the mod's **source/project folder** (absolute or relative). Not a `.jar`/`.zip` |
| `fromVer` | Version the mod is written for — must be an exact entry from `--list-versions` |
| `toVer` | Version to port to. Upgrades and downgrades both work |

### Flags (after the three arguments)

| Flag | Effect |
|---|---|
| `--dry-run` | Read-only preview on your original folder: source rules, resource changes and migration warnings. Nothing is copied or written, no build. Does not preview build file, `gradle.properties`, metadata or access-widener changes |
| `--no-build` | Do the full port but skip the `gradlew compileJava` check |

Any other extra argument is **silently ignored** (a typo like `--nobuild` means the build still runs). Order of the
two flags doesn't matter.

### Exit codes

| Code | When |
|---|---|
| `0` | Help / list / templates finished, dry run finished, or the port finished with `STATUS: ✓ Port complete` |
| `1` | Wrong number of arguments, path missing or not a folder, unknown version, or `STATUS: ⚠ Port complete with issues` (no `gradle.properties`, or the compile check failed) |

### Interactive prompt

Porting **from 26.x to an older version that has Fabric** asks which mappings to re-add (`1` Mojang official, the
default, or `2` Yarn). In scripts, pipe an empty line to accept the default:

```bash
echo | java -jar auto-porter-1.3.0-beta.jar ./mymod 26.1 1.21.11 --no-build
```

### Console output

Each stage prints a header the GUI also uses for its progress bar:

```text
Copying to : C:\mods\mymod-ported-1_21_11
[1/7] Updating build.gradle plugin versions...
[2/7] Updating gradle.properties...
[3/7] Patching Java sources...
[4/7] Patching resources and data files...
[5/7] Scanning for manual migration items...
[6/7] Updating mod metadata (fabric.mod.json / mods.toml)...
[7/7] Patching access widener / class tweaker...
[build] Building ported mod...
  Requires Java 21 — found at: C:\Program Files\Eclipse Adoptium\jdk-21…
  Running: gradlew.bat compileJava --no-daemon
═══════════════════════════════════
Port report: C:\mods\mymod-ported-1_21_11\build\port-report.json
STATUS: ✓ Port complete — mod ready for 1.21.11
```

Lines tagged `[INFO]` are applied changes, `[SKIP] File.java — no matching rules` means a file had nothing to
change, and `[WARN] No source rules found for X → Y` means no Java rules exist for that version range (build files
and versions are still updated).

### `scripts/port.sh`

Bash wrapper that runs `auto-porter/build/libs/auto-porter-*.jar` with your arguments (build the JAR first).

## Desktop GUI

A fixed-size window (900 × 685) titled **MC Mod Porter**.

### Project panel

| Control | Behaviour |
|---|---|
| **Project** text field | Path of the mod project folder. Pressing **Enter** runs detection |
| **Browse...** | Folder picker ("Select the extracted mod project folder") — folders only. Picking one runs detection |
| **Source Version** | **Auto Detect** or any supported version. Set automatically by detection |
| **Target Version** | Any supported version; defaults to **1.21.11** |
| **Loader** | **Auto Detect**, **Fabric** or **NeoForge**. Shown for information — the porter works out what to edit from the files themselves, so this choice is **not** passed to the port |

**Detection** (status shows `Detected <version> / <loader>`):

- *Version:* `minecraft_version` from the shallowest `gradle.properties`; otherwise the first supported version
  string found in a `.gradle`, `.gradle.kts`, `fabric.mod.json` or `mods.toml` file.
- *Loader:* `fabric.mod.json` → Fabric; else `neoforge.mods.toml` → NeoForge; else `net.neoforged`,
  `neoforge_version` or `neo_version` in a Gradle file → NeoForge.
- It looks up to 6 folders deep and ignores `.git/`, `.gradle/` and `build/` folders.

### Buttons

| Button | Action |
|---|---|
| **Port Mod** | Runs the same port as the CLI (`<path> <from> <to>`, **always with the compile check**, never dry-run). If Source is Auto Detect it detects first. Answers the 26.x mappings question with the default (Mojang) |
| **Build** | `gradlew build --no-daemon` in the ported folder (a full build, unlike the port's `compileJava` check) |
| **Run Client** | `gradlew runClient --no-daemon` in the ported folder. Enabled only when a loader is detected in the ported project |
| **Open Folder** | Opens the ported folder in your file manager |
| **Cancel** | Stops the running port/build, including Gradle child processes. Closing the window does the same |

Build, Run Client and Open Folder work on the folder created by **Port Mod in the current session** — they stay
disabled until you've ported something. For Build and Run Client the GUI picks the JDK the same way as the port's
compile check and sets `JAVA_HOME` for Gradle; on Linux/macOS it makes `gradlew` executable first.

### Status, progress and logs

- **Status:** `Ready`, `Detected …`, `Porting mod...`, `Port complete`, `Completed with issues`,
  `Building project...`, `Building project complete`, `Running client...`, `Cancelled`, `… failed (exit N)`.
- **Progress bar:** follows the `[n/7]` headers during a port (copy ≈ 8%, each step ≈ 11%, build 90%, done 100%);
  spins without a percentage during Build/Run Client.
- **Logs:** the full live output of the port or Gradle task (cleared at the start of each run). After a port it
  adds "Port complete. Found an issue? Use Report Bug below…" or "Port completed with issues. Review the logs…".

### Error pop-ups

| Message | Cause |
|---|---|
| Select the extracted mod source/project folder, not a JAR or ZIP. | Project path empty or not a folder |
| The source Minecraft version could not be detected. Select it manually. | Auto Detect found no supported version |
| Select a supported target Minecraft version. | No target selected |
| Source and target versions must be different. | Same version on both sides |
| Port a project first. | Build/Run Client before porting in this session |
| No Gradle wrapper found in … | The ported project has no `gradlew`/`gradlew.bat` |
| No ported project folder is available yet. | Open Folder before porting |
| Could not open the folder / Could not open link | Your desktop doesn't support opening folders/links |

### Quick links

Bottom row: **Discord**, **GitHub**, **Contribute** (contributor guide), **Report Bug** and **Suggest Feature**
(GitHub issue templates) — they open in your browser.
