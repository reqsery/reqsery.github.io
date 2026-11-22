---
title: Troubleshooting
description: Fixes for common MC Mod Porter errors and build failures in ported Fabric/NeoForge projects.
---

## The ported mod doesn't compile — where do I start?

This is normal, especially for big version jumps. The porter only does the **mechanical** part (renames, moved
classes, build files, versions). Anything Minecraft or the loader **redesigned** — new rendering, new registration,
changed method behaviour, mixins into code that no longer exists, third-party mods — has to be fixed by hand.

1. **Find the first real error.** Open `port-build.log` in the ported folder (the porter's `compileJava` output), or
   run `./gradlew build` (Windows: `gradlew.bat build`) yourself, and scroll to the **first** `error:` line. Later
   errors are often caused by the first one, so fix from the top.
2. **Check the Java version.** `invalid source release` or `UnsupportedClassVersionError` means the wrong JDK —
   26.x projects need **JDK 25**, 1.20.5–1.21.11 need **JDK 21** ([table](/mc-mod-porter/supported-versions/#java-requirements)).
3. **"Could not find …" / "Could not resolve …"** is a dependency problem, not your code: a loader, Loom or
   third-party API version that isn't published for the target version. See
   [Dependency resolution](#dependency-resolution).
4. **`cannot find symbol` / `no suitable method`** means an API changed. Look the name up in this page and in the
   [Knowledge Base](/mc-mod-porter/knowledge-base/) for the version hops you crossed.
5. **Read `build/port-report.json`.** For 26.2/26.3 upgrades the `warnings` step lists code the porter found but
   could not migrate automatically — those lines almost always need manual changes.
6. **Check what the porter doesn't touch:** third-party dependency versions (the `stale-versions` step in the report
   lists them), Architectury Loom / ForgeGradle plugin versions, and `MANUAL` lines from the remap step (overloaded
   methods, mixin target strings). Also check
   [which rules exist for your version range](/mc-mod-porter/migration-rules/#known-gaps-in-the-rule-set) — some
   hops have none.

When asking for help, post the **first error** (a few lines around it), your source and target versions, and the
loader (Fabric or NeoForge). "It won't compile" alone isn't enough for anyone — including the bot — to tell what's
wrong.

## Porter errors

### "Auto-Porter needs a mod source/project folder, not a compiled file"

You selected a `.jar` (or `.zip`). Compiled mod JARs from Modrinth/CurseForge cannot be ported. Use the folder that contains `build.gradle`, `gradle.properties`, `gradlew`/`gradlew.bat` and `src/`. Extract source ZIPs first.

### "Unknown source version" / "Unknown target version"

The version is not in the supported list. Run `java -jar auto-porter-1.4.0-beta.jar --list-versions` and use an exact entry (e.g. `1.17.1`, not `1.17`; `1.19`, not `1.19.0`). See [Supported Versions](/mc-mod-porter/supported-versions/).

### "ERROR: Mod path does not exist: …"

The folder path is wrong. Quote paths that contain spaces: `java -jar auto-porter-1.4.0-beta.jar "C:/My Mods/mymod" 1.20.1 1.21.1`.

### "Usage: auto-porter <modPath> <fromVersion> <toVersion> [--dry-run] [--no-build]"

Fewer than three arguments were given. Flags go **after** the path and both versions.

### The porter itself will not start

MC Mod Porter requires **Java 21+**. Run `java -version`; if it reports an older JDK, install Java 21 or newer and make sure it is first on `PATH` (or set `JAVA_HOME`).

### "Port complete with issues — review port-report.json"

Printed (with exit code 1) when the **`gradle.properties` step failed** (none found) or the **compile check failed**.
Migration warnings alone do not cause it. Open `build/port-report.json` — each step has `success`, `message` and
`changes`, and the `build` step has `errors` and the path of `port-build.log`. In the GUI this shows as
**Completed with issues**.

### "Java 25 is required to build this mod but was not found"

The ported project's `build.gradle` asks for Java 25 (all 26.x targets) and no JDK 25 was found, so the compile check
was not run. Install JDK 25 (e.g. Eclipse Temurin), point `JAVA_HOME` at it, and run `gradlew compileJava` in the
ported folder. For Java 21 or lower, a missing JDK does not stop the check — Gradle runs with your default Java and
may fail with `invalid source release`. The porter finds JDKs via `JAVA_HOME` and the usual Temurin, Microsoft,
Oracle, Corretto and `/usr/lib/jvm` install folders; a JDK installed elsewhere is only found through `JAVA_HOME`.

### "No gradle.properties found in …"

The porter edits versions only through `gradle.properties` (root, `common/`, `fabric/` or `neoforge/`). Without it no
versions are updated. Create one with `minecraft_version`, `loader_version`, `fabric_version`/`neo_version` etc., or
update the versions in `build.gradle` by hand.

### "No gradlew found at …"

The ported project has no Gradle wrapper, so the compile check (and the GUI's Build/Run Client) can't run. Add one
with `gradle wrapper` or copy it from an official template.

### "Output dir already exists, removing: …"

You ported to the same target before. The old output folder — **including any fixes you made in it** — is deleted
and recreated.

### "[WARN] No source rules found for X → Y"

There are no Java rules for that version range. Build files, `gradle.properties`, metadata and the access widener are
still updated. See [Migration Rules](/mc-mod-porter/migration-rules/#known-gaps-in-the-rule-set).

### "still contains … (source Minecraft version)" after porting

The [stale version check](/mc-mod-porter/architecture-and-pipeline/#99--stale-version-check) found an old version
number the porter doesn't manage — usually a third-party dependency such as `jei-1.21.1-neoforge`. Look up the build
of that library for your target version and update the line by hand.

### Versions in `build.gradle` / `build.gradle.kts` didn't change

Since v1.4.0-beta the porter updates hard-coded versions too (Loom and ModDevGradle plugins, `neoForge { version }`,
fabric-loader / fabric-api / neoforge / minecraft dependencies) in Groovy and Kotlin DSL. Versions of other plugins
(Architectury Loom, ForgeGradle) and third-party libraries are left alone — the stale version check lists them. On
older porter versions, update them by hand.

### Remapping failed / "check your internet connection"

The first remap for a Minecraft version downloads Yarn's mappings from `maven.fabricmc.net` and Mojang's from
`piston-meta.mojang.com`, then caches them in `~/.mc-mod-porter/mappings/`. Run the port again when you are online,
or use `--no-remap` to port without remapping (26.x targets then need the Yarn names fixed by hand).

### `cannot find symbol` on Yarn names after a remapped port

The remapper skips names it can't map safely: methods on local variables whose Yarn name has several Mojang names
(e.g. `player.getBlockPos()`), overloads with different Mojang names (reported as `MANUAL … has several Mojang
names`), and mixin target strings. Look these up in the target version's Mojang names and fix them by hand.

### Mixin `compatibilityLevel` errors

Since v1.4.0-beta the porter sets `"compatibilityLevel"` in `*.mixins.json` to the target's Java (e.g. `"JAVA_25"`).
If you still get an error, check that the build uses the same JDK ([table](/mc-mod-porter/supported-versions/#java-requirements)).

### A `1.19.x → 1.20.x` port still uses `MatrixStack`/`DrawableHelper`

Fixed in v1.4.0-beta: rule groups such as `1.19.4 → 1.20.1` are applied whenever the port passes through both
versions (for example `1.19.2 → 1.20.4`). On older versions, port in two runs (`1.19.x → 1.19.4`, then
`1.19.4 → 1.20.1`).

### Linux/macOS: `./gradlew: Permission denied`

Fixed in v1.3.0-beta (the porter restores the executable bit). On older versions run `chmod +x gradlew`.

### GUI messages

GUI pop-ups such as "The source Minecraft version could not be detected. Select it manually." or "Port a project
first." are explained in the [CLI & GUI Reference](/mc-mod-porter/cli-and-gui-reference/#error-pop-ups).

:::note
The sections below come from the repository troubleshooting guide. Names differ by mapping namespace: examples labeled **Mojang mappings** use names such as `KeyMapping` and `GuiGraphics`; the same classes are `KeyBinding` and `DrawContext` in **Yarn**.
:::

## Build failures

### `error: cannot find symbol — KeyEvent`

**Cause:** Minecraft changed GUI keyboard callbacks in **1.21.9**, not 1.21.10. In Mojang mappings the event type is `net.minecraft.client.input.KeyEvent`; Yarn calls the corresponding type `KeyInput`. Minecraft 1.21.8 and earlier use three integer parameters.

**Fix when targeting 1.21.8 or earlier:**

```java
// 1.21.8 and earlier
boolean keyPressed(int keyCode, int scanCode, int modifiers)
```

Use `keyCode` where newer code uses `event.key()` or the equivalent accessor in the selected mappings. When targeting 1.21.9 or later, keep the event-object callback and use the exact name from the selected mappings.

Sources: [Yarn 1.21.4 GUI callbacks](https://maven.fabricmc.net/docs/yarn-1.21.4%2Bbuild.1/net/minecraft/client/gui/Element.html), [Yarn 1.21.9 GUI callbacks](https://maven.fabricmc.net/docs/yarn-1.21.9%2Bbuild.1/net/minecraft/client/gui/Element.html)

### `error: cannot find symbol — MouseButtonEvent`

**Cause:** Mouse callbacks also changed in **1.21.9**. Mojang mappings use `MouseButtonEvent`; Yarn calls the corresponding type `Click`. Minecraft 1.21.8 and earlier use coordinates and a button number.

**Fix when targeting 1.21.8 or earlier:**

```java
// 1.21.8 and earlier
boolean mouseClicked(double mouseX, double mouseY, int button)
```

Replace event coordinate accessors with `mouseX` and `mouseY`. For 1.21.9 or later, retain the event object and verify its mapped name.

Sources: [Yarn 1.21.4 GUI callbacks](https://maven.fabricmc.net/docs/yarn-1.21.4%2Bbuild.1/net/minecraft/client/gui/Element.html), [Yarn 1.21.9 GUI callbacks](https://maven.fabricmc.net/docs/yarn-1.21.9%2Bbuild.1/net/minecraft/client/gui/Element.html)

### `error: cannot find symbol — KeyMapping.Category`

**Cause:** `KeyMapping.Category` (Yarn: `KeyBinding.Category`) was introduced in **1.21.9**. Minecraft 1.21.8 and earlier store the category as a `String`.

**Fix when targeting 1.21.8 or earlier:**

```java
String category = "key.categories.misc";
```

For 1.21.9 or later, use the category record and its registration/creation API in the selected mappings.

Sources: [Yarn 1.21.4 KeyBinding](https://maven.fabricmc.net/docs/yarn-1.21.4%2Bbuild.4/net/minecraft/client/option/KeyBinding.html), [Yarn 1.21.9 KeyBinding.Category](https://maven.fabricmc.net/docs/yarn-1.21.9%2Bbuild.1/net/minecraft/client/option/KeyBinding.Category.html)

### `error: no suitable method found for blit(...)`

**Cause:** GUI texture overloads changed more than once during the 1.21.x rendering work. The previous guide incorrectly treated this as a single 1.21.10 change and reversed the old/new forms.

Minecraft 1.21.4's Mojang-mapped `GuiGraphics.blit` requires a render-type function and pixel UV coordinates:

```java
graphics.blit(
    RenderType::guiTextured,
    texture,
    x, y,
    u, v,
    width, height,
    textureWidth, textureHeight
);
```

Later 1.21.x versions use a `RenderPipeline` for the corresponding overload. Do not convert pixel UVs to fractional UVs unless the target overload explicitly requests them; select the overload from the target version's mappings.

Sources: [Yarn 1.21.4 DrawContext](https://maven.fabricmc.net/docs/yarn-1.21.4%2Bbuild.1/net/minecraft/client/gui/DrawContext.html), [Yarn 1.21.7 DrawContext](https://maven.fabricmc.net/docs/yarn-1.21.7%2Bbuild.1/net/minecraft/client/gui/DrawContext.html), [NeoForged 1.21.5 rendering primer](https://github.com/neoforged/.github/blob/main/primers/1.21.5/index.md)

### `error: cannot find symbol — PlayerSkin` (wrong package)

**Cause:** `PlayerSkin` moved and changed shape in **1.21.9**:

- 1.21.8 and earlier: `net.minecraft.client.resources.PlayerSkin`
- 1.21.9 and later: `net.minecraft.world.entity.player.PlayerSkin`

The old `texture()`/`textureUrl()` representation became a `body()` client texture. Code that needs the resource path generally uses `skin.body().texturePath()` after the migration.

Source: [NeoForged 1.21.8 → 1.21.9 migration primer](https://docs.neoforged.net/primer/docs/1.21.9/)

### `error: cannot find symbol — FMLEnvironment.getDist()`

**Cause:** This API belongs to FancyModLoader, so its shape follows the FML version rather than vanilla Minecraft mappings. NeoForge's official 1.21.1 documentation uses the public `FMLEnvironment.dist` field. Newer FML source may expose `getDist()` instead. The previous guide's claim that 21.10 changed `getDist()` into `dist` was backwards.

**Fix:** For a target whose FML API exposes the field, use:

```java
FMLEnvironment.dist
```

For a target whose FML API exposes the accessor, use:

```java
FMLEnvironment.getDist()
```

Do not apply this as an unconditional text replacement; check the FML dependency resolved by the target NeoForge artifact.

Sources: [NeoForge 1.21.1 sides documentation](https://docs.neoforged.net/docs/1.21.1/concepts/sides/), [FancyModLoader source](https://github.com/neoforged/FancyModLoader)

### `error: package net.minecraftforge does not exist`

**Cause:** NeoForge forked from Forge in the 1.20.2 development cycle and renamed its own packages from `net.minecraftforge` to `net.neoforged`.

**Fix:** Update imports and loader-owned references using the actual NeoForge class locations. Do not replace every occurrence blindly: Maven coordinates, plugin IDs, metadata, service declarations, third-party APIs, and user-facing text do not all follow one package substitution.

Sources: [NeoForge source](https://github.com/neoforged/NeoForge), [NeoForged migration primers](https://github.com/neoforged/.github/tree/main/primers)

### `error: PacketByteBuf cannot be resolved`

**Cause:** Usually a mapping-namespace mismatch, not removal in Minecraft 1.20.5. `PacketByteBuf` is the Yarn name. In 1.20.5 it still exists, and Yarn's `RegistryByteBuf` extends it. Mojang mappings call the corresponding registry-aware type `RegistryFriendlyByteBuf`.

**Fix:**

- Stay within one mapping namespace.
- Use the base packet buffer for ordinary data.
- Use the registry-aware buffer only when serialization needs registry access.
- Do not globally replace every `PacketByteBuf` with `RegistryFriendlyByteBuf`.

Sources: [Yarn 1.20.5 RegistryByteBuf](https://maven.fabricmc.net/docs/yarn-1.20.5-rc2%2Bbuild.1/net/minecraft/network/RegistryByteBuf.html), [NeoForged 1.20.5 migration primer](https://github.com/neoforged/.github/blob/main/primers/1.20.5/index.md#stream-codecs)

## Java and mapping issues

### `invalid source release: 21`

The selected JDK is older than the configured Java toolchain.

1. Run `java -version`, `javac -version`, and `./gradlew --version`.
2. Install the required JDK.
3. Point `JAVA_HOME` at it and reopen the terminal.

Do not lower the project's Java target merely to make an older local JDK compile it.

### `UnsupportedClassVersionError`

The runtime is older than the Java version used to compile the class. Common class-file major versions are:

- `61`: Java 17
- `65`: Java 21
- `69`: Java 25

Run the tool or mod with a compatible JDK. Auto-Porter itself is configured for Java 21; Minecraft 26.x development requires Java 25.

Source: [Java Virtual Machine Specification, class-file format](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-4.html)

## Dependency resolution

### Gradle cannot find a NeoForge artifact

NeoForge `21.4.0-beta` through `21.4.120-beta` use the `-beta` suffix. Starting at `21.4.121`, the published 21.4 artifacts omit it. This cutoff is specific to the 21.4 line; do not generalize it to other Minecraft/NeoForge lines.

Always copy the exact published version from the official repository: [NeoForged Maven releases](https://maven.neoforged.net/releases/net/neoforged/neoforge/)

Then refresh dependencies:

```bash
./gradlew --refresh-dependencies
```

### A Fabric API module cannot be found

Fabric API modules can be deprecated, replaced, or removed. For example, current 26.x Fabric API source contains `fabric-convention-tags-v2`, not `fabric-convention-tags-v1`.

**Fix:** Check the exact Fabric API release/source tree. If a major-version replacement exists, migrate its API and data semantics; merely renaming or deleting the dependency may leave broken imports or tags.

Sources: [Fabric API source tree](https://github.com/FabricMC/fabric-api), [Fabric API releases](https://github.com/FabricMC/fabric-api/releases)

### Gradle cannot find a third-party mod API

**Example:**

```text
Could not find mezz.jei:jei-26.2-neoforge-api:19.22.1.316
```

**Cause:** The ported project is asking Gradle for a dependency artifact that is not published in the configured Maven repositories. This can happen when a mod's build logic constructs dependency coordinates from the target Minecraft version, but that integration mod has not published a matching build yet.

This is a dependency availability issue, not Auto-Porter crashing. Auto-Porter may still have copied the project, updated versions, patched sources, and written `port-report.json`; the final build fails because Gradle cannot download the requested API.

**Fix:** Check the third-party mod's official Maven or release page for the exact artifact and version that supports the target Minecraft/loader combination. If no matching artifact exists, temporarily disable that integration, choose an available version, or wait for the dependency to publish support for the target version.

Sources: [BlameJared Maven](https://maven.blamejared.com/), [JEI releases](https://github.com/mezz/JustEnoughItems/releases)

## Loom issues

### `Could not find dev.architectury.loom:...-SNAPSHOT`

**Cause:** The requested Architectury Loom snapshot is not available from the configured plugin/Maven repositories, or that version was never published there.

**Fix:** Verify the version against Architectury Loom's official releases and configure the repository documented by that project. Do not assume an arbitrary Loom version supports every target: Loom is not tied one-to-one to a Minecraft version, but compatibility changes with Minecraft, Gradle, Java, mappings, and loader tooling.

Source: [Architectury Loom](https://github.com/architectury/architectury-loom)

### Fabric Loom fails after changing Minecraft versions

Use the Loom version and Gradle wrapper from the official Fabric example mod branch for the target Minecraft version, and select an actually published build from Fabric Maven. Every current example-mod branch (1.16 through 26.3) uses Loom `1.19-SNAPSHOT` with Gradle `9.8.2`, and MC Mod Porter writes those values. Loom `1.19` needs Gradle 9 — an old wrapper such as Gradle 8.x fails before your code compiles.

Sources: [Fabric example mod](https://github.com/FabricMC/fabric-example-mod), [Fabric development for Minecraft 26.2](https://fabricmc.net/2026/06/15/262.html), [Fabric for Minecraft 26.3](https://fabricmc.net/2026/09/15/263.html), [Fabric Loom Maven](https://maven.fabricmc.net/net/fabricmc/fabric-loom/)

### `silentMojangMappingsLicense() not found`

**Cause:** The selected Fabric/Architectury Loom version does not expose this older DSL helper. The helper suppresses the Mojang mappings license prompt; it does not select the mappings dependency.

**Fix:** Remove only the `silentMojangMappingsLicense()` call. Keep the actual mappings declaration, such as `mappings loom.officialMojangMappings()`, when the project uses Mojang mappings. Do not claim a fixed removal boundary without checking the selected Loom implementation.

Sources: [Fabric Loom source](https://github.com/FabricMC/fabric-loom), [Architectury Loom source](https://github.com/architectury/architectury-loom)

## Minecraft 26.2 pack metadata

Minecraft Java Edition 26.2 uses:

- Data Pack version `107.1`
- Resource Pack version `88.0`

Snapshot pack versions are provisional; use the final release notes for a release target.

Source: [Minecraft Java Edition 26.2](https://www.minecraft.net/en-us/article/minecraft-java-edition-26-2)

## Minecraft 26.3 pack metadata

Minecraft Java Edition 26.3 uses:

- Data Pack version `121.0`
- Resource Pack version `97.1`

Snapshot and prerelease pack versions are provisional. Auto-Porter uses the final release values above.

Source: [Minecraft Java Edition 26.3](https://www.minecraft.net/en-us/article/minecraft-java-edition-26-3)

## Gradle cache and daemon problems

First stop daemons and retry with refreshed dependencies:

```bash
./gradlew --stop
./gradlew clean build --refresh-dependencies
```

On Windows, also check whether an IDE, antivirus scanner, or another Gradle process holds a file lock. Avoid deleting the entire global Gradle cache unless the error identifies corrupt cached content and a refresh does not repair it.

## Reporting an unresolved failure

Include:

- source and target Minecraft versions;
- mapping namespace;
- loader and exact loader version;
- Fabric API or NeoForge version;
- Loom and Gradle versions;
- `java -version` and `./gradlew --version` output;
- the first relevant compiler or dependency-resolution error;
- the generated `gradle.properties` and dependency block.

Ask on the [Discord](https://discord.gg/vV2USr9phF) or [open a bug report](https://github.com/reqsery/mc-mod-porter/issues/new?template=bug_report.md) with that information.
