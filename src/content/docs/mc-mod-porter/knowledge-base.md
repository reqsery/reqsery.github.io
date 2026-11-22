---
title: Knowledge Base & Migration Rules
description: How MC Mod Porter's sourced knowledge base, rename patterns, migration rules and warning scanner work — and how to contribute data.
sidebar:
  label: Knowledge Base & Migration Rules
---

The knowledge base is what makes MC Mod Porter different from "ask an AI to port my mod": every change it applies or
documents is backed by a **linked official source**.

## Layout

| Path | Contents |
|---|---|
| `knowledge-base/minecraft/` | One Markdown file **per adjacent version hop**, e.g. `1.19.4_to_1.20.md`, `1.21.11_to_26.1.md`, `26.2_to_26.3.md` |
| `knowledge-base/loaders/fabric/versions.md` | Fabric Loader, Fabric API, Loom and Yarn version table |
| `knowledge-base/loaders/neoforge/versions.md` | NeoForge version table and version-format notes |
| `knowledge-base/fetched/` | Reference snapshots of upstream sources (Fabric API, Loom, NeoForge, Yarn, Parchment, Architectury…) |
| `patterns/method-renames.md` | Verified cross-version method rename table |
| `patterns/class-moves.md` | Verified class move/rename table |
| `patterns/signatures.md` | Before/after code change examples |
| `java/java17.md`, `java21.md`, `java25.md` | Toolchain configuration per Java version |
| `templates/version-template.md` | Template for a new version-hop file |

### Version hops covered

`1.16→1.17` · `1.17.1→1.18` · `1.18→1.18.1` · `1.18.1→1.18.2` · `1.18.2→1.19` · `1.19→1.19.1` · `1.19.1→1.19.2` ·
`1.19.2→1.19.3` · `1.19.3→1.19.4` · `1.19.4→1.20` · `1.20→1.20.1` · `1.20.1→1.20.2` · `1.20.2→1.20.3` ·
`1.20.3→1.20.4` · `1.20.4→1.20.5` · `1.20.5→1.20.6` · `1.20.6→1.21` · `1.21→1.21.1` … `1.21.10→1.21.11` (every hop) ·
`1.21.11→26.1` · `26.1→26.1.1` · `26.1.1→26.1.2` · `26.1.2→26.2` · `26.2→26.3`

## How the porter applies rules

Inside `auto-porter`, the knowledge base is encoded as `ApiChangeRule`s. Each rule has one of these types:

| Rule type | What it changes |
|---|---|
| `CLASS_RENAME` | A class was renamed |
| `METHOD_RENAME` | A method was renamed |
| `METHOD_SIGNATURE` | A method's parameters changed |
| `FIELD_RENAME` | A field was renamed |
| `IMPORT_CHANGE` | A class moved to another package |
| `MIXIN_TARGET` | A mixin target method/descriptor changed |
| `TEXT_REPLACE` | A safe textual replacement (build scripts, metadata) |

The patchers run in order: **build file** (`BuildFilePatcher`), **gradle.properties** (`GradlePropertiesPatcher`),
**Java sources** (`SourcePatcher`, using JavaParser), **mixin targets** (`MixinTargetResolver`), **access wideners**
(`AccessWidenerPatcher`), **resources/pack metadata** (`ResourcePatcher`) and **mod metadata** (`ModMetaPatcher`).
Then `BuildRunner` runs Gradle unless `--no-build` or `--dry-run` was passed.

### Migration warnings (manual work)

Some changes are **not one-to-one** and are never rewritten automatically. `MigrationWarningScanner` searches your
sources for them and lists each hit in the log and in `port-report.json`. For 26.2, for example, it flags:

- `valueLookupBuilder`, `HolderTagProvider`, `IntrinsicHolderTagsProvider`, `KeyTagProvider`, `BlockItemTagsProvider` (data-gen / tag provider rework)
- `StructureProcessor`, `StructureProcessorType` (processors now use `MapCodec` directly)
- `Font.draw`, `drawInBatch`, `MultiBufferSource`, `RenderPipeline`, `VertexFormatElement`, `TextureFormat`, `DestFactor`/`SourceFactor`, `Tesselator`, `ShapeRenderer`, `PictureInPictureRenderer`, `GraphicsWorkarounds` (rendering pipeline changes)
- `ScreenManager` (became `MonitorManager`, not one-to-one)

Each warning links the official NeoForged primer it is based on.

## Example: 1.21.11 → 26.1

The biggest hop in the knowledge base:

- **Version format:** `1.21.11` was the last 1.x release; `26.1` is the first calendar release.
- **Java 25 required** (was 21). Update `languageVersion = JavaLanguageVersion.of(25)`.
- **Obfuscation removed:** no Yarn/Mojang remapping; every mod must at least be **recompiled** — no binary compatibility.
- **Fabric build script:** `id 'fabric-loom'` + `mappings …` → `id 'net.fabricmc.fabric-loom' version '1.15'` with the mappings line removed; `modImplementation` for Fabric API → plain `implementation`.
- **Fabric API changes:** `HudRenderCallback` → `HudElementRegistry`; `ItemGroupEvents` → `CreativeModeTabEvents`; `ColorProviderRegistry` → `BlockColorRegistry`; `fabric-convention-tags-v1` and `fabric-loot-api-v2` removed; `TradeOfferHelper` removed (trading is data-driven).
- **NeoForge:** four-component versions, `26.1.0.<build>[-beta]`.

Sources: [Fabric 26.1 announcement](https://fabricmc.net/2026/03/14/261.html), [NeoForge 26.1 release](https://neoforged.net/news/26.1release/), [Fabric porting docs](https://docs.fabricmc.net/develop/porting/)

## Example rename patterns

| Old | New | Version |
|---|---|---|
| `KeyBinding` | `KeyMapping` | 1.16.5 → 1.17.1 (Mojang mappings) |
| `Screen.addButton(Button)` | `Screen.addRenderableWidget(Widget)` | 1.16.5 → 1.17.1 |
| `render(MatrixStack, int, int, float)` | `render(GuiGraphics, int, int, float)` | 1.19.4 → 1.20.1 |
| `DrawableHelper.fill(...)` | `guiGraphics.fill(...)` | 1.19.4 → 1.20.1 |
| `KeyMapping(name, type, key, String)` | `KeyMapping(name, type, key, KeyMapping.Category)` | 1.21.9+ |
| `Screen.keyPressed(int, int, int)` | `Screen.keyPressed(KeyEvent)` | 1.21.9+ |
| `Screen.mouseClicked(double, double, int)` | `Screen.mouseClicked(MouseButtonEvent, boolean)` | 1.21.9+ |

See `patterns/method-renames.md` and `patterns/class-moves.md` in the repository for the full tables.

## Using the knowledge base with an AI assistant

AI models have a training cutoff, can hallucinate plausible method names, and cannot reliably guess exact loader
versions. The recommended workflow is:

1. Look up the version change in the knowledge base.
2. Give the relevant file to the AI as context.
3. Ask the AI to apply **only** the documented changes.

## Contributing data

**Core rule: no guessing, no hallucinations, source required.**

1. Copy `templates/version-template.md`.
2. Rename it `knowledge-base/minecraft/X.XX_to_Y.YY.md`.
3. Fill in only what you have verified; delete sections you cannot fill.
4. Add a source URL to **every** entry.

Every version file starts with:

```markdown
## Version: X.XX → Y.YY

> **Java requirement:** Java XX
> **Source:** [URL]
```

Entries use this shape:

```markdown
- old: `ClassName.methodName(params)`
- new: `NewClass.newMethod(params)`
- source: https://...
```

**Accepted sources:** `minecraft.net` release notes and Mojang metadata, `fabricmc.net`, `docs.fabricmc.net`,
`neoforged.net/news`, GitHub commits/PRs from the official Minecraft/FabricMC/NeoForged repositories, and official
FabricMC/NeoForged Maven metadata. **Not accepted:** "I think", wikis as sole evidence, search snippets, compile-only claims.

Validate your changes before opening a PR:

```bash
./scripts/validate-kb.sh
```

It checks each file for a `## Version:` header, a Java requirement note and at least one `source:` reference, warns if
any `verify before use` entries remain, and exits `1` on errors.
