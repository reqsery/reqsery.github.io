---
title: Quickstart — GUI & CLI
description: Port a Fabric or NeoForge mod project with the MC Mod Porter desktop GUI or command line.
sidebar:
  label: Quickstart (GUI & CLI)
---

:::note
Use the **extracted mod source/project folder** containing `build.gradle`, `gradle.properties` and `src/` — not the
compiled release `.jar`.
:::

## 1. Download

From the [Releases page](https://github.com/reqsery/mc-mod-porter/releases/tag/v1.4.0-beta):

- **Windows:** `MC-Mod-Porter-1.4.0-beta-windows.zip` — unzip it and run `MC-Mod-Porter.exe`. It has its own Java
  runtime, so nothing else is needed. Run `install-windows.ps1` from the zip to add **MC Mod Porter** to the Start
  Menu and Desktop; `MC-Mod-Porter-CLI.exe` is the command-line version.
- **Any OS:** `auto-porter-1.4.0-beta.jar` — the same JAR runs the GUI and the CLI. It needs **Java 21 or newer**:

```bash
java -version
```

## 2a. GUI (recommended)

Open `MC-Mod-Porter.exe`, or launch the JAR **without arguments**:

```bash
java -jar auto-porter-1.4.0-beta.jar
```

1. Click **Browse...** and choose the mod project folder (or paste the path and press Enter).
2. Check what was detected — the status line shows e.g. `Detected 1.21.1 / Fabric / Yarn`. Set **Source Version** or
   **Source Mappings** by hand if detection got it wrong.
3. Select a **Target Version** (defaults to 1.21.11).
4. Leave **Remap to Mojang Names** on **Auto (Yarn → 26.x)** unless you want to force it (**Always**) or skip it
   (**Never**).
5. Click **Port Mod**.

The progress bar and status follow each step, and the logs show every change. The GUI port always ends with a compile
check (`gradlew compileJava`) — use the CLI for `--dry-run` or `--no-build`. The **Loader** dropdown is informational;
the porter edits whatever Fabric/NeoForge files it finds.

After porting, the same window can **Build** (`gradlew build`), **Run Client** (`gradlew runClient`), **Open Folder**
and **Cancel** a running task, with live logs. The quick links at the bottom open Discord, GitHub, contributor
guidance, bug reports and feature requests in your browser. Every control is listed in the
[CLI & GUI Reference](/mc-mod-porter/cli-and-gui-reference/#desktop-gui).

## 2b. CLI

Launching the JAR (or `MC-Mod-Porter-CLI.exe`) **with arguments** uses command-line mode.

```text
Usage:
  auto-porter <modPath> <fromVer> <toVer> [options]
  auto-porter --list-versions
  auto-porter --setup-templates
```

| Command / option | What it does |
|---|---|
| `--help` | Print usage, options and examples |
| `--list-versions` | List every supported Minecraft version with its Java version and loaders |
| `--setup-templates` | Writes `templates/<version>/` files into the current folder (not needed for porting) |
| `<modPath> <fromVer> <toVer>` | Port the project at `modPath` from `fromVer` to `toVer` (upgrade or downgrade) |
| `--dry-run` | Preview remap, source, resource and warning changes on the original folder; nothing is copied, written or built |
| `--no-build` | Port without the `gradlew compileJava` check afterwards |
| `--remap` | Remap Yarn names in the sources to Mojang names |
| `--no-remap` | Never remap (by default Yarn sources are remapped when porting to 26.x) |
| `--source-mappings auto\|yarn\|mojang` | Which names the sources use (default: detected from the build files) |

Options go **after** the three arguments; an unknown option stops with an error. Porting from 26.x to an older Fabric
version asks which mappings to re-add (press Enter for Mojang). Full details:
[CLI & GUI Reference](/mc-mod-porter/cli-and-gui-reference/).

```bash
# Show CLI help
java -jar auto-porter-1.4.0-beta.jar --help

# List supported versions
java -jar auto-porter-1.4.0-beta.jar --list-versions

# Dry run: see what would change, no files touched
java -jar auto-porter-1.4.0-beta.jar C:/path/to/mymod 1.20.4 1.20.5 --dry-run

# Port your mod
java -jar auto-porter-1.4.0-beta.jar C:/path/to/mymod 1.20.4 1.20.5

# Yarn (Fabric) sources going to 26.x are remapped to Mojang names automatically
java -jar auto-porter-1.4.0-beta.jar C:/mods/mymod 1.21.1 26.1.2

# Switch a Yarn mod to Mojang names while staying on a Yarn-capable version
java -jar auto-porter-1.4.0-beta.jar C:/mods/mymod 1.20.1 1.21.1 --remap
```

The ported mod is created **next to the original** — for example `C:/path/to/mymod-ported-1_20_5`.
**Your original project is never touched.**

:::caution[Porting to the same target again wipes the previous output]
If `mymod-ported-1_20_5` already exists, the porter **deletes it** and starts over. Move or commit any manual fixes
before re-running.
:::

If the run finishes with `STATUS: ⚠ Port complete with issues`, open `build/port-report.json` in the ported project.
It lists every step, whether it succeeded, its message and the changes made; the full compiler output is in
`port-build.log`. Lines marked `MANUAL` and the stale version check tell you what to fix by hand.

## 2c. Build from source

```bash
git clone https://github.com/reqsery/mc-mod-porter.git
cd mc-mod-porter/auto-porter
./gradlew build          # Windows: gradlew.bat build
java -jar build/libs/auto-porter-1.4.0-beta.jar --help
./gradlew packageWindowsApp   # Windows only: build/jpackage/MC-Mod-Porter/MC-Mod-Porter.exe
```

There is also a bash wrapper once the JAR is built:

```bash
./scripts/port.sh --list-versions
./scripts/port.sh /path/to/mymod 1.20.4 1.21.10
```

## 3. Build the ported project

The ported project may need a **different JDK** from the porter itself — 26.x projects need **JDK 25**. Check the
[JDK matrix](/mc-mod-porter/supported-versions/#java-requirements), then:

```bash
cd C:/path/to/mymod-ported-1_20_5
./gradlew build
```

If something fails, see [Troubleshooting](/mc-mod-porter/troubleshooting/).
