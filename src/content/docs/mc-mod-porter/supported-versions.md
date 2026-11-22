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

## Loader versions written by each template

These are the values in `auto-porter/templates/<version>/template-info.json` — what the porter writes into
`gradle.properties` / `build.gradle` for each target. "—" means that loader has no template data for that version.

| Minecraft | Java | Fabric Loader | Fabric API | Loom | NeoForge | Forge |
|---|---|---|---|---|---|---|
| `1.16` | 16 | `0.9.2+build.206` | `0.25.0+1.16` | `0.6-SNAPSHOT` | — | `36.1.2` |
| `1.16.1` | 16 | `0.9.2+build.206` | `0.25.0+1.16` | `0.6-SNAPSHOT` | — | `36.1.2` |
| `1.16.2` | 16 | `0.9.3+build.207` | `0.29.4+1.16` | `0.6-SNAPSHOT` | — | `36.1.32` |
| `1.16.3` | 16 | `0.10.8+build.218` | `0.31.0+1.16` | `0.6-SNAPSHOT` | — | `36.2.2` |
| `1.16.4` | 16 | `0.10.8+build.218` | `0.33.2+1.16` | `0.6-SNAPSHOT` | — | `36.2.2` |
| `1.16.5` | 16 | `0.11.7+build.2` | `0.40.1+1.16` | `0.6-SNAPSHOT` | — | `36.2.39` |
| `1.17.1` | 16 | `0.11.7+build.2` | `0.46.1+1.17` | `0.7-SNAPSHOT` | — | `37.1.1` |
| `1.18` | 17 | `0.12.12+build.1` | `0.46.3+1.18` | `0.8-SNAPSHOT` | — | `38.0.17` |
| `1.18.1` | 17 | `0.12.12+build.1` | `0.46.6+1.18` | `0.8-SNAPSHOT` | — | `38.0.21` |
| `1.18.2` | 17 | `0.13.3+build.1` | `0.55.3+1.18.2` | `0.8-SNAPSHOT` | — | `40.2.0` |
| `1.19` | 17 | `0.14.9+build.1` | `0.56.0+1.19` | `0.10-SNAPSHOT` | — | `41.0.9` |
| `1.19.1` | 17 | `0.14.9+build.1` | `0.58.5+1.19.1` | `0.10-SNAPSHOT` | — | `41.1.0` |
| `1.19.2` | 17 | `0.14.21+build.1` | `0.58.5+1.19.2` | `0.10-SNAPSHOT` | — | `43.2.14` |
| `1.19.3` | 17 | `0.14.21+build.1` | `0.67.1+1.19.3` | `0.11-SNAPSHOT` | — | `44.1.0` |
| `1.19.4` | 17 | `0.15.11+build.1` | `0.83.0+1.19.4` | `0.12-SNAPSHOT` | — | `45.1.0` |
| `1.20` | 17 | `0.14.21+build.1` | `0.83.0+1.20` | `1.2-SNAPSHOT` | — | `46.0.14` |
| `1.20.1` | 17 | `0.15.11+build.1` | `0.92.7+1.20.1` | `1.2-SNAPSHOT` | — | `47.2.30` |
| `1.20.2` | 17 | `0.15.11+build.1` | `0.91.2+1.20.2` | `1.3-SNAPSHOT` | `20.2.59-beta` | — |
| `1.20.3` | 17 | `0.15.11+build.1` | `0.91.0+1.20.3` | `1.3-SNAPSHOT` | `20.3.8-beta` | — |
| `1.20.4` | 17 | `0.15.11+build.1` | `0.97.0+1.20.4` | `1.4-SNAPSHOT` | `20.4.80-beta` | — |
| `1.20.5` | 21 | `0.15.11+build.1` | `0.97.2+1.20.5` | `1.6-SNAPSHOT` | `20.5.21-beta` | — |
| `1.20.6` | 21 | `0.15.11+build.1` | `0.100.8+1.20.6` | `1.6-SNAPSHOT` | `20.6.99-beta` | — |
| `1.21` | 21 | `0.15.11+build.1` | `0.100.8+1.21` | `1.7-SNAPSHOT` | `21.0.168-beta` | — |
| `1.21.1` | 21 | `0.18.6` | `0.116.9+1.21.1` | `1.7-SNAPSHOT` | `21.1.172` | — |
| `1.21.2` | 21 | `0.18.6` | `0.110.0+1.21.2` | `1.8-SNAPSHOT` | `21.2.38-beta` | — |
| `1.21.3` | 21 | `0.18.6` | `0.110.6+1.21.3` | `1.8-SNAPSHOT` | `21.3.38-beta` | — |
| `1.21.4` | 21 | `0.18.6` | `0.119.4+1.21.4` | `1.8-SNAPSHOT` | `21.4.136` | — |
| `1.21.5` | 21 | `0.18.6` | `0.120.0+1.21.5` | `1.9-SNAPSHOT` | `21.5.35-beta` | — |
| `1.21.6` | 21 | `0.18.6` | `0.124.0+1.21.6` | `1.9-SNAPSHOT` | `21.6.25-beta` | — |
| `1.21.7` | 21 | `0.18.6` | `0.128.0+1.21.7` | `1.9-SNAPSHOT` | `21.7.15-beta` | — |
| `1.21.8` | 21 | `0.18.6` | `0.132.0+1.21.8` | `1.9-SNAPSHOT` | `21.8.15-beta` | — |
| `1.21.9` | 21 | `0.18.6` | `0.136.0+1.21.9` | `1.9-SNAPSHOT` | `21.9.15-beta` | — |
| `1.21.10` | 21 | `0.18.4` | `0.138.4+1.21.10` | `1.11-SNAPSHOT` | `21.10.50-beta` | — |
| `1.21.11` | 21 | `0.18.6` | `0.140.0+1.21.11` | `1.11-SNAPSHOT` | `21.11.0-beta` | — |
| `26.1` | 25 | `0.18.4` | `0.145.0+26.1` | `1.15` | `26.1.0.1-beta` | — |
| `26.1.1` | 25 | `0.18.4` | `0.145.3+26.1.1` | `1.15` | — | — |
| `26.1.2` | 25 | `0.19.3` | `0.154.2+26.1.2` | `1.17-SNAPSHOT` | `26.1.2.78` | — |
| `26.2` | 25 | `0.19.3` | `0.154.2+26.2` | `1.17.13` | `26.2.0.10-beta` | — |
| `26.3` | 25 | `0.19.5` | `0.163.0+26.3` | `1.17.21` | `26.3.0.88` | — |

:::tip[Always confirm against official metadata]
The reference tables in `knowledge-base/loaders/fabric/versions.md` and `knowledge-base/loaders/neoforge/versions.md`
link the official sources (Fabric meta API, Fabric Maven, NeoForged Maven). When a newer build is published, copy the
exact published version — never guess one.
:::

## NeoForge version format

- **1.20.2 – 1.21.11:** `<mcMinor>.<mcPatch>.<build>[-beta]` — e.g. `21.4.136` for MC 1.21.4. 1.20.2 is the first NeoForge version.
- **26.x:** four components, `<YY>.<drop>.<hotfix>.<build>[-beta]` — e.g. `26.1.0.10-beta` = MC 26.1 (hotfix 0), build 10, beta.
- `-beta` means breaking changes are still allowed. For the **21.4** line only, builds from `21.4.121` onward dropped the suffix.
- For 26.x, update ModDevGradle to `2.0.141+` or NeoGradle to `7.1.21+`.

## Fabric notes for 26.x

- 26.1 is fully **unobfuscated**: the `mappings` line is removed from `build.gradle` and Yarn is no longer used.
- Loom moved to the `net.fabricmc.fabric-loom` plugin ID (`1.15` for 26.1). The repository uses `1.17.13` for 26.2 and stable `1.17.21` with Gradle `9.6.0` for 26.3.
- Sources: [Fabric 26.1](https://fabricmc.net/2026/03/14/261.html), [Fabric 26.2](https://fabricmc.net/2026/06/15/262.html), [Fabric 26.3](https://fabricmc.net/2026/09/15/263.html)
