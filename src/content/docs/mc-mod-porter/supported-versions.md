---
title: Supported Versions & JDK Matrix
description: Every Minecraft version MC Mod Porter supports (1.16 through 26.3), the loader versions it writes, and the JDK each needs.
sidebar:
  label: Supported Versions & JDK
---

## Supported Minecraft versions

**1.x format:** `1.16` – `1.16.5` · `1.17.1` · `1.18` – `1.18.2` · `1.19` – `1.19.4` · `1.20` – `1.20.6` · `1.21` – `1.21.11`

**26.x format** (calendar versioning, from 2026): `26.1` · `26.1.1` · `26.1.2` · `26.2` · `26.3`

:::note
`1.17` (without `.1`) is **not** in the list — the 1.17 line is supported through `1.17.1`. Run
`java -jar auto-porter-1.3.0-beta.jar --list-versions` to print the exact list your JAR supports.
:::

Why the version format changed at 26.1 is explained in the [FAQ](/mc-mod-porter/faq/#why-did-minecraft-switch-from-1x-to-26x-versioning).

## Java requirements

MC Mod Porter **itself requires Java 21 or newer**. Building the *generated* project may need a different JDK depending
on its target Minecraft version:

| Minecraft versions | Java required |
|---|---|
| 1.16 – 1.17.x | Java 16 |
| 1.18 – 1.20.4 | Java 17 |
| 1.20.5 – 1.21.11 | Java 21 |
| 26.1+ | Java 25 (LTS) |

Class-file major versions you may see in `UnsupportedClassVersionError`: `61` = Java 17, `65` = Java 21, `69` = Java 25.

For 26.x, set the Gradle toolchain to 25:

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

tasks.withType(JavaCompile).configureEach {
    it.options.release = 25
}
```

## Versions the porter writes

These are the values from the porter's built-in `VersionDatabase` — exactly what lands in `gradle.properties`
(step 2) and `fabric.mod.json` (step 6) for each **target** version. "—" means the porter has no value for that
loader on that version (the key is left unchanged).

:::caution[The `templates/` folders are not used]
`auto-porter/templates/<version>/template-info.json` contains **older, different** numbers for versions before
26.1.2. Those files are only written by `--setup-templates` and are never read during a port. Trust this table.
:::

| Minecraft | Java | Loaders | Fabric Loader | Fabric API | Loom | Yarn (backport only) | NeoForge | Forge | Architectury API |
|---|---|---|---|---|---|---|---|---|---|
| `1.16` | 16 | Fabric, Forge | `0.19.2` | `0.42.0+1.16` | `1.16-SNAPSHOT` | `1.16+build.4` | — | `36.1.2` | `1.0.6` |
| `1.16.1` | 16 | Fabric, Forge | `0.19.2` | `0.42.0+1.16` | `1.16-SNAPSHOT` | `1.16.1+build.21` | — | `36.1.2` | `1.0.6` |
| `1.16.2` | 16 | Fabric, Forge | `0.19.2` | `0.42.0+1.16` | `1.16-SNAPSHOT` | `1.16.2+build.47` | — | `36.1.32` | `1.0.6` |
| `1.16.3` | 16 | Fabric, Forge | `0.19.2` | `0.42.0+1.16` | `1.16-SNAPSHOT` | `1.16.3+build.47` | — | `36.2.2` | `1.0.8` |
| `1.16.4` | 16 | Fabric, Forge | `0.19.2` | `0.42.0+1.16` | `1.16-SNAPSHOT` | `1.16.4+build.9` | — | `36.2.2` | `1.0.12` |
| `1.16.5` | 16 | Fabric, Forge | `0.19.2` | `0.42.0+1.16` | `1.16-SNAPSHOT` | `1.16.5+build.10` | — | `36.2.39` | `1.0.15` |
| `1.17.1` | 16 | Fabric, Forge | `0.19.2` | `0.46.1+1.17` | `1.16-SNAPSHOT` | `1.17.1+build.65` | — | `37.1.1` | `2.0.12` |
| `1.18` | 17 | Fabric, Forge | `0.19.2` | `0.44.0+1.18` | `1.16-SNAPSHOT` | `1.18+build.1` | — | `38.0.17` | `2.0.20` |
| `1.18.1` | 17 | Fabric, Forge | `0.19.2` | `0.46.6+1.18` | `1.16-SNAPSHOT` | `1.18.1+build.22` | — | `38.0.21` | `2.1.49` |
| `1.18.2` | 17 | Fabric, Forge | `0.19.2` | `0.77.0+1.18.2` | `1.16-SNAPSHOT` | `1.18.2+build.4` | — | `40.2.0` | `2.3.4` |
| `1.19` | 17 | Fabric, Forge | `0.19.2` | `0.58.0+1.19` | `1.16-SNAPSHOT` | `1.19+build.4` | — | `41.0.9` | `3.3.4` |
| `1.19.1` | 17 | Fabric, Forge | `0.19.2` | `0.58.5+1.19.1` | `1.16-SNAPSHOT` | `1.19.1+build.6` | — | `41.1.0` | `3.3.4` |
| `1.19.2` | 17 | Fabric, Forge | `0.19.2` | `0.77.0+1.19.2` | `1.16-SNAPSHOT` | `1.19.2+build.28` | — | `43.2.14` | `4.1.96` |
| `1.19.3` | 17 | Fabric, Forge | `0.19.2` | `0.76.1+1.19.3` | `1.16-SNAPSHOT` | `1.19.3+build.5` | — | `44.1.0` | `4.9.0` |
| `1.19.4` | 17 | Fabric, Forge | `0.19.2` | `0.87.2+1.19.4` | `1.16-SNAPSHOT` | `1.19.4+build.2` | — | `45.1.0` | `6.5.2` |
| `1.20` | 17 | Fabric, Forge | `0.19.2` | `0.83.0+1.20` | `1.16-SNAPSHOT` | `1.20+build.1` | — | `46.0.14` | `7.1.4` |
| `1.20.1` | 17 | Fabric, Forge | `0.19.2` | `0.92.8+1.20.1` | `1.16-SNAPSHOT` | `1.20.1+build.10` | — | `47.2.30` | `9.1.4` |
| `1.20.2` | 17 | Fabric, NeoForge | `0.19.2` | `0.91.6+1.20.2` | `1.16-SNAPSHOT` | `1.20.2+build.4` | `20.2.59-beta` | — | `9.1.12` |
| `1.20.3` | 17 | Fabric, NeoForge | `0.19.2` | `0.91.1+1.20.3` | `1.16-SNAPSHOT` | `1.20.3+build.1` | `20.3.8-beta` | — | `10.1.16` |
| `1.20.4` | 17 | Fabric, NeoForge | `0.19.2` | `0.97.3+1.20.4` | `1.16-SNAPSHOT` | `1.20.4+build.3` | `20.4.80-beta` | — | `11.1.2` |
| `1.20.5` | 21 | Fabric, NeoForge | `0.19.2` | `0.97.8+1.20.5` | `1.16-SNAPSHOT` | `1.20.5+build.1` | `20.5.21-beta` | — | `13.0.6` |
| `1.20.6` | 21 | Fabric, NeoForge | `0.19.2` | `0.100.8+1.20.6` | `1.16-SNAPSHOT` | `1.20.6+build.3` | `20.6.99-beta` | — | `13.0.6` |
| `1.21` | 21 | Fabric, NeoForge | `0.19.2` | `0.102.0+1.21` | `1.16-SNAPSHOT` | `1.21+build.9` | `21.0.168-beta` | — | `13.0.8` |
| `1.21.1` | 21 | Fabric, NeoForge | `0.19.2` | `0.116.11+1.21.1` | `1.16-SNAPSHOT` | `1.21.1+build.3` | `21.1.172` | — | `13.0.8` |
| `1.21.2` | 21 | Fabric, NeoForge | `0.19.2` | `0.106.1+1.21.2` | `1.16-SNAPSHOT` | `1.21.2+build.1` | `21.2.38-beta` | — | `14.0.4` |
| `1.21.3` | 21 | Fabric, NeoForge | `0.19.2` | `0.114.1+1.21.3` | `1.16-SNAPSHOT` | `1.21.3+build.2` | `21.3.38-beta` | — | `14.0.4` |
| `1.21.4` | 21 | Fabric, NeoForge | `0.19.2` | `0.119.4+1.21.4` | `1.16-SNAPSHOT` | `1.21.4+build.8` | `21.4.136` | — | `15.0.3` |
| `1.21.5` | 21 | Fabric, NeoForge | `0.19.2` | `0.128.2+1.21.5` | `1.16-SNAPSHOT` | `1.21.5+build.1` | `21.5.35-beta` | — | `14.1.0` |
| `1.21.6` | 21 | Fabric, NeoForge | `0.19.2` | `0.128.2+1.21.6` | `1.16-SNAPSHOT` | `1.21.6+build.1` | `21.6.25-beta` | — | `15.0.0` |
| `1.21.7` | 21 | Fabric, NeoForge | `0.19.2` | `0.129.0+1.21.7` | `1.16-SNAPSHOT` | `1.21.7+build.8` | `21.7.15-beta` | — | `15.0.4` |
| `1.21.8` | 21 | Fabric, NeoForge | `0.19.2` | `0.136.1+1.21.8` | `1.16-SNAPSHOT` | `1.21.8+build.1` | `21.8.15-beta` | — | `16.0.0` |
| `1.21.9` | 21 | Fabric, NeoForge | `0.19.2` | `0.134.1+1.21.9` | `1.16-SNAPSHOT` | `1.21.9+build.1` | `21.9.15-beta` | — | `17.0.0` |
| `1.21.10` | 21 | Fabric, NeoForge | `0.19.2` | `0.138.4+1.21.10` | `1.16-SNAPSHOT` | `1.21.10+build.3` | `21.10.50-beta` | — | `18.0.6` |
| `1.21.11` | 21 | Fabric, NeoForge | `0.19.2` | `0.141.3+1.21.11` | `1.16-SNAPSHOT` | `1.21.11+build.5` | `21.11.0-beta` | — | `18.0.8` |
| `26.1` | 25 | Fabric, NeoForge | `0.19.2` | `0.145.1+26.1` | `1.16-SNAPSHOT` | — | `26.1.0.1-beta` | — | — |
| `26.1.1` | 25 | Fabric | `0.19.2` | `0.145.4+26.1.1` | `1.16-SNAPSHOT` | — | — | — | — |
| `26.1.2` | 25 | Fabric, NeoForge | `0.19.3` | `0.154.2+26.1.2` | `1.17-SNAPSHOT` | — | `26.1.2.78` | — | — |
| `26.2` | 25 | Fabric, NeoForge | `0.19.3` | `0.154.2+26.2` | `1.17.13` | — | `26.2.0.10-beta` | — | — |
| `26.3` | 25 | Fabric, NeoForge | `0.19.5` | `0.163.0+26.3` | `1.17.21` | — | `26.3.0.88` | — | — |

Notes:

- **Fabric Loader** is largely version-independent, so one loader version is used for many Minecraft versions.
- **Loom** is written to `loom_version` only if that key exists. The `1.16-SNAPSHOT` / `1.17` Loom lines need a
  recent Gradle; the porter only updates the Gradle wrapper for **26.3** targets, so old projects may need
  `./gradlew wrapper --gradle-version <version>` by hand.
- **Yarn** is only used when you backport from 26.x and choose Yarn at the mappings prompt.
- **Forge** values only exist up to 1.20.1; **NeoForge** starts at 1.20.2. `26.1.1` has no NeoForge entry, so a
  NeoForge project ported to 26.1.1 keeps its old NeoForge version.
- The Java column is what the target Minecraft version needs; the porter itself only rewrites the Java toolchain
  between **21 and 25** ([details](/mc-mod-porter/architecture-and-pipeline/#17--buildgradle--buildgradlekts)).

:::tip[Always confirm against official metadata]
If a dependency can't be resolved, check the exact published version on
[Fabric meta](https://meta.fabricmc.net/v2/versions/loader), [Fabric Maven](https://maven.fabricmc.net/) or
[NeoForged Maven](https://maven.neoforged.net/releases/net/neoforged/neoforge/) and edit `gradle.properties`.
The reference tables in `knowledge-base/loaders/` link these sources.
:::

## NeoForge version format

- **1.20.2 – 1.21.11:** `<mcMinor>.<mcPatch>.<build>[-beta]` — e.g. `21.4.136` for MC 1.21.4. 1.20.2 is the first NeoForge version.
- **26.x:** four components, `<YY>.<drop>.<hotfix>.<build>[-beta]` — e.g. `26.1.0.10-beta` = MC 26.1 (hotfix 0), build 10, beta.
- `-beta` means breaking changes are still allowed. For the **21.4** line only, builds from `21.4.121` onward dropped the suffix.
- For 26.x, update ModDevGradle to `2.0.141+` or NeoGradle to `7.1.21+` — the porter does **not** change NeoForge
  plugin versions in `build.gradle`.
- For a NeoForge-only project ported to **26.3**, the porter sets the Gradle wrapper to **9.2.1** (official NeoForge
  26.3 MDK).

## Fabric notes for 26.x

- 26.1 is fully **unobfuscated**: the porter removes the `mappings` line from `build.gradle` and Yarn is no longer
  used.
- The porter renames the Loom plugin ID to `net.fabricmc.fabric-loom` and writes `loom_version` from the table
  above (`1.16-SNAPSHOT` for 26.1–26.1.1, `1.17-SNAPSHOT` for 26.1.2, `1.17.13` for 26.2, `1.17.21` for 26.3).
  Fabric's own 26.1 announcement used Loom `1.15`; if the snapshot line doesn't resolve for you, pin the version
  from the announcement.
- For a Fabric-only project ported to **26.3**, the porter sets the Gradle wrapper to **9.6.0**, matching Fabric's
  26.3 guidance.
- Sources: [Fabric 26.1](https://fabricmc.net/2026/03/14/261.html), [Fabric 26.2](https://fabricmc.net/2026/06/15/262.html), [Fabric 26.3](https://fabricmc.net/2026/09/15/263.html)
