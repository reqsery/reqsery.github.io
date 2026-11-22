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

Get `auto-porter-1.3.0-beta.jar` from the
[Releases page](https://github.com/reqsery/mc-mod-porter/releases/tag/v1.3.0-beta). The same standalone JAR runs the
GUI and the CLI. It needs **Java 21 or newer**:

```bash
java -version
```

## 2a. GUI (recommended)

Launch the JAR **without arguments**:

```bash
java -jar auto-porter-1.3.0-beta.jar
```

1. Choose the mod project folder.
2. Confirm the detected **source version** and **loader**.
3. Select a **target version**.
4. Click **Port Mod**.

The same window can **rebuild** the ported project, **run its Gradle client task** where supported, **open the output
folder**, and show live porter/build logs. The quick links at the bottom open Discord, GitHub, contributor guidance,
bug reports and feature requests in your browser.

## 2b. CLI

Launching the JAR **with arguments** uses command-line mode.

```text
Usage:
  auto-porter <modPath> <fromVer> <toVer> [--dry-run] [--no-build]
  auto-porter --setup-templates
  auto-porter --list-versions
```

| Command / flag | What it does |
|---|---|
| `--help` | Print usage and examples |
| `--list-versions` | List every supported Minecraft version |
| `--setup-templates` | Set up the per-version templates |
| `<modPath> <fromVer> <toVer>` | Port the project at `modPath` from `fromVer` to `toVer` |
| `--dry-run` | Show what would change; no files are touched (also skips the build) |
| `--no-build` | Port without running the Gradle build verification afterwards |

```bash
# Show CLI help
java -jar auto-porter-1.3.0-beta.jar --help

# List supported versions
java -jar auto-porter-1.3.0-beta.jar --list-versions

# Dry run: see what would change, no files touched
java -jar auto-porter-1.3.0-beta.jar C:/path/to/mymod 1.20.4 1.20.5 --dry-run

# Port your mod
java -jar auto-porter-1.3.0-beta.jar C:/path/to/mymod 1.20.4 1.20.5

# Jump to 26.x without running the build
java -jar auto-porter-1.3.0-beta.jar C:/mods/mymod 1.20.1 26.1 --no-build
```

The ported mod is created **next to the original** — for example `C:/path/to/mymod-ported-1_20_5`.
**Your original project is never touched.**

If the run finishes with `STATUS: ⚠ Port complete with issues`, open `build/port-report.json` in the ported project.
It lists every step, whether it succeeded, its message and the changes made.

## 2c. Build from source

```bash
git clone https://github.com/reqsery/mc-mod-porter.git
cd mc-mod-porter/auto-porter
./gradlew build          # Windows: gradlew.bat build
java -jar build/libs/auto-porter-1.3.0-beta.jar --help
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
