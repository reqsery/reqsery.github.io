---
title: Supported Versions & JDK Matrix
description: Every Minecraft version MC Mod Porter supports (1.16 through 26.3), the loader, plugin and Gradle versions it writes, and the JDK each needs.
sidebar:
  label: Supported Versions & JDK
---

## Supported Minecraft versions

**1.x format:** `1.16` – `1.16.5` · `1.17.1` · `1.18` – `1.18.2` · `1.19` – `1.19.4` · `1.20` – `1.20.6` · `1.21` – `1.21.11`

**26.x format** (calendar versioning, from 2026): `26.1` · `26.1.1` · `26.1.2` · `26.2` · `26.3`

:::note
`1.17` (without `.1`) is **not** in the list — the 1.17 line is supported through `1.17.1`. Run
`java -jar auto-porter-1.4.0-beta.jar --list-versions` to print the exact list your JAR supports (with the Java
version each one needs).
:::

Why the version format changed at 26.1 is explained in the [FAQ](/mc-mod-porter/faq/#why-did-minecraft-switch-from-1x-to-26x-versioning).

## Java requirements

MC Mod Porter **itself requires Java 21 or newer** (the Windows app bundles its own runtime). Building the
*generated* project needs the JDK of its target Minecraft version — the same Java version the official Fabric example
mod and NeoForge MDK use:

| Minecraft versions | Java required |
|---|---|
| 1.16 – 1.16.5 | Java 8 |
| 1.17.1 | Java 16 |
| 1.18 – 1.20.4 | Java 17 |
| 1.20.5 – 1.21.11 | Java 21 |
| 26.1+ | Java 25 (LTS) |

Class-file major versions you may see in `UnsupportedClassVersionError`: `52` = Java 8, `60` = Java 16, `61` = Java 17,
`65` = Java 21, `69` = Java 25.

The porter rewrites the Java version in the build script for you — `JavaLanguageVersion.of(N)`,
`JavaVersion.VERSION_N` (`VERSION_1_8` for Java 8), `sourceCompatibility`/`targetCompatibility`, `options.release`
and `release.set(N)` — and the `compatibilityLevel` (`JAVA_N`) in every `*.mixins.json`. For 26.x the result looks
like this:

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

These are the values from the porter's built-in `VersionDatabase` and `BuildTooling` tables — exactly what lands in
`build.gradle(.kts)`, `gradle.properties`, the Gradle wrapper and the mod metadata for each **target** version.
"—" means there is no value for that loader on that version (the key is left unchanged).

:::note[Where the numbers come from]
Every value was checked against official sources only:
**Fabric** — the [official Fabric example mod](https://github.com/FabricMC/fabric-example-mod) branch for that
Minecraft version (Loom, Gradle wrapper, Fabric API), [Fabric meta](https://meta.fabricmc.net/v2/versions/loader) and
[Fabric Maven](https://maven.fabricmc.net/); **NeoForge** — the
[official NeoForge MDKs](https://github.com/NeoForgeMDKs) (ModDevGradle, Gradle wrapper) and
[NeoForged Maven](https://maven.neoforged.net/releases/net/neoforged/neoforge/) (newest NeoForge build for each
Minecraft version); **Forge / Architectury** — their official Maven metadata. The `auto-porter/templates/` folders are
generated from the same data and a test keeps them in sync.
:::

| Minecraft | Java | Loaders | Fabric Loader | Fabric API | Loom | Gradle (Fabric) | NeoForge | ModDevGradle | Gradle (NeoForge) | Yarn | Forge | Architectury API |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `1.16` | 8 | Fabric | `0.20.1` | `0.42.0+1.16` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.16+build.4` | — | — |
| `1.16.1` | 8 | Fabric, Forge | `0.20.1` | `0.42.0+1.16` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.16.1+build.21` | `32.0.108` | — |
| `1.16.2` | 8 | Fabric, Forge | `0.20.1` | `0.42.0+1.16` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.16.2+build.47` | `33.0.61` | — |
| `1.16.3` | 8 | Fabric, Forge | `0.20.1` | `0.42.0+1.16` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.16.3+build.47` | `34.1.42` | — |
| `1.16.4` | 8 | Fabric, Forge | `0.20.1` | `0.42.0+1.16` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.16.4+build.9` | `35.1.37` | — |
| `1.16.5` | 8 | Fabric, Forge | `0.20.1` | `0.42.0+1.16` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.16.5+build.10` | `36.2.42` | `1.32.68` |
| `1.17.1` | 16 | Fabric, Forge | `0.20.1` | `0.46.1+1.17` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.17.1+build.65` | `37.1.1` | `2.10.12` |
| `1.18` | 17 | Fabric, Forge | `0.20.1` | `0.44.0+1.18` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.18+build.1` | `38.0.17` | `3.9.66` |
| `1.18.1` | 17 | Fabric, Forge | `0.20.1` | `0.46.6+1.18` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.18.1+build.22` | `39.1.2` | `3.9.66` |
| `1.18.2` | 17 | Fabric, Forge | `0.20.1` | `0.77.0+1.18.2` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.18.2+build.4` | `40.3.12` | `4.12.94` |
| `1.19` | 17 | Fabric, Forge | `0.20.1` | `0.58.0+1.19` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.19+build.4` | `41.1.0` | `5.14.84` |
| `1.19.1` | 17 | Fabric, Forge | `0.20.1` | `0.58.5+1.19.1` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.19.1+build.6` | `42.0.9` | `5.14.84` |
| `1.19.2` | 17 | Fabric, Forge | `0.20.1` | `0.77.0+1.19.2` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.19.2+build.28` | `43.5.2` | `6.6.92` |
| `1.19.3` | 17 | Fabric, Forge | `0.20.1` | `0.76.1+1.19.3` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.19.3+build.5` | `44.1.23` | `7.1.86` |
| `1.19.4` | 17 | Fabric, Forge | `0.20.1` | `0.87.2+1.19.4` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.19.4+build.2` | `45.4.5` | `8.2.91` |
| `1.20` | 17 | Fabric, Forge | `0.20.1` | `0.83.0+1.20` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.20+build.1` | `46.0.14` | `9.2.14` |
| `1.20.1` | 17 | Fabric, Forge | `0.20.1` | `0.92.12+1.20.1` | `1.19-SNAPSHOT` | `9.8.2` | — | — | — | `1.20.1+build.10` | `47.4.29` | `9.2.14` |
| `1.20.2` | 17 | Fabric, NeoForge | `0.20.1` | `0.91.6+1.20.2` | `1.19-SNAPSHOT` | `9.8.2` | `20.2.93` | — | — | `1.20.2+build.4` | — | `10.1.20` |
| `1.20.3` | 17 | Fabric, NeoForge | `0.20.1` | `0.91.1+1.20.3` | `1.19-SNAPSHOT` | `9.8.2` | `20.3.8-beta` | — | — | `1.20.3+build.1` | — | — |
| `1.20.4` | 17 | Fabric, NeoForge | `0.20.1` | `0.97.3+1.20.4` | `1.19-SNAPSHOT` | `9.8.2` | `20.4.253` | `2.0.148` | `9.2.1` | `1.20.4+build.3` | — | `11.1.17` |
| `1.20.5` | 21 | Fabric, NeoForge | `0.20.1` | `0.97.8+1.20.5` | `1.19-SNAPSHOT` | `9.8.2` | `20.5.21-beta` | `2.0.92` | `8.14.2` | `1.20.5+build.1` | — | `12.0.29` |
| `1.20.6` | 21 | Fabric, NeoForge | `0.20.1` | `0.100.8+1.20.6` | `1.19-SNAPSHOT` | `9.8.2` | `20.6.144` | `2.0.148` | `9.2.1` | `1.20.6+build.3` | — | `12.1.4` |
| `1.21` | 21 | Fabric, NeoForge | `0.20.1` | `0.102.0+1.21` | `1.19-SNAPSHOT` | `9.8.2` | `21.0.167` | `2.0.148` | `9.2.1` | `1.21+build.9` | — | `13.0.12` |
| `1.21.1` | 21 | Fabric, NeoForge | `0.20.1` | `0.116.18+1.21.1` | `1.19-SNAPSHOT` | `9.8.2` | `21.1.267` | `2.0.148` | `9.2.1` | `1.21.1+build.3` | — | `13.0.12` |
| `1.21.2` | 21 | Fabric, NeoForge | `0.20.1` | `0.106.1+1.21.2` | `1.19-SNAPSHOT` | `9.8.2` | `21.2.1-beta` | `2.0.148` | `9.2.1` | `1.21.2+build.1` | — | `14.0.4` |
| `1.21.3` | 21 | Fabric, NeoForge | `0.20.1` | `0.114.1+1.21.3` | `1.19-SNAPSHOT` | `9.8.2` | `21.3.100` | `2.0.148` | `9.2.1` | `1.21.3+build.2` | — | `14.0.4` |
| `1.21.4` | 21 | Fabric, NeoForge | `0.20.1` | `0.119.4+1.21.4` | `1.19-SNAPSHOT` | `9.8.2` | `21.4.161` | `2.0.148` | `9.2.1` | `1.21.4+build.8` | — | `15.0.3` |
| `1.21.5` | 21 | Fabric, NeoForge | `0.20.1` | `0.128.2+1.21.5` | `1.19-SNAPSHOT` | `9.8.2` | `21.5.101` | `2.0.148` | `9.2.1` | `1.21.5+build.1` | — | `16.1.4` |
| `1.21.6` | 21 | Fabric, NeoForge | `0.20.1` | `0.128.2+1.21.6` | `1.19-SNAPSHOT` | `9.8.2` | `21.6.20-beta` | `2.0.148` | `9.2.1` | `1.21.6+build.1` | — | `17.0.8` |
| `1.21.7` | 21 | Fabric, NeoForge | `0.20.1` | `0.129.0+1.21.7` | `1.19-SNAPSHOT` | `9.8.2` | `21.7.25-beta` | `2.0.148` | `9.2.1` | `1.21.7+build.8` | — | `17.0.8` |
| `1.21.8` | 21 | Fabric, NeoForge | `0.20.1` | `0.136.1+1.21.8` | `1.19-SNAPSHOT` | `9.8.2` | `21.8.57` | `2.0.148` | `9.2.1` | `1.21.8+build.1` | — | `17.0.8` |
| `1.21.9` | 21 | Fabric, NeoForge | `0.20.1` | `0.134.1+1.21.9` | `1.19-SNAPSHOT` | `9.8.2` | `21.9.16-beta` | `2.0.148` | `9.2.1` | `1.21.9+build.1` | — | `18.0.8` |
| `1.21.10` | 21 | Fabric, NeoForge | `0.20.1` | `0.138.4+1.21.10` | `1.19-SNAPSHOT` | `9.8.2` | `21.10.64` | `2.0.148` | `9.2.1` | `1.21.10+build.3` | — | `18.0.8` |
| `1.21.11` | 21 | Fabric, NeoForge | `0.20.1` | `0.141.6+1.21.11` | `1.19-SNAPSHOT` | `9.8.2` | `21.11.48` | `2.0.148` | `9.2.1` | `1.21.11+build.6` | — | `19.0.1` |
| `26.1` | 25 | Fabric, NeoForge | `0.20.1` | `0.145.1+26.1` | `1.19-SNAPSHOT` | `9.8.2` | `26.1.0.19-beta` | `2.0.148` | `9.2.1` | — | — | — |
| `26.1.1` | 25 | Fabric, NeoForge | `0.20.1` | `0.145.4+26.1.1` | `1.19-SNAPSHOT` | `9.8.2` | `26.1.1.15-beta` | `2.0.148` | `9.2.1` | — | — | — |
| `26.1.2` | 25 | Fabric, NeoForge | `0.20.1` | `0.155.3+26.1.2` | `1.19-SNAPSHOT` | `9.8.2` | `26.1.2.129` | `2.0.148` | `9.2.1` | — | — | `20.1.18` |
| `26.2` | 25 | Fabric, NeoForge | `0.20.1` | `0.161.0+26.2` | `1.19-SNAPSHOT` | `9.8.2` | `26.2.0.95` | `2.0.148` | `9.2.1` | — | — | `21.1.13` |
| `26.3` | 25 | Fabric, NeoForge | `0.20.1` | `0.166.2+26.3` | `1.19-SNAPSHOT` | `9.8.2` | `26.3.0.115` | `2.0.148` | `9.2.1` | — | — | `22.0.6` |

Notes:

- **Fabric Loader** and **Loom** are not tied to one Minecraft version: every official example-mod branch uses
  Loader `0.20.1` and Loom `1.19-SNAPSHOT` with Gradle `9.8.2`.
- **Loom plugin id:** `net.fabricmc.fabric-loom-remap` (or the older `fabric-loom`) before 26.x,
  `net.fabricmc.fabric-loom` on 26.x. The porter switches it in both directions.
- **ModDevGradle** `2.0.148` with Gradle `9.2.1` is what the NeoForge MDKs use for 1.20.4 and later, except 1.20.5,
  whose MDK uses ModDevGradle `2.0.92` with Gradle `8.14.2`.
- **Yarn** is used when a Yarn project stays on a version that still has Yarn (the build is updated to the target's
  Yarn build), or when you backport from 26.x and choose Yarn at the mappings prompt. 26.x has no Yarn — Yarn sources
  are [remapped to Mojang names](/mc-mod-porter/architecture-and-pipeline/#39--remapping-yarn--mojang).
- **Forge** values exist for 1.16.1–1.20.1 (Forge has no 1.16 build); **NeoForge** starts at 1.20.2. 1.16 projects
  are Fabric-only.
- **Gradle wrapper:** a Fabric-only project gets the Fabric column, a NeoForge-only project the NeoForge column. Mixed
  Fabric + NeoForge projects and Architectury Loom / ForgeGradle projects keep their wrapper, with a note in the log.

:::tip[Always confirm against official metadata]
If a dependency can't be resolved, check the exact published version on
[Fabric meta](https://meta.fabricmc.net/v2/versions/loader), [Fabric Maven](https://maven.fabricmc.net/) or
[NeoForged Maven](https://maven.neoforged.net/releases/net/neoforged/neoforge/) and edit `gradle.properties` or
`build.gradle`. The reference tables in `knowledge-base/loaders/` link these sources.
:::

## NeoForge version format

- **1.20.2 – 1.21.11:** `<mcMinor>.<mcPatch>.<build>[-beta]` — e.g. `21.1.267` for MC 1.21.1. 1.20.2 is the first NeoForge version.
- **26.x:** four components, `<YY>.<drop>.<hotfix>.<build>[-beta]` — e.g. `26.1.2.129` = MC 26.1.2, build 129.
- `-beta` means breaking changes are still allowed.
- The porter updates the NeoForge version wherever it is written: `neo_version` / `neoforge_version` /
  `neo_version_range` in `gradle.properties`, `neoForge { version = "…" }` or `neoForge.version = "…"` in the build
  script, `net.neoforged:neoforge:…` dependencies (NeoGradle), and the `neoforge` `versionRange` in
  `neoforge.mods.toml`. It also sets the `net.neoforged.moddev` plugin version.
- The 26.x MDKs no longer use Parchment, so on 26.x targets the porter comments out `parchment { }` blocks and
  `parchment_*` properties.

## Fabric notes for 26.x

- 26.1 is fully **unobfuscated**: the porter removes the `mappings` line, switches the Loom plugin id to
  `net.fabricmc.fabric-loom`, turns `modImplementation`/`modCompileOnly`/`modApi`/`modRuntimeOnly`/
  `modLocalRuntime`/`modCompileOnlyApi` into the plain configurations, and `remapJar`/`remapSourcesJar` into
  `jar`/`sourcesJar`.
- `fabric.mod.json`: the legacy `"fabric"` dependency id becomes `"fabric-api"`.
- Yarn projects are remapped to Mojang names automatically, since Yarn does not exist for 26.x.
- Sources: [Fabric 26.1](https://fabricmc.net/2026/03/14/261.html), [Fabric 26.2](https://fabricmc.net/2026/06/15/262.html), [Fabric 26.3](https://fabricmc.net/2026/09/15/263.html), [Fabric example mod](https://github.com/FabricMC/fabric-example-mod)
