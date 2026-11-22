---
title: CLI & GUI Reference
description: Every MC Mod Porter command-line command and flag, and every control, status and message in the desktop GUI.
sidebar:
  label: CLI & GUI Reference
---

One JAR does both: `java -jar auto-porter-1.4.0-beta.jar` with **no arguments** opens the GUI; **any** argument
runs the command line. The porter itself needs **Java 21+**. On Windows, `MC-Mod-Porter.exe` (GUI) and
`MC-Mod-Porter-CLI.exe` (command line) do the same with a bundled Java runtime — see [Windows app](#windows-app).

## Command line

```text
auto-porter <modPath> <fromVer> <toVer> [options]
auto-porter --list-versions
auto-porter --setup-templates
auto-porter --help
```

### Commands

| Command | What it does |
|---|---|
| `--help` | Prints the usage, every option and examples |
| `--list-versions` | Prints every supported version with its Java version and loaders, e.g. `1.16.1      Java 8   Fabric, Forge`, `26.1.2      Java 25  Fabric, NeoForge` |
| `--setup-templates` | Writes `templates/<version>/gradle.properties` + `template-info.json` into a `templates` folder **in the current directory**, from the built-in version data. Existing templates are skipped. Not needed for porting — the porter never reads these files |
| `<modPath> <fromVer> <toVer>` | Ports the project — see [Architecture & Pipeline](/mc-mod-porter/architecture-and-pipeline/) |

The special commands are only recognised as the **first** argument.

### Port arguments

| Argument | Meaning |
|---|---|
| `modPath` | Path to the mod's **source/project folder** (absolute or relative). Not a `.jar`/`.zip` |
| `fromVer` | Version the mod is written for — must be an exact entry from `--list-versions` |
| `toVer` | Version to port to. Upgrades and downgrades both work |

### Options (after the three arguments)

| Option | Effect |
|---|---|
| `--dry-run` | Read-only preview on your original folder: remap, source rules, resource changes and migration warnings. Nothing is copied or written, no build. Does not preview build-script, `gradle.properties`, wrapper, metadata or access-widener changes |
| `--no-build` | Do the full port but skip the `gradlew compileJava` check |
| `--remap` | Remap Yarn names in the sources to Mojang names, also for targets that still have Yarn |
| `--no-remap` | Never remap. Without either option, Yarn sources are remapped only when the target is 26.x |
| `--source-mappings <mode>` | `auto` (default: detected from the build files), `yarn` or `mojang`. Also written as `--source-mappings=yarn` |

The order of the options doesn't matter. An unknown option (for example the typo `--nobuild`) stops with
`Unknown option: --nobuild (see --help)`; `--remap` together with `--no-remap` and an unknown mappings mode are errors
too. See [Remapping](/mc-mod-porter/architecture-and-pipeline/#39--remapping-yarn--mojang) for what gets renamed.

### Exit codes

| Code | When |
|---|---|
| `0` | Help / list / templates finished, dry run finished, or the port finished with `STATUS: ✓ Port complete` |
| `1` | Wrong number of arguments, an invalid option, path missing or not a folder, unknown version, or `STATUS: ⚠ Port complete with issues` (a step failed — e.g. no `gradle.properties`, or the mappings could not be downloaded — or the compile check failed) |

### Interactive prompt

Porting **from 26.x to an older version that has Fabric** asks which mappings to re-add (`1` Mojang official, the
default, or `2` Yarn). In scripts, pipe an empty line to accept the default:

```bash
echo | java -jar auto-porter-1.4.0-beta.jar ./mymod 26.1 1.21.11 --no-build
```

### Console output

Each stage prints a header the GUI also uses for its progress bar:

```text
Inspecting project...
  Source mappings: YARN (build script uses Yarn 1.21.1+build.3)
  Remap sources  : yes (Yarn → Mojang) — 26.x has no Yarn: official Mojang names are required
Copying to : C:\mods\mymod-ported-26_1_2
[1/9] Updating build scripts and Gradle wrapper...
[2/9] Updating gradle.properties...
[3/9] Remapping sources (Yarn → Mojang)...
[4/9] Applying version rules to Java sources...
[5/9] Patching resources and data files...
[6/9] Scanning for manual migration items...
[7/9] Updating mod metadata (fabric.mod.json / mods.toml / mixins)...
[8/9] Patching access widener / class tweaker...
[9/9] Checking build files for stale version numbers...
[build] Verifying with Gradle...
  Requires Java 25 — found at: C:\Program Files\Eclipse Adoptium\jdk-25…
  Running: gradlew.bat compileJava --no-daemon
═══════════════════════════════════
Port report: C:\mods\mymod-ported-26_1_2\build\port-report.json
STATUS: ✓ Port complete — mod ready for 26.1.2
```

Lines tagged `[INFO]` are applied changes, `MANUAL` lines need your attention, `[SKIP] File.java — no matching rules`
means a file had nothing to change, and `[WARN] No source rules found for X → Y` means no Java rules exist for that
version range (build files and versions are still updated).

On a console that isn't UTF-8 (the Windows default), symbols are printed as plain text instead: `->` for `→`, `-`
for `•`, `OK` for `✓`, `!` for `⚠`.

### `scripts/port.sh`

Bash wrapper that runs `auto-porter/build/libs/auto-porter-*.jar` with your arguments (build the JAR first).

## Desktop GUI

A fixed-size window (900 × 745) titled **MC Mod Porter**.

![MC Mod Porter v1.4.0-beta desktop GUI](/mc-mod-porter-gui.png)

### Project panel

| Control | Behaviour |
|---|---|
| **Project** text field | Path of the mod project folder. Pressing **Enter** runs detection |
| **Browse...** | Folder picker ("Select the extracted mod project folder") — folders only. Picking one runs detection |
| **Source Version** | **Auto Detect** or any supported version. Set automatically by detection |
| **Target Version** | Any supported version; defaults to **1.21.11** |
| **Loader** | **Auto Detect**, **Fabric** or **NeoForge**. Shown for information — the porter works out what to edit from the files themselves, so this choice is **not** passed to the port |
| **Source Mappings** | **Auto Detect**, **Yarn** or **Mojang** — which names the sources use. Set by detection; **Yarn**/**Mojang** are passed as `--source-mappings` |
| **Remap to Mojang Names** | **Auto (Yarn → 26.x)** (default: remap Yarn sources only when the target is 26.x), **Always** (`--remap`) or **Never** (`--no-remap`) |

**Detection** (status shows `Detected <version> / <loader> / <mappings>`, e.g. `Detected 1.21.1 / Fabric / Yarn`):

- *Version:* `minecraft_version` from the shallowest `gradle.properties`; otherwise the first supported version
  string found in a `.gradle`, `.gradle.kts`, `fabric.mod.json` or `mods.toml` file.
- *Loader:* `fabric.mod.json` → Fabric; else `neoforge.mods.toml` → NeoForge; else `net.neoforged`,
  `neoforge_version` or `neo_version` in a Gradle file → NeoForge.
- *Mappings:* a Yarn mappings line → Yarn; `loom.officialMojangMappings()`, NeoForge/Forge or 26.x → Mojang
  ([details](/mc-mod-porter/architecture-and-pipeline/#inspecting-the-project-source-mappings)).
- It looks up to 6 folders deep and ignores `.git/`, `.gradle/` and `build/` folders.

### Buttons

| Button | Action |
|---|---|
| **Port Mod** | Runs the same port as the CLI (`<path> <from> <to>` plus the mappings/remap options, **always with the compile check**, never dry-run). If Source is Auto Detect it detects first. Answers the 26.x mappings question with the default (Mojang) |
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
- **Progress bar:** starts at 0% and moves through every stage of a port — inspecting 10%, copying 15%, each of the
  nine steps up to 82%, the compile check 85% and then +1% per Gradle task, done 100%. The status line names the
  current step (e.g. `Remapping sources (Yarn → Mojang)`, `Verifying Gradle build`). It never moves backwards, and
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

## Windows app

The Windows download `MC-Mod-Porter-1.4.0-beta-windows.zip` contains:

| File | What it is |
|---|---|
| `MC-Mod-Porter.exe` | The desktop GUI |
| `MC-Mod-Porter-CLI.exe` | The command line (same arguments as the JAR) |
| `runtime/` | The bundled Java runtime — no Java install needed to run the porter |
| `install-windows.ps1` | Copies the app to `%LOCALAPPDATA%\Programs\MC-Mod-Porter` and adds **MC Mod Porter** to the Start Menu (Windows search) and the Desktop. `-NoDesktopShortcut` skips the Desktop one |
| `uninstall-windows.ps1` | Removes the app and its shortcuts |

```powershell
powershell -ExecutionPolicy Bypass -File .\install-windows.ps1
```

Building a ported mod still needs the right JDK for its target version — the bundled runtime only runs the porter.
To build the app from source: `gradlew packageWindowsApp` (app folder) or `gradlew packageWindowsZip` (release zip)
in `auto-porter/`.
