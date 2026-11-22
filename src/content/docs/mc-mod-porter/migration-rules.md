---
title: Migration Rules Reference
description: Every automatic change MC Mod Porter v1.3.0-beta makes to Java sources, mixin targets, resources and data, every manual-review warning, and the known gaps in the rule set.
sidebar:
  label: Migration Rules
---

This is the complete list of what the porter changes **automatically**, generated from the rule tables in the
source code (`ApiChangeRule`, `MixinTargetResolver`, `ResourcePatcher`, `MigrationWarningScanner`). If a change you
need is not on this page, the porter does not make it — fix it by hand using the
[Troubleshooting](/mc-mod-porter/troubleshooting/) guide and the `knowledge-base/minecraft/` notes.

## How to read this page

- Rules are grouped by the **version pair** they belong to. A port uses the groups of every adjacent hop it crosses
  plus any group for the exact source → target pair (see
  [Architecture & Pipeline](/mc-mod-porter/architecture-and-pipeline/#37--java-sources)).
- **Find / Replace with** are exact text: the rule only fires if your code contains that exact spelling.
  `⏎` marks a line break inside a rule.
- Most rules are defined in both directions; the downgrade version swaps *Find* and *Replace with*.
- **Rule types** are labels only — every rule is a literal text replacement.

## Known gaps in the rule set

:::caution[Some rules only fire for one exact source → target pair]
58 of the 398 source rules are attached to two versions that are **not neighbours** in the version list (for example
`1.19.4 → 1.20.1` or `1.21.4 → 1.21.10`). Because the porter chains *adjacent* hops, those groups are only used when
your source and target are **exactly** that pair. Porting `1.19.2 → 1.20.1`, or `1.19.4 → 1.21`, skips the
`GuiGraphics` rules entirely. These groups are marked ⚠️ below.

Six rules use version `1.19.0`, which is not a version the porter knows (it uses `1.19`), so they **never** fire.
:::

- **Adjacent hops that have Java rules:** 1.16.5↔1.17.1, 1.19.2↔1.19.3, 1.19.2→1.19.1 (downgrade only),
  1.20.1↔1.20.2, 1.20.4↔1.20.5, 1.20.6↔1.21, 1.21↔1.21.1, 1.21.5↔1.21.6, 1.21.8↔1.21.9, 1.21.10↔1.21.11,
  1.21.11↔26.1, 26.1.2→26.2 and 26.2→26.3 (upgrade only).
- **Every other hop has no Java rules of its own** — including 1.16→1.16.5, 1.17.1→1.18.2, 1.19→1.19.2 (upgrade),
  1.19.3→1.20.1, 1.20.2→1.20.4, 1.20.5→1.20.6, 1.21.1→1.21.5, 1.21.6→1.21.8, 1.21.9→1.21.10 and 26.1→26.1.2. Across
  those hops you only get build-file, version and metadata updates (plus any exact-pair group that matches).
- The large 26.1.2 → 26.2 (177 rules) and 26.2 → 26.3 (57 rules) groups are **upgrade only** — there are no
  reverse rules for downgrading from 26.2/26.3.
- Resource/data migrations and manual-review warnings exist **only for upgrades** through 26.2 and 26.3.

## Mixin target renames

Applied after the source rules, to method names inside mixin targets — both JVM descriptors
(`/Screen;render(`) and dot form (`Screen.render(`).

| Port | Class (after class renames) | Method | Becomes | Source |
|---|---|---|---|---|
| 1.21.11 → 26.1 | `Screen` | `render` | `extractRenderState` | NeoForge 26.1 notes |
| 1.21.11 → 26.1 | `Screen` | `renderBackground` | `extractBackground` | NeoForge 26.1 notes |
| 1.21.11 → 26.1 | `AbstractContainerScreen` | `renderBg` | `extractBackground` | NeoForge 26.1 notes |
| 1.21.11 → 26.1 | `AbstractContainerScreen` | `renderLabels` | `extractLabels` | NeoForge 26.1 notes |
| 1.21.11 → 26.1 | `AbstractContainerScreen` | `renderSlot` | `extractSlot` | inferred from the pattern |
| 1.21.11 → 26.1 | `GuiGraphicsExtractor` | `renderItem` | `item` | inferred from the pattern |
| 26.1 → 1.21.11 | the same six, reversed (`GuiGraphics` instead of `GuiGraphicsExtractor`) | | | |

## Resource and data migrations

Only when **upgrading** through these hops.

### Through 26.1.2 → 26.2

- `pack.mcmeta` `pack_format`: **84 → 88** in resource packs (folder has `assets/`), **101.1 → 107.1** in data
  packs (folder has `data/`). Only these exact old values are changed.
- Core shaders in `assets/minecraft/shaders/core/`: `rendertype_text.json` → `text.json`,
  `rendertype_text_background.json` → `text_background.json`.

### Through 26.2 → 26.3

- `pack.mcmeta` `pack_format`: **88 → 97.1** (resources), **107.1 → 121** (data). A dry run across both hops shows
  84 → 97.1 and 101.1 → 121 directly.
- `worldgen/configured_feature/` → `worldgen/feature/` and `worldgen/configured_carver/` → `worldgen/carver/`; each
  JSON's `config` object is inlined next to `type` (skipped if keys would collide).
- Worldgen JSON: `"type": "minecraft:basalt_columns"` → `minecraft:stepped_column_cluster`, and its `reach` →
  `column_reach`.
- Tag files renamed (inside `tags/` folders): `convertable_to_mud` → `convertible_to_mud`,
  `on_jungle_explorer_maps` → `on_jungle_pyramid_maps`, `on_ocean_explorer_maps` → `on_ocean_monument_maps`,
  `on_swamp_explorer_maps` → `on_swamp_hut_maps`, `on_trial_chambers_maps` → `on_burial_trial_chambers_maps`,
  `on_woodland_explorer_maps` → `on_woodland_mansion_maps`.
- The same identifiers (`minecraft:…`) are rewritten inside `.json`, `.mcmeta` and shader files, plus
  `minecraft:worldgen/configured_feature` → `minecraft:worldgen/feature`,
  `minecraft:worldgen/configured_carver` → `minecraft:worldgen/carver`, `minecraft:rendertype_clouds` →
  `minecraft:clouds`, `minecraft:rendertype_world_border` → `minecraft:world_border`.
- Shaders (`.vsh`, `.fsh`, `.glsl`): `#moj_import` → `#include`; core shaders `rendertype_clouds.*` → `clouds.*`
  and `rendertype_world_border.*` → `world_border.*`.

## Manual-review warnings

Only when **upgrading** through 26.2 / 26.3. The scan looks for these exact strings and prints
`MANUAL <version> REVIEW for \`token\` - <explanation>`; nothing is changed.

**26.2 — Java/Gradle files:** `valueLookupBuilder`, `HolderTagProvider`, `IntrinsicHolderTagsProvider`,
`KeyTagProvider`, `BlockItemTagsProvider`, `StructureProcessorType`, `StructureProcessor`, `Font.draw`,
`drawInBatch`, `MultiBufferSource`, `RenderPipeline`, `VertexFormatElement`, `TextureFormat`, `DestFactor`,
`SourceFactor`, `GraphicsWorkarounds`, `Tesselator`, `PictureInPictureRenderer`, `ShapeRenderer`, `ScreenManager`,
`FrameBufferCache`, `GpuDevice`, `LevelRenderer`, `RenderBuffers`, `SectionRenderDispatcher`, `BedRenderer`,
`BedSpecialRenderer`, `Model.renderToBuffer`, `ChatFormatting`, `WeatheringCopperItems`, `WeatheringCopperBlocks`,
`BuiltInLootTables`, `EntityPredicate`, `SurfaceRules.isBiome`, `noiseCondition(`, `getSphaghettiRarity2D`,
`getSpaghettiRarity3D`, `WeightedPlacedFeature`, `SimpleRandomFeatureConfiguration`, `LakeFeature.Configuration`,
`LargeDripstoneFeature`, `hangingSign(`, `SelectorPattern`, `EntitySpawnReason`, `Sheets.SIGN`,
`Sheets.HANGING_SIGN`, `ModelLayers.BED`, `@At(` (every mixin target).

**26.2 — resources:** `"minecraft:signs"`, `"minecraft:beds"`, `"minecraft:hanging_signs"` atlases;
`rendertype_text_background_see_through`, `rendertype_text_intensity`, `rendertype_text_see_through` shaders.

**26.3 — Java/Gradle files:** `org.lwjgl.glfw` and `GLFW.` (GLFW replaced by SDL), `KeyEvent`, `setFocused(`,
`RenderSystem.outputColorTextureOverride`, `RenderSystem.outputDepthTextureOverride`, `ConfiguredFeature`,
`FeatureConfiguration`, `ConfiguredWorldCarver`, `CarverConfiguration`, `BuiltInRegistries.FEATURE`,
`BuiltInRegistries.CARVER`, `SurfaceRules`, `SurfaceSystem`, `NumberProvider`, `ContextAwarePredicate`,
`LootTableProvider`, `AdvancementProvider`, `PotionBrewing`, `ComposterBlock.COMPOSTABLES`, `FuelValues`,
`AxeItem.STRIPPABLES`, `ShovelItem.FLATTENABLES`, `HoeItem.TILLABLES`; Fabric API `CompostingChanceRegistry`,
`FuelRegistry`, `FabricPotionBrewingBuilder`, `StrippableBlockRegistry`, `TillableBlockRegistry`,
`FlattenableBlockRegistry`, `enableColoredVanillaFluidNames`; NeoForge `ModConfig.Type.COMMON` (now `LOCAL`),
`ModConfig.Type.SERVER` (now `SYNCED`), `ViewportEvent`, `IFluidTank`, `InvWrapper`, `RangedWrapper`,
`EmptyFluidHandler`, `FluidHandlerItemStackSimple.Consumable`, `NeoForgeRenderTypes`, `processEntityInfos`,
`markWorldsDirty`, `forgeGetWorldMap`; `EnderMan`; `@At(`.

**26.3 — resources:** `"spawners"`, `"spawn_costs"`, `"creature_spawn_probability"` (biome spawns moved to
environment attributes), `worldgen/number_provider`, `armor_trims.json`, `template_farmland`,
`post_effect/transparency`, `text_background`.

Each warning includes a link to the official NeoForged primer, Fabric announcement or NeoForge pull request it is
based on.

## Source rules by version pair

### `1.16.5` → `1.17.1`

6 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `METHOD_SIGNATURE` | `KeyBinding(` | `KeyMapping(` | KeyBinding renamed to KeyMapping in 1.17 |
| `TEXT_REPLACE` | `addButton(` | `addRenderableWidget(` | Screen.addButton() → addRenderableWidget() in 1.17 |
| `IMPORT_CHANGE` | `import org.apache.logging.log4j.Logger;` | `import org.slf4j.Logger;` | Log4j Logger → SLF4J Logger in 1.17+ |
| `IMPORT_CHANGE` | `import org.apache.logging.log4j.LogManager;` | `import org.slf4j.LoggerFactory;` | Log4j LogManager → SLF4J LoggerFactory in 1.17+ |
| `TEXT_REPLACE` | `LogManager.getLogger(` | `LoggerFactory.getLogger(` | LogManager.getLogger → LoggerFactory.getLogger in 1.17+ |
| `TEXT_REPLACE` | `Minecraft.getInstance().getTextureManager().bind(skin);` | `RenderSystem.setShaderTexture(0, skin);` | TextureManager.bind → RenderSystem.setShaderTexture in 1.17+ |

### `1.16.5` → `1.21.10` — ⚠️ only applied when porting **exactly** `1.16.5` → `1.21.10`

2 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `new KeyBinding(` | `new KeyMapping(` | KeyBinding → KeyMapping (Mojang mappings) |
| `IMPORT_CHANGE` | `net.minecraft.client.settings.KeyBinding` | `net.minecraft.client.KeyMapping` | KeyBinding import → KeyMapping |

### `1.17.1` → `1.16.5`

4 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `import org.slf4j.Logger;` | `import org.apache.logging.log4j.Logger;` | SLF4J Logger → Log4j Logger for pre-1.17 |
| `IMPORT_CHANGE` | `import org.slf4j.LoggerFactory;` | `import org.apache.logging.log4j.LogManager;` | SLF4J LoggerFactory → Log4j LogManager for pre-1.17 |
| `TEXT_REPLACE` | `LoggerFactory.getLogger(` | `LogManager.getLogger(` | LoggerFactory.getLogger → LogManager.getLogger for pre-1.17 |
| `TEXT_REPLACE` | `RenderSystem.setShaderTexture(0, skin);` | `Minecraft.getInstance().getTextureManager().bind(skin);` | RenderSystem.setShaderTexture → TextureManager.bind for pre-1.17 |

### `1.17.1` → `1.18.2` — ⚠️ only applied when porting **exactly** `1.17.1` → `1.18.2`

2 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `net.minecraft.world.World` | `net.minecraft.world.level.Level` | World → Level |
| `TEXT_REPLACE` | `net.minecraft.entity.player.PlayerEntity` | `net.minecraft.world.entity.player.Player` | PlayerEntity → Player |

### `1.18.2` → `1.19.0` — ⚠️ **never applied** (uses a version the porter doesn't know)

2 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `new net.minecraft.network.chat.TextComponent(` | `Component.literal(` | new TextComponent() → Component.literal() in 1.19+ |
| `TEXT_REPLACE` | `this.init(this.minecraft, this.width, this.height);` | `this.rebuildWidgets();` | init(minecraft,width,height) → rebuildWidgets() in 1.19+ |

### `1.19.0` → `1.18.2` — ⚠️ **never applied** (uses a version the porter doesn't know)

3 rule(s) (upgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `Component.literal(` | `new net.minecraft.network.chat.TextComponent(` | Component.literal() → new TextComponent() for pre-1.19 |
| `IMPORT_CHANGE` | `import net.minecraft.network.chat.Component;` | *(removed)* | Remove Component import when downgrading to pre-1.19 (TextComponent is fully qualified) |
| `TEXT_REPLACE` | `this.rebuildWidgets();` | `this.init(this.minecraft, this.width, this.height);` | Screen.rebuildWidgets() → init(minecraft, width, height) for pre-1.19 |

### `1.19.1` → `1.19.0` — ⚠️ **never applied** (uses a version the porter doesn't know)

1 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `MIXIN_TARGET` | `addMessage(Lnet/minecraft/network/chat/Component;Lnet/minecraft/network/chat/MessageSignature;Lnet/minecraf…` | `addMessage(Lnet/minecraft/network/chat/Component;)V` | GuiMessageTag not in 1.19.0; target 1-arg addMessage instead |

### `1.19.2` → `1.19.1`

1 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `\|\| tag == GuiMessageTag.systemSinglePlayer()` | *(removed)* | GuiMessageTag.systemSinglePlayer() not in 1.19.1; remove the check |

### `1.19.2` → `1.19.3`

2 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `.getX()` | `.x` | AbstractWidget.getX() → .x field (pre-1.19.3 had public int x) |
| `TEXT_REPLACE` | `.getY()` | `.y` | AbstractWidget.getY() → .y field (pre-1.19.3 had public int y) |

### `1.19.3` → `1.19.2`

2 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `.setHint(Component.literal(` | `// .setHint removed (not available pre-1.19.3)` | EditBox.setHint() not available pre-1.19.3; remove call |
| `TEXT_REPLACE` | `nameField.setFocused(true);` | `this.setFocused(nameField);` | setFocused(boolean) protected pre-1.19.3; use Screen.setFocused(GuiEventListener) |

### `1.19.4` → `1.19.2` — ⚠️ only applied when porting **exactly** `1.19.4` → `1.19.2`

1 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `Button.builder(` | `new Button(` | Button.builder() → new Button() constructor for pre-1.19.3 (reorder args: move .bounds() values to start) |

### `1.19.4` → `1.20.1` — ⚠️ only applied when porting **exactly** `1.19.4` → `1.20.1`

10 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `import com.mojang.blaze3d.vertex.PoseStack;` | `import net.minecraft.client.gui.GuiGraphics;` | PoseStack import → GuiGraphics import in render methods |
| `METHOD_SIGNATURE` | `render(PoseStack poseStack,` | `render(GuiGraphics graphics,` | render(PoseStack) → render(GuiGraphics) in Screen.render() |
| `TEXT_REPLACE` | `super.render(poseStack, mouseX, mouseY, delta);` | `super.render(graphics, mouseX, mouseY, delta);` | super.render(poseStack) → super.render(graphics) |
| `TEXT_REPLACE` | `fill(poseStack,` | `graphics.fill(` | fill(poseStack,...) → graphics.fill(...) in 1.20 |
| `TEXT_REPLACE` | `drawCenteredString(poseStack, this.font,` | `graphics.drawCenteredString(this.font,` | drawCenteredString(poseStack,...) → graphics.drawCenteredString(...) |
| `TEXT_REPLACE` | `drawString(poseStack, this.font,` | `graphics.drawString(this.font,` | drawString(poseStack,...) → graphics.drawString(...) |
| `TEXT_REPLACE` | `(poseStack, tickDelta) ->` | `(graphics, deltaTracker) ->` | HUD callback: (PoseStack, float) → (GuiGraphics, DeltaTracker) |
| `TEXT_REPLACE` | `import net.minecraft.client.util.math.MatrixStack` | `// MatrixStack removed - use GuiGraphics` | MatrixStack replaced by GuiGraphics in render methods |
| `METHOD_SIGNATURE` | `render(MatrixStack matrices,` | `render(GuiGraphics guiGraphics,` | render() MatrixStack → GuiGraphics |
| `IMPORT_CHANGE` | `net.minecraft.client.gui.DrawableHelper` | `net.minecraft.client.gui.GuiGraphics` | DrawableHelper → GuiGraphics |

### `1.20.1` → `1.19.4` — ⚠️ only applied when porting **exactly** `1.20.1` → `1.19.4`

1 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `(graphics, deltaTracker) ->` | `(poseStack, tickDelta) ->` | HUD callback: (GuiGraphics, DeltaTracker) → (PoseStack, float) |

### `1.20.1` → `1.20.2`

3 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `acp.getSkinTextureLocation()` | `acp.getSkin().texture()` | getSkinTextureLocation() → PlayerSkin.texture() in 1.20.2+ |
| `IMPORT_CHANGE` | `net.minecraftforge` | `net.neoforged` | Forge → NeoForge package rename |
| `TEXT_REPLACE` | `minecraftforge` | `neoforged` | minecraftforge → neoforged |

### `1.20.1` → `1.21.10` — ⚠️ only applied when porting **exactly** `1.20.1` → `1.21.10`

1 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `net.minecraft.client.gui.screen.Screen` | `net.minecraft.client.gui.screens.Screen` | Screen moved to screens package (Mojang mappings) |

### `1.20.2` → `1.20.1`

2 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `acp.getSkin().texture()` | `acp.getSkinTextureLocation()` | PlayerSkin.texture() → getSkinTextureLocation() pre-1.20.2 |
| `IMPORT_CHANGE` | `import net.minecraft.client.resources.PlayerSkin;` | *(removed)* | Remove PlayerSkin import (not available pre-1.20.2) |

### `1.20.4` → `1.20.5`

7 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `new FriendlyByteBuf(io.netty.buffer.Unpooled.buffer())` | `new RegistryFriendlyByteBuf(io.netty.buffer.Unpooled.buffer(), player.registryAccess())` | RegistryFriendlyByteBuf requires RegistryAccess param in 1.20.5+ (must be before general rule) |
| `IMPORT_CHANGE` | `net.minecraft.network.FriendlyByteBuf` | `net.minecraft.network.RegistryFriendlyByteBuf` | FriendlyByteBuf import change for 1.20.5 |
| `TEXT_REPLACE` | `FriendlyByteBuf` | `RegistryFriendlyByteBuf` | FriendlyByteBuf → RegistryFriendlyByteBuf in 1.20.5 (Mojang mappings) |
| `IMPORT_CHANGE` | `net.neoforged.neoforge.client.event.RegisterGuiOverlaysEvent` | `net.neoforged.neoforge.client.event.RegisterGuiLayersEvent` | NeoForge: RegisterGuiOverlaysEvent → RegisterGuiLayersEvent in 1.20.5 |
| `IMPORT_CHANGE` | `net.neoforged.neoforge.event.TickEvent` | `net.neoforged.neoforge.client.event.ClientTickEvent` | NeoForge: TickEvent → ClientTickEvent package in 1.20.5 |
| `TEXT_REPLACE` | `PacketByteBuf` | `RegistryFriendlyByteBuf` | PacketByteBuf → RegistryFriendlyByteBuf for registry-aware packets |
| `IMPORT_CHANGE` | `net.minecraft.network.PacketByteBuf` | `net.minecraft.network.RegistryFriendlyByteBuf` | PacketByteBuf import change |

### `1.20.6` → `1.21`

1 rule(s) (upgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `new Identifier(` | `Identifier.of(` | Identifier constructor protected in 1.21; use Identifier.of() |

### `1.21` → `1.20.6`

2 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `import net.minecraft.client.DeltaTracker;` | *(removed)* | DeltaTracker not available pre-1.21; remove import |
| `TEXT_REPLACE` | `Identifier.of(` | `new Identifier(` | Identifier.of() → new Identifier() for pre-1.21 |

### `1.21` → `1.21.1`

1 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `minecraft ~1.21"` | `minecraft ~1.21.1"` | fabric.mod.json minecraft version constraint |

### `1.21.1` → `1.21.4` — ⚠️ only applied when porting **exactly** `1.21.1` → `1.21.4`

1 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `minecraft ~1.21.1"` | `minecraft ~1.21.4"` | fabric.mod.json minecraft version constraint |

### `1.21.4` → `1.21.10` — ⚠️ only applied when porting **exactly** `1.21.4` → `1.21.10`

6 rule(s) (upgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `FMLEnvironment.dist` | `FMLEnvironment.getDist()` | FMLEnvironment.dist → FMLEnvironment.getDist() in NeoForge 21.10.x |
| `TEXT_REPLACE` | `import net.minecraft.client.resources.PlayerSkin;` | `import net.minecraft.world.entity.player.PlayerSkin;` | PlayerSkin: client.resources → world.entity.player in 1.21.10 |
| `TEXT_REPLACE` | `import org.lwjgl.glfw.GLFW;` | `import net.minecraft.client.input.KeyEvent; import org.lwjgl.glfw.GLFW;` | Add KeyEvent import for keyPressed(KeyEvent) in 1.21.10 |
| `TEXT_REPLACE` | `public boolean keyPressed(int keyCode, int scanCode, int modifiers) {` | `public boolean keyPressed(KeyEvent event) {` | keyPressed(int,int,int) → keyPressed(KeyEvent) in 1.21.10 |
| `TEXT_REPLACE` | `keyCode == GLFW.GLFW_KEY_ENTER \|\| keyCode == GLFW.GLFW_KEY_KP_ENTER` | `event.key() == GLFW.GLFW_KEY_ENTER \|\| event.key() == GLFW.GLFW_KEY_KP_ENTER` | keyCode → event.key() in keyPressed body for 1.21.10 |
| `TEXT_REPLACE` | `return super.keyPressed(keyCode, scanCode, modifiers);` | `return super.keyPressed(event);` | super.keyPressed(int,int,int) → super.keyPressed(KeyEvent) in 1.21.10 |

### `1.21.10` → `1.21.4` — ⚠️ only applied when porting **exactly** `1.21.10` → `1.21.4`

13 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `import net.minecraft.client.input.KeyEvent;` | *(removed)* | Remove KeyEvent import (not in 1.21.4) |
| `TEXT_REPLACE` | `public boolean keyPressed(KeyEvent event) {` | `public boolean keyPressed(int keyCode, int scanCode, int modifiers) {` | keyPressed(KeyEvent) → keyPressed(int,int,int) in 1.21.4 |
| `TEXT_REPLACE` | `event.key() == GLFW.GLFW_KEY_ENTER \|\| event.key() == GLFW.GLFW_KEY_KP_ENTER` | `keyCode == GLFW.GLFW_KEY_ENTER \|\| keyCode == GLFW.GLFW_KEY_KP_ENTER` | event.key() → keyCode in keyPressed body |
| `TEXT_REPLACE` | `return super.keyPressed(event);` | `return super.keyPressed(keyCode, scanCode, modifiers);` | super.keyPressed(KeyEvent) → super.keyPressed(int,int,int) |
| `TEXT_REPLACE` | `import net.minecraft.world.entity.player.PlayerSkin;` | `import net.minecraft.client.resources.PlayerSkin;` | PlayerSkin: world.entity.player → client.resources in 1.21.4 |
| `TEXT_REPLACE` | `import net.minecraft.client.input.MouseButtonEvent;` | *(removed)* | Remove MouseButtonEvent import (not in 1.21.4) |
| `TEXT_REPLACE` | `public boolean mouseClicked(MouseButtonEvent event, boolean dragging) {` | `public boolean mouseClicked(double mouseX, double mouseY, int button) {` | mouseClicked(MouseButtonEvent) → mouseClicked(double,double,int) in 1.21.4 |
| `TEXT_REPLACE` | `double mouseX = event.x(); double mouseY = event.y();` | *(removed)* | Remove event.x()/event.y() — mouseX/mouseY are now method params |
| `TEXT_REPLACE` | `return super.mouseClicked(event, dragging);` | `return super.mouseClicked(mouseX, mouseY, button);` | super.mouseClicked(MouseButtonEvent) → super.mouseClicked(double,double,int) |
| `TEXT_REPLACE` | `playerSkin.body().texturePath()` | `playerSkin.texture()` | PlayerSkin.body().texturePath() → PlayerSkin.texture() in 1.21.4 |
| `TEXT_REPLACE` | `graphics.blit(skin, x + 1, y + 1, 14, 14, 8f / 64f, 8f / 64f, 16f / 64f, 16f / 64f);` | `graphics.blit(net.minecraft.client.renderer.RenderType::guiTextured, skin, x + 1, y + 1, 8f, 8f, 14, 14, 64…` | blit face UV: fractional → pixel with RenderType in 1.21.4 |
| `TEXT_REPLACE` | `graphics.blit(skin, x + 1, y + 1, 14, 14, 40f / 64f, 8f / 64f, 48f / 64f, 16f / 64f);` | `graphics.blit(net.minecraft.client.renderer.RenderType::guiTextured, skin, x + 1, y + 1, 40f, 8f, 14, 14, 6…` | blit hat UV: fractional → pixel with RenderType in 1.21.4 |
| `TEXT_REPLACE` | `FMLEnvironment.getDist()` | `FMLEnvironment.dist` | FMLEnvironment.getDist() → FMLEnvironment.dist in NeoForge 21.4.x |

### `1.21.5` → `1.21.6`

7 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `graphics.blit(RenderType::guiTextured, skin, x + 1, y + 1, 8f, 8f, 14, 14, 64, 64);` | `graphics.blit(skin, x + 1, y + 1, 14, 14, 8f / 64f, 8f / 64f, 16f / 64f, 16f / 64f);` | blit face UV: RenderType::guiTextured → float-UV in 1.21.6 (guiTextured removed) |
| `TEXT_REPLACE` | `graphics.blit(RenderType::guiTextured, skin, x + 1, y + 1, 40f, 8f, 14, 14, 64, 64);` | `graphics.blit(skin, x + 1, y + 1, 14, 14, 40f / 64f, 8f / 64f, 48f / 64f, 16f / 64f);` | blit hat UV: RenderType::guiTextured → float-UV in 1.21.6 (guiTextured removed) |
| `IMPORT_CHANGE` | `import net.minecraft.client.renderer.RenderType;` | *(removed)* | Remove RenderType import in 1.21.6+ (guiTextured method reference removed) |
| `TEXT_REPLACE` | `sender.server` | `((net.minecraft.server.level.ServerLevel) sender.level()).getServer()` | ServerPlayer.server field private in 1.21.6; use level().getServer() |
| `TEXT_REPLACE` | `player.server` | `((net.minecraft.server.level.ServerLevel) player.level()).getServer()` | ServerPlayer.server field private in 1.21.6; use level().getServer() |
| `TEXT_REPLACE` | `BlockRenderLayerMap.putBlock(` | `BlockRenderLayerMap.INSTANCE.putBlock(` | BlockRenderLayerMap.INSTANCE removed in 1.21.6; use static method |
| `IMPORT_CHANGE` | `import net.fabricmc.fabric.api.client.rendering.v1.BlockRenderLayerMap;` | `import net.fabricmc.fabric.api.blockrenderlayer.v1.BlockRenderLayerMap;` | BlockRenderLayerMap import moved in 1.21.6 |

### `1.21.6` → `1.21.5`

5 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `graphics.blit(skin, x + 1, y + 1, 14, 14, 8f / 64f, 8f / 64f, 16f / 64f, 16f / 64f);` | `graphics.blit(RenderType::guiTextured, skin, x + 1, y + 1, 8f, 8f, 14, 14, 64, 64);` | blit face UV: float-UV → RenderType::guiTextured for 1.21.5 |
| `TEXT_REPLACE` | `graphics.blit(skin, x + 1, y + 1, 14, 14, 40f / 64f, 8f / 64f, 48f / 64f, 16f / 64f);` | `graphics.blit(RenderType::guiTextured, skin, x + 1, y + 1, 40f, 8f, 14, 14, 64, 64);` | blit hat UV: float-UV → RenderType::guiTextured for 1.21.5 |
| `TEXT_REPLACE` | `import net.minecraft.client.gui.GuiGraphics;` | `import net.minecraft.client.gui.GuiGraphics; import net.minecraft.client.renderer.RenderType;` | Add RenderType import when downgrading to 1.21.5 (needed for ::guiTextured) |
| `TEXT_REPLACE` | `((net.minecraft.server.level.ServerLevel) sender.level()).getServer()` | `sender.server` | Inline level().getServer() → sender.server for 1.21.5 |
| `TEXT_REPLACE` | `((net.minecraft.server.level.ServerLevel) player.level()).getServer()` | `player.server` | Inline level().getServer() → player.server for 1.21.5 |

### `1.21.8` → `1.21.9`

9 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `import net.minecraft.client.resources.PlayerSkin;` | `import net.minecraft.world.entity.player.PlayerSkin;` | PlayerSkin moved: client.resources → world.entity.player in 1.21.9 |
| `TEXT_REPLACE` | `playerSkin.texture()` | `playerSkin.body().texturePath()` | PlayerSkin.texture() → PlayerSkin.body().texturePath() in 1.21.9 |
| `TEXT_REPLACE` | `import org.lwjgl.glfw.GLFW;` | `import net.minecraft.client.input.KeyEvent; import org.lwjgl.glfw.GLFW;` | Add KeyEvent import before GLFW import for keyPressed(KeyEvent) in 1.21.9 |
| `TEXT_REPLACE` | `public boolean keyPressed(int keyCode, int scanCode, int modifiers) {` | `public boolean keyPressed(KeyEvent event) {` | keyPressed(int,int,int) → keyPressed(KeyEvent) in 1.21.9 |
| `TEXT_REPLACE` | `keyCode == GLFW.GLFW_KEY_ENTER \|\| keyCode == GLFW.GLFW_KEY_KP_ENTER` | `event.key() == GLFW.GLFW_KEY_ENTER \|\| event.key() == GLFW.GLFW_KEY_KP_ENTER` | keyCode → event.key() in keyPressed body for 1.21.9+ |
| `TEXT_REPLACE` | `return super.keyPressed(keyCode, scanCode, modifiers);` | `return super.keyPressed(event);` | super.keyPressed(int,int,int) → super.keyPressed(KeyEvent) in 1.21.9+ |
| `TEXT_REPLACE` | `FMLEnvironment.dist` | `FMLEnvironment.getDist()` | FMLEnvironment.dist field → getDist() method in NeoForge 1.21.9+ |
| `METHOD_RENAME` | `.getEntityWorld()` | `.getWorld()` | Entity#getEntityWorld() (1.21.9+) ↔ Entity#getWorld() (pre-1.21.9) |
| `TEXT_REPLACE` | `SystemKeycodes.IS_MAC_OS` | `MinecraftClient.IS_SYSTEM_MAC` | SystemKeycodes.IS_MAC_OS (1.21.9+) ↔ MinecraftClient.IS_SYSTEM_MAC (pre-1.21.9) |

### `1.21.9` → `1.21.8`

6 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `playerSkin.body().texturePath()` | `playerSkin.texture()` | PlayerSkin.body().texturePath() → PlayerSkin.texture() for pre-1.21.9 |
| `IMPORT_CHANGE` | `import net.minecraft.client.input.KeyEvent;` | *(removed)* | Remove KeyEvent import when downgrading to pre-1.21.9 |
| `TEXT_REPLACE` | `public boolean keyPressed(KeyEvent event) {` | `public boolean keyPressed(int keyCode, int scanCode, int modifiers) {` | keyPressed(KeyEvent) → keyPressed(int,int,int) for pre-1.21.9 |
| `TEXT_REPLACE` | `event.key() == GLFW.GLFW_KEY_ENTER \|\| event.key() == GLFW.GLFW_KEY_KP_ENTER` | `keyCode == GLFW.GLFW_KEY_ENTER \|\| keyCode == GLFW.GLFW_KEY_KP_ENTER` | event.key() → keyCode in keyPressed body for pre-1.21.9 |
| `TEXT_REPLACE` | `return super.keyPressed(event);` | `return super.keyPressed(keyCode, scanCode, modifiers);` | super.keyPressed(KeyEvent) → super.keyPressed(int,int,int) for pre-1.21.9 |
| `TEXT_REPLACE` | `FMLEnvironment.getDist()` | `FMLEnvironment.dist` | FMLEnvironment.getDist() → .dist field for NeoForge pre-1.21.9 |

### `1.21.10` → `1.21.11`

2 rule(s) (some rules also reversed).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `import net.minecraft.resources.ResourceLocation;` | `import net.minecraft.resources.Identifier;` | ResourceLocation renamed to Identifier in 1.21.11 |
| `TEXT_REPLACE` | `ResourceLocation` | `Identifier` | ResourceLocation → Identifier in 1.21.11 |

### `1.21.11` → `1.21.10`

1 rule(s) (downgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `Identifier` | `ResourceLocation` | Identifier → ResourceLocation for pre-1.21.11 |

### `1.21.11` → `26.1`

13 rule(s) (also reversed for the downgrade).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `IMPORT_CHANGE` | `import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;` | `import net.fabricmc.fabric.api.item.v1.CreativeModeTabEvents;` | ItemGroupEvents → CreativeModeTabEvents in Fabric API 0.145 (26.1) |
| `TEXT_REPLACE` | `ItemGroupEvents.modifyEntriesEvent(` | `CreativeModeTabEvents.modify(` | ItemGroupEvents.modifyEntriesEvent → CreativeModeTabEvents.modify in Fabric API 0.145 |
| `TEXT_REPLACE` | `ItemGroupEvents` | `CreativeModeTabEvents` | ItemGroupEvents → CreativeModeTabEvents general rename |
| `IMPORT_CHANGE` | `import net.fabricmc.fabric.api.client.rendering.v1.ColorProviderRegistry;` | `import net.fabricmc.fabric.api.client.rendering.v1.BlockColorRegistry;` | ColorProviderRegistry → BlockColorRegistry in Fabric API 0.145 (26.1) |
| `TEXT_REPLACE` | `ColorProviderRegistry.BLOCK.register(` | `BlockColorRegistry.register(` | ColorProviderRegistry.BLOCK.register → BlockColorRegistry.register in 26.1 |
| `TEXT_REPLACE` | `ColorProviderRegistry.ITEM.register(` | `ItemColorRegistry.register(` | ColorProviderRegistry.ITEM.register → ItemColorRegistry.register in 26.1 |
| `IMPORT_CHANGE` | `import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;` | `import net.fabricmc.fabric.api.client.rendering.v1.hud.HudElementRegistry;` | HudRenderCallback → HudElementRegistry import in Fabric API 0.145 (26.1) |
| `TEXT_REPLACE` | `new ChunkPos(blockPos)` | `ChunkPos.containing(blockPos)` | new ChunkPos(BlockPos) constructor removed; use ChunkPos.containing(blockPos) in 26.1 |
| `TEXT_REPLACE` | `ChunkPos.asLong(` | `ChunkPos.pack(` | ChunkPos.asLong() → ChunkPos.pack() in 26.1 |
| `CLASS_RENAME` | `GuiGraphics` | `GuiGraphicsExtractor` | GuiGraphics (pre-26.1) → GuiGraphicsExtractor (26.1) |
| `IMPORT_CHANGE` | `import net.minecraft.client.gui.GuiGraphics;` | `import net.minecraft.client.gui.GuiGraphicsExtractor;` | GuiGraphics import → GuiGraphicsExtractor in 26.1 |
| `METHOD_RENAME` | `method = "renderSlot"` | `method = "extractSlot"` | renderSlot (pre-26.1) → extractSlot (26.1) in @Inject method attribute |
| `METHOD_RENAME` | `target = "GuiGraphics.renderItem(` | `target = "GuiGraphicsExtractor.item(` | GuiGraphics.renderItem (pre-26.1) → GuiGraphicsExtractor.item (26.1) in dot-notation target |

### `26.1.2` → `26.2`

177 rule(s) (upgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `Minecraft.getInstance().setScreen(` | `Minecraft.getInstance().gui.setScreen(` | 26.2 GUI: Minecraft#setScreen moved to Gui#setScreen |
| `TEXT_REPLACE` | `this.minecraft.setScreen(` | `this.minecraft.gui.setScreen(` | 26.2 GUI: this.minecraft#setScreen moved to Gui#setScreen |
| `TEXT_REPLACE` | `minecraft.setScreen(` | `minecraft.gui.setScreen(` | 26.2 GUI: minecraft#setScreen moved to Gui#setScreen |
| `TEXT_REPLACE` | `Minecraft.getInstance().screen` | `Minecraft.getInstance().gui.screen()` | 26.2 GUI: Minecraft#screen moved to Gui#screen() |
| `TEXT_REPLACE` | `this.minecraft.screen` | `this.minecraft.gui.screen()` | 26.2 GUI: this.minecraft#screen moved to Gui#screen() |
| `TEXT_REPLACE` | `minecraft.screen` | `minecraft.gui.screen()` | 26.2 GUI: minecraft#screen moved to Gui#screen() |
| `TEXT_REPLACE` | `Minecraft.getInstance().openChatScreen(` | `Minecraft.getInstance().gui.openChatScreen(` | 26.2 GUI: Minecraft#openChatScreen moved to Gui#openChatScreen |
| `TEXT_REPLACE` | `Minecraft.getInstance().getToastManager()` | `Minecraft.getInstance().gui.toastManager()` | 26.2 GUI: Minecraft#getToastManager moved to Gui#toastManager |
| `TEXT_REPLACE` | `Minecraft.getInstance().getChatListener()` | `Minecraft.getInstance().gui.chatListener()` | 26.2 GUI: Minecraft#getChatListener moved to Gui#chatListener |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.setOverlayMessage(` | `Minecraft.getInstance().gui.hud.setOverlayMessage(` | 26.2 HUD: Gui#setOverlayMessage moved to Hud#setOverlayMessage |
| `TEXT_REPLACE` | `this.minecraft.gui.setOverlayMessage(` | `this.minecraft.gui.hud.setOverlayMessage(` | 26.2 HUD: Gui#setOverlayMessage moved to Hud#setOverlayMessage |
| `TEXT_REPLACE` | `minecraft.gui.setOverlayMessage(` | `minecraft.gui.hud.setOverlayMessage(` | 26.2 HUD: Gui#setOverlayMessage moved to Hud#setOverlayMessage |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.resetTitleTimes(` | `Minecraft.getInstance().gui.hud.resetTitleTimes(` | 26.2 HUD: Gui#resetTitleTimes moved to Hud#resetTitleTimes |
| `TEXT_REPLACE` | `this.minecraft.gui.resetTitleTimes(` | `this.minecraft.gui.hud.resetTitleTimes(` | 26.2 HUD: Gui#resetTitleTimes moved to Hud#resetTitleTimes |
| `TEXT_REPLACE` | `minecraft.gui.resetTitleTimes(` | `minecraft.gui.hud.resetTitleTimes(` | 26.2 HUD: Gui#resetTitleTimes moved to Hud#resetTitleTimes |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.setNowPlaying(` | `Minecraft.getInstance().gui.hud.setNowPlaying(` | 26.2 HUD: Gui#setNowPlaying moved to Hud#setNowPlaying |
| `TEXT_REPLACE` | `this.minecraft.gui.setNowPlaying(` | `this.minecraft.gui.hud.setNowPlaying(` | 26.2 HUD: Gui#setNowPlaying moved to Hud#setNowPlaying |
| `TEXT_REPLACE` | `minecraft.gui.setNowPlaying(` | `minecraft.gui.hud.setNowPlaying(` | 26.2 HUD: Gui#setNowPlaying moved to Hud#setNowPlaying |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.setTimes(` | `Minecraft.getInstance().gui.hud.setTimes(` | 26.2 HUD: Gui#setTimes moved to Hud#setTimes |
| `TEXT_REPLACE` | `this.minecraft.gui.setTimes(` | `this.minecraft.gui.hud.setTimes(` | 26.2 HUD: Gui#setTimes moved to Hud#setTimes |
| `TEXT_REPLACE` | `minecraft.gui.setTimes(` | `minecraft.gui.hud.setTimes(` | 26.2 HUD: Gui#setTimes moved to Hud#setTimes |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.setSubtitle(` | `Minecraft.getInstance().gui.hud.setSubtitle(` | 26.2 HUD: Gui#setSubtitle moved to Hud#setSubtitle |
| `TEXT_REPLACE` | `this.minecraft.gui.setSubtitle(` | `this.minecraft.gui.hud.setSubtitle(` | 26.2 HUD: Gui#setSubtitle moved to Hud#setSubtitle |
| `TEXT_REPLACE` | `minecraft.gui.setSubtitle(` | `minecraft.gui.hud.setSubtitle(` | 26.2 HUD: Gui#setSubtitle moved to Hud#setSubtitle |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.setTitle(` | `Minecraft.getInstance().gui.hud.setTitle(` | 26.2 HUD: Gui#setTitle moved to Hud#setTitle |
| `TEXT_REPLACE` | `this.minecraft.gui.setTitle(` | `this.minecraft.gui.hud.setTitle(` | 26.2 HUD: Gui#setTitle moved to Hud#setTitle |
| `TEXT_REPLACE` | `minecraft.gui.setTitle(` | `minecraft.gui.hud.setTitle(` | 26.2 HUD: Gui#setTitle moved to Hud#setTitle |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.clearTitles(` | `Minecraft.getInstance().gui.hud.clearTitles(` | 26.2 HUD: Gui#clearTitles moved to Hud#clearTitles |
| `TEXT_REPLACE` | `this.minecraft.gui.clearTitles(` | `this.minecraft.gui.hud.clearTitles(` | 26.2 HUD: Gui#clearTitles moved to Hud#clearTitles |
| `TEXT_REPLACE` | `minecraft.gui.clearTitles(` | `minecraft.gui.hud.clearTitles(` | 26.2 HUD: Gui#clearTitles moved to Hud#clearTitles |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getChat(` | `Minecraft.getInstance().gui.hud.getChat(` | 26.2 HUD: Gui#getChat moved to Hud#getChat |
| `TEXT_REPLACE` | `this.minecraft.gui.getChat(` | `this.minecraft.gui.hud.getChat(` | 26.2 HUD: Gui#getChat moved to Hud#getChat |
| `TEXT_REPLACE` | `minecraft.gui.getChat(` | `minecraft.gui.hud.getChat(` | 26.2 HUD: Gui#getChat moved to Hud#getChat |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getGuiTicks(` | `Minecraft.getInstance().gui.hud.getGuiTicks(` | 26.2 HUD: Gui#getGuiTicks moved to Hud#getGuiTicks |
| `TEXT_REPLACE` | `this.minecraft.gui.getGuiTicks(` | `this.minecraft.gui.hud.getGuiTicks(` | 26.2 HUD: Gui#getGuiTicks moved to Hud#getGuiTicks |
| `TEXT_REPLACE` | `minecraft.gui.getGuiTicks(` | `minecraft.gui.hud.getGuiTicks(` | 26.2 HUD: Gui#getGuiTicks moved to Hud#getGuiTicks |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getFont(` | `Minecraft.getInstance().gui.hud.getFont(` | 26.2 HUD: Gui#getFont moved to Hud#getFont |
| `TEXT_REPLACE` | `this.minecraft.gui.getFont(` | `this.minecraft.gui.hud.getFont(` | 26.2 HUD: Gui#getFont moved to Hud#getFont |
| `TEXT_REPLACE` | `minecraft.gui.getFont(` | `minecraft.gui.hud.getFont(` | 26.2 HUD: Gui#getFont moved to Hud#getFont |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getSpectatorGui(` | `Minecraft.getInstance().gui.hud.getSpectatorGui(` | 26.2 HUD: Gui#getSpectatorGui moved to Hud#getSpectatorGui |
| `TEXT_REPLACE` | `this.minecraft.gui.getSpectatorGui(` | `this.minecraft.gui.hud.getSpectatorGui(` | 26.2 HUD: Gui#getSpectatorGui moved to Hud#getSpectatorGui |
| `TEXT_REPLACE` | `minecraft.gui.getSpectatorGui(` | `minecraft.gui.hud.getSpectatorGui(` | 26.2 HUD: Gui#getSpectatorGui moved to Hud#getSpectatorGui |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getTabList(` | `Minecraft.getInstance().gui.hud.getTabList(` | 26.2 HUD: Gui#getTabList moved to Hud#getTabList |
| `TEXT_REPLACE` | `this.minecraft.gui.getTabList(` | `this.minecraft.gui.hud.getTabList(` | 26.2 HUD: Gui#getTabList moved to Hud#getTabList |
| `TEXT_REPLACE` | `minecraft.gui.getTabList(` | `minecraft.gui.hud.getTabList(` | 26.2 HUD: Gui#getTabList moved to Hud#getTabList |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.onDisconnected(` | `Minecraft.getInstance().gui.hud.onDisconnected(` | 26.2 HUD: Gui#onDisconnected moved to Hud#onDisconnected |
| `TEXT_REPLACE` | `this.minecraft.gui.onDisconnected(` | `this.minecraft.gui.hud.onDisconnected(` | 26.2 HUD: Gui#onDisconnected moved to Hud#onDisconnected |
| `TEXT_REPLACE` | `minecraft.gui.onDisconnected(` | `minecraft.gui.hud.onDisconnected(` | 26.2 HUD: Gui#onDisconnected moved to Hud#onDisconnected |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getBossOverlay(` | `Minecraft.getInstance().gui.hud.getBossOverlay(` | 26.2 HUD: Gui#getBossOverlay moved to Hud#getBossOverlay |
| `TEXT_REPLACE` | `this.minecraft.gui.getBossOverlay(` | `this.minecraft.gui.hud.getBossOverlay(` | 26.2 HUD: Gui#getBossOverlay moved to Hud#getBossOverlay |
| `TEXT_REPLACE` | `minecraft.gui.getBossOverlay(` | `minecraft.gui.hud.getBossOverlay(` | 26.2 HUD: Gui#getBossOverlay moved to Hud#getBossOverlay |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.getDebugOverlay(` | `Minecraft.getInstance().gui.hud.getDebugOverlay(` | 26.2 HUD: Gui#getDebugOverlay moved to Hud#getDebugOverlay |
| `TEXT_REPLACE` | `this.minecraft.gui.getDebugOverlay(` | `this.minecraft.gui.hud.getDebugOverlay(` | 26.2 HUD: Gui#getDebugOverlay moved to Hud#getDebugOverlay |
| `TEXT_REPLACE` | `minecraft.gui.getDebugOverlay(` | `minecraft.gui.hud.getDebugOverlay(` | 26.2 HUD: Gui#getDebugOverlay moved to Hud#getDebugOverlay |
| `TEXT_REPLACE` | `Minecraft.getInstance().gui.clearCache(` | `Minecraft.getInstance().gui.hud.clearCache(` | 26.2 HUD: Gui#clearCache moved to Hud#clearCache |
| `TEXT_REPLACE` | `this.minecraft.gui.clearCache(` | `this.minecraft.gui.hud.clearCache(` | 26.2 HUD: Gui#clearCache moved to Hud#clearCache |
| `TEXT_REPLACE` | `minecraft.gui.clearCache(` | `minecraft.gui.hud.clearCache(` | 26.2 HUD: Gui#clearCache moved to Hud#clearCache |
| `IMPORT_CHANGE` | `import net.minecraft.world.entity.monster.MagmaCube;` | `import net.minecraft.world.entity.monster.cubemob.MagmaCube;` | 26.2 class move: MagmaCube moved to monster.cubemob |
| `IMPORT_CHANGE` | `import net.minecraft.world.entity.monster.Slime;` | `import net.minecraft.world.entity.monster.cubemob.Slime;` | 26.2 class move: Slime moved to monster.cubemob |
| `TEXT_REPLACE` | `net.minecraft.world.entity.monster.MagmaCube` | `net.minecraft.world.entity.monster.cubemob.MagmaCube` | 26.2 fully-qualified class move: MagmaCube moved to monster.cubemob |
| `TEXT_REPLACE` | `net.minecraft.world.entity.monster.Slime` | `net.minecraft.world.entity.monster.cubemob.Slime` | 26.2 fully-qualified class move: Slime moved to monster.cubemob |
| `TEXT_REPLACE` | `PointedDripstoneFeature` | `SpeleothemFeature` | 26.2 worldgen rename: PointedDripstoneFeature -> SpeleothemFeature |
| `TEXT_REPLACE` | `DripstoneClusterFeature` | `SpeleothemClusterFeature` | 26.2 worldgen rename: DripstoneClusterFeature -> SpeleothemClusterFeature |
| `TEXT_REPLACE` | `PointedDripstoneConfiguration` | `SpeleothemConfiguration` | 26.2 worldgen rename: PointedDripstoneConfiguration -> SpeleothemConfiguration |
| `TEXT_REPLACE` | `DripstoneClusterConfiguration` | `SpeleothemClusterConfiguration` | 26.2 worldgen rename: DripstoneClusterConfiguration -> SpeleothemClusterConfiguration |
| `TEXT_REPLACE` | `DripstoneUtils` | `SpeleothemUtils` | 26.2 worldgen rename: DripstoneUtils -> SpeleothemUtils |
| `TEXT_REPLACE` | `DripstoneThickness` | `SpeleothemThickness` | 26.2 block-state enum rename: DripstoneThickness -> SpeleothemThickness |
| `TEXT_REPLACE` | `BlockStateProperties.DRIPSTONE_THICKNESS` | `BlockStateProperties.SPELEOTHEM_THICKNESS` | 26.2 property rename: DRIPSTONE_THICKNESS -> SPELEOTHEM_THICKNESS |
| `TEXT_REPLACE` | `Feature.DRIPSTONE_CLUSTER` | `Feature.SPELEOTHEM_CLUSTER` | 26.2 feature constant rename: DRIPSTONE_CLUSTER -> SPELEOTHEM_CLUSTER |
| `TEXT_REPLACE` | `Feature.POINTED_DRIPSTONE` | `Feature.SPELEOTHEM` | 26.2 feature constant rename: POINTED_DRIPSTONE -> SPELEOTHEM |
| `TEXT_REPLACE` | `TreeConfiguration.CAN_PLACE_BELOW_OVERWORLD_TRUNKS` | `TreeConfiguration.CAN_PLACE_BELOW_TREE_TRUNKS` | 26.2 tree config constant rename: CAN_PLACE_BELOW_OVERWORLD_TRUNKS -> CAN_PLACE_BELOW_TREE_TRUNKS |
| `TEXT_REPLACE` | `ChunkPos.MAX_COORDINATE_VALUE` | `ChunkPyramid.MAX_CHUNK_COORDINATE_VALUE` | 26.2 chunk coordinate constant moved to ChunkPyramid |
| `IMPORT_CHANGE` | `import net.minecraft.world.level.ChunkPos;` | `import net.minecraft.world.level.ChunkPos; import net.minecraft.world.level.ChunkPyramid;` | 26.2 add ChunkPyramid import for MAX_CHUNK_COORDINATE_VALUE |
| `TEXT_REPLACE` | `.markPosForPostprocessing(` | `.markPosForPostProcessing(` | 26.2 method spelling change: markPosForPostprocessing -> markPosForPostProcessing |
| `TEXT_REPLACE` | `.getLightBlockInto(` | `.getLightDampeningInto(` | 26.2 lighting rename: getLightBlockInto -> getLightDampeningInto |
| `TEXT_REPLACE` | `WorldPresets.createFlatWorldDimensions(` | `WorldPresets.createTestWorldDimensions(` | 26.2 world preset rename: createFlatWorldDimensions -> createTestWorldDimensions |
| `TEXT_REPLACE` | `PlayerSpawnFinder.getOverworldRespawnPos(` | `PlayerSpawnFinder.getLevelRespawnPos(` | 26.2 respawn helper rename: getOverworldRespawnPos -> getLevelRespawnPos |
| `TEXT_REPLACE` | `GamePacketTypes.SERVERBOUND_SPECTATE_ENTITY` | `GamePacketTypes.SERVERBOUND_SPECTATOR_ACTION` | 26.2 networking packet type rename: SERVERBOUND_SPECTATE_ENTITY -> SERVERBOUND_SPECTATOR_ACTION |
| `TEXT_REPLACE` | `handleSpectateEntity(` | `handleSpectatorAction(` | 26.2 networking handler rename: handleSpectateEntity -> handleSpectatorAction |
| `TEXT_REPLACE` | `ServerboundSpectateEntityPacket` | `ServerboundSpectatorActionPacket` | 26.2 networking class rename: ServerboundSpectateEntityPacket -> ServerboundSpectatorActionPacket |
| `TEXT_REPLACE` | `ColorArgument` | `TeamColorArgument` | 26.2 command argument rename: ColorArgument -> TeamColorArgument |
| `TEXT_REPLACE` | `InstantenousMobEffect` | `InstantaneousMobEffect` | 26.2 spelling fix: InstantenousMobEffect -> InstantaneousMobEffect |
| `TEXT_REPLACE` | `applyInstantenousEffect(` | `applyInstantaneousEffect(` | 26.2 spelling fix: applyInstantenousEffect -> applyInstantaneousEffect |
| `TEXT_REPLACE` | `isInstantenous(` | `isInstantaneous(` | 26.2 spelling fix: isInstantenous -> isInstantaneous |
| `IMPORT_CHANGE` | `import net.minecraft.world.Bucketable;` | `import net.minecraft.world.entity.Bucketable;` | 26.2 class move: Bucketable moved to world.entity |
| `TEXT_REPLACE` | `ContextualBarRenderer` | `ContextualBar` | 26.2 HUD class rename: ContextualBarRenderer -> ContextualBar |
| `TEXT_REPLACE` | `ExperienceBarRenderer` | `ExperienceBar` | 26.2 HUD class rename: ExperienceBarRenderer -> ExperienceBar |
| `TEXT_REPLACE` | `JumpableVehicleBarRenderer` | `JumpableVehicleBar` | 26.2 HUD class rename: JumpableVehicleBarRenderer -> JumpableVehicleBar |
| `TEXT_REPLACE` | `LocatorBarRenderer` | `LocatorBar` | 26.2 HUD class rename: LocatorBarRenderer -> LocatorBar |
| `TEXT_REPLACE` | `GlyphRenderTypes.createForIntensityTexture(` | `GlyphRenderTypes.createForGrayscaleTexture(` | 26.2 font rendering rename: createForIntensityTexture -> createForGrayscaleTexture |
| `TEXT_REPLACE` | `.isPauseScreen(` | `.isPausing(` | 26.2 overlay rename: Overlay#isPauseScreen -> isPausing |
| `TEXT_REPLACE` | `RenderType.TEXT_INTENSITY` | `RenderType.TEXT_GRAYSCALE` | 26.2 render type rename: TEXT_INTENSITY -> TEXT_GRAYSCALE |
| `TEXT_REPLACE` | `RenderType.GUI_TEXT_INTENSITY` | `RenderType.GUI_TEXT_GRAYSCALE` | 26.2 render type rename: GUI_TEXT_INTENSITY -> GUI_TEXT_GRAYSCALE |
| `TEXT_REPLACE` | `RenderType.TEXT_INTENSITY_SEE_THROUGH` | `RenderType.TEXT_GRAYSCALE_SEE_THROUGH` | 26.2 render type rename: TEXT_INTENSITY_SEE_THROUGH -> TEXT_GRAYSCALE_SEE_THROUGH |
| `TEXT_REPLACE` | `createPointedDripstoneVariant(` | `createSpeleothemVariant(` | 26.2 helper rename: createPointedDripstoneVariant -> createSpeleothemVariant |
| `TEXT_REPLACE` | `createPointedDripstone(` | `createSpeleothem(` | 26.2 helper rename: createPointedDripstone -> createSpeleothem |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.CriteriaTriggers;` | `import net.minecraft.advancements.triggers.CriteriaTriggers;` | 26.2 advancement package move: net.minecraft.advancements.CriteriaTriggers -> net.minecraft.advancements.triggers.CriteriaTriggers |
| `TEXT_REPLACE` | `net.minecraft.advancements.CriteriaTriggers` | `net.minecraft.advancements.triggers.CriteriaTriggers` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.CriteriaTriggers -> net.minecraft.advancements.triggers.CriteriaTriggers |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.Criterion;` | `import net.minecraft.advancements.triggers.Criterion;` | 26.2 advancement package move: net.minecraft.advancements.Criterion -> net.minecraft.advancements.triggers.Criterion |
| `TEXT_REPLACE` | `net.minecraft.advancements.Criterion` | `net.minecraft.advancements.triggers.Criterion` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.Criterion -> net.minecraft.advancements.triggers.Criterion |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.CriterionTrigger;` | `import net.minecraft.advancements.triggers.CriterionTrigger;` | 26.2 advancement package move: net.minecraft.advancements.CriterionTrigger -> net.minecraft.advancements.triggers.CriterionTrigger |
| `TEXT_REPLACE` | `net.minecraft.advancements.CriterionTrigger` | `net.minecraft.advancements.triggers.CriterionTrigger` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.CriterionTrigger -> net.minecraft.advancements.triggers.CriterionTrigger |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.BlockPredicate;` | `import net.minecraft.advancements.predicates.BlockPredicate;` | 26.2 advancement package move: net.minecraft.advancements.BlockPredicate -> net.minecraft.advancements.predicates.BlockPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.BlockPredicate` | `net.minecraft.advancements.predicates.BlockPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.BlockPredicate -> net.minecraft.advancements.predicates.BlockPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.CollectionContentsPredicate;` | `import net.minecraft.advancements.predicates.CollectionContentsPredicate;` | 26.2 advancement package move: net.minecraft.advancements.CollectionContentsPredicate -> net.minecraft.advancements.predicates.CollectionContentsPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.CollectionContentsPredicate` | `net.minecraft.advancements.predicates.CollectionContentsPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.CollectionContentsPredicate -> net.minecraft.advancements.predicates.CollectionCont… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.CollectionCountsPredicate;` | `import net.minecraft.advancements.predicates.CollectionCountsPredicate;` | 26.2 advancement package move: net.minecraft.advancements.CollectionCountsPredicate -> net.minecraft.advancements.predicates.CollectionCountsPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.CollectionCountsPredicate` | `net.minecraft.advancements.predicates.CollectionCountsPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.CollectionCountsPredicate -> net.minecraft.advancements.predicates.CollectionCounts… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.CollectionPredicate;` | `import net.minecraft.advancements.predicates.CollectionPredicate;` | 26.2 advancement package move: net.minecraft.advancements.CollectionPredicate -> net.minecraft.advancements.predicates.CollectionPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.CollectionPredicate` | `net.minecraft.advancements.predicates.CollectionPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.CollectionPredicate -> net.minecraft.advancements.predicates.CollectionPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.ContextAwarePredicate;` | `import net.minecraft.advancements.predicates.ContextAwarePredicate;` | 26.2 advancement package move: net.minecraft.advancements.ContextAwarePredicate -> net.minecraft.advancements.predicates.ContextAwarePredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.ContextAwarePredicate` | `net.minecraft.advancements.predicates.ContextAwarePredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.ContextAwarePredicate -> net.minecraft.advancements.predicates.ContextAwarePredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.DamagePredicate;` | `import net.minecraft.advancements.predicates.DamagePredicate;` | 26.2 advancement package move: net.minecraft.advancements.DamagePredicate -> net.minecraft.advancements.predicates.DamagePredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.DamagePredicate` | `net.minecraft.advancements.predicates.DamagePredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.DamagePredicate -> net.minecraft.advancements.predicates.DamagePredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.DamageSourcePredicate;` | `import net.minecraft.advancements.predicates.DamageSourcePredicate;` | 26.2 advancement package move: net.minecraft.advancements.DamageSourcePredicate -> net.minecraft.advancements.predicates.DamageSourcePredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.DamageSourcePredicate` | `net.minecraft.advancements.predicates.DamageSourcePredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.DamageSourcePredicate -> net.minecraft.advancements.predicates.DamageSourcePredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.DataComponentMatchers;` | `import net.minecraft.advancements.predicates.DataComponentMatchers;` | 26.2 advancement package move: net.minecraft.advancements.DataComponentMatchers -> net.minecraft.advancements.predicates.DataComponentMatchers |
| `TEXT_REPLACE` | `net.minecraft.advancements.DataComponentMatchers` | `net.minecraft.advancements.predicates.DataComponentMatchers` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.DataComponentMatchers -> net.minecraft.advancements.predicates.DataComponentMatchers |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.DistancePredicate;` | `import net.minecraft.advancements.predicates.DistancePredicate;` | 26.2 advancement package move: net.minecraft.advancements.DistancePredicate -> net.minecraft.advancements.predicates.DistancePredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.DistancePredicate` | `net.minecraft.advancements.predicates.DistancePredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.DistancePredicate -> net.minecraft.advancements.predicates.DistancePredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EnchantmentPredicate;` | `import net.minecraft.advancements.predicates.EnchantmentPredicate;` | 26.2 advancement package move: net.minecraft.advancements.EnchantmentPredicate -> net.minecraft.advancements.predicates.EnchantmentPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.EnchantmentPredicate` | `net.minecraft.advancements.predicates.EnchantmentPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EnchantmentPredicate -> net.minecraft.advancements.predicates.EnchantmentPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EntityEquipmentPredicate;` | `import net.minecraft.advancements.predicates.entity.EntityEquipmentPredicate;` | 26.2 advancement package move: net.minecraft.advancements.EntityEquipmentPredicate -> net.minecraft.advancements.predicates.entity.EntityEquipmentPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.EntityEquipmentPredicate` | `net.minecraft.advancements.predicates.entity.EntityEquipmentPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EntityEquipmentPredicate -> net.minecraft.advancements.predicates.entity.EntityEqui… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EntityFlagsPredicate;` | `import net.minecraft.advancements.predicates.entity.EntityFlagsPredicate;` | 26.2 advancement package move: net.minecraft.advancements.EntityFlagsPredicate -> net.minecraft.advancements.predicates.entity.EntityFlagsPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.EntityFlagsPredicate` | `net.minecraft.advancements.predicates.entity.EntityFlagsPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EntityFlagsPredicate -> net.minecraft.advancements.predicates.entity.EntityFlagsPre… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EntityPredicate;` | `import net.minecraft.advancements.predicates.entity.EntityPredicate;` | 26.2 advancement package move: net.minecraft.advancements.EntityPredicate -> net.minecraft.advancements.predicates.entity.EntityPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.EntityPredicate` | `net.minecraft.advancements.predicates.entity.EntityPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EntityPredicate -> net.minecraft.advancements.predicates.entity.EntityPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EntitySubPredicate;` | `import net.minecraft.advancements.predicates.entity.EntitySubPredicate;` | 26.2 advancement package move: net.minecraft.advancements.EntitySubPredicate -> net.minecraft.advancements.predicates.entity.EntitySubPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.EntitySubPredicate` | `net.minecraft.advancements.predicates.entity.EntitySubPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EntitySubPredicate -> net.minecraft.advancements.predicates.entity.EntitySubPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EntitySubPredicates;` | `import net.minecraft.advancements.predicates.entity.EntitySubPredicates;` | 26.2 advancement package move: net.minecraft.advancements.EntitySubPredicates -> net.minecraft.advancements.predicates.entity.EntitySubPredicates |
| `TEXT_REPLACE` | `net.minecraft.advancements.EntitySubPredicates` | `net.minecraft.advancements.predicates.entity.EntitySubPredicates` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EntitySubPredicates -> net.minecraft.advancements.predicates.entity.EntitySubPredic… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.EntityTypePredicate;` | `import net.minecraft.advancements.predicates.entity.EntityTypePredicate;` | 26.2 advancement package move: net.minecraft.advancements.EntityTypePredicate -> net.minecraft.advancements.predicates.entity.EntityTypePredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.EntityTypePredicate` | `net.minecraft.advancements.predicates.entity.EntityTypePredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.EntityTypePredicate -> net.minecraft.advancements.predicates.entity.EntityTypePredi… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.FishingHookPredicate;` | `import net.minecraft.advancements.predicates.entity.FishingHookPredicate;` | 26.2 advancement package move: net.minecraft.advancements.FishingHookPredicate -> net.minecraft.advancements.predicates.entity.FishingHookPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.FishingHookPredicate` | `net.minecraft.advancements.predicates.entity.FishingHookPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.FishingHookPredicate -> net.minecraft.advancements.predicates.entity.FishingHookPre… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.FluidPredicate;` | `import net.minecraft.advancements.predicates.FluidPredicate;` | 26.2 advancement package move: net.minecraft.advancements.FluidPredicate -> net.minecraft.advancements.predicates.FluidPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.FluidPredicate` | `net.minecraft.advancements.predicates.FluidPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.FluidPredicate -> net.minecraft.advancements.predicates.FluidPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.FoodPredicate;` | `import net.minecraft.advancements.predicates.FoodPredicate;` | 26.2 advancement package move: net.minecraft.advancements.FoodPredicate -> net.minecraft.advancements.predicates.FoodPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.FoodPredicate` | `net.minecraft.advancements.predicates.FoodPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.FoodPredicate -> net.minecraft.advancements.predicates.FoodPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.GameTypePredicate;` | `import net.minecraft.advancements.predicates.GameTypePredicate;` | 26.2 advancement package move: net.minecraft.advancements.GameTypePredicate -> net.minecraft.advancements.predicates.GameTypePredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.GameTypePredicate` | `net.minecraft.advancements.predicates.GameTypePredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.GameTypePredicate -> net.minecraft.advancements.predicates.GameTypePredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.InputPredicate;` | `import net.minecraft.advancements.predicates.InputPredicate;` | 26.2 advancement package move: net.minecraft.advancements.InputPredicate -> net.minecraft.advancements.predicates.InputPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.InputPredicate` | `net.minecraft.advancements.predicates.InputPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.InputPredicate -> net.minecraft.advancements.predicates.InputPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.ItemPredicate;` | `import net.minecraft.advancements.predicates.ItemPredicate;` | 26.2 advancement package move: net.minecraft.advancements.ItemPredicate -> net.minecraft.advancements.predicates.ItemPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.ItemPredicate` | `net.minecraft.advancements.predicates.ItemPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.ItemPredicate -> net.minecraft.advancements.predicates.ItemPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.LightningBoltPredicate;` | `import net.minecraft.advancements.predicates.entity.LightningBoltPredicate;` | 26.2 advancement package move: net.minecraft.advancements.LightningBoltPredicate -> net.minecraft.advancements.predicates.entity.LightningBoltPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.LightningBoltPredicate` | `net.minecraft.advancements.predicates.entity.LightningBoltPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.LightningBoltPredicate -> net.minecraft.advancements.predicates.entity.LightningBol… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.LightPredicate;` | `import net.minecraft.advancements.predicates.LightPredicate;` | 26.2 advancement package move: net.minecraft.advancements.LightPredicate -> net.minecraft.advancements.predicates.LightPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.LightPredicate` | `net.minecraft.advancements.predicates.LightPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.LightPredicate -> net.minecraft.advancements.predicates.LightPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.LocationPredicate;` | `import net.minecraft.advancements.predicates.LocationPredicate;` | 26.2 advancement package move: net.minecraft.advancements.LocationPredicate -> net.minecraft.advancements.predicates.LocationPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.LocationPredicate` | `net.minecraft.advancements.predicates.LocationPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.LocationPredicate -> net.minecraft.advancements.predicates.LocationPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.MinMaxBounds;` | `import net.minecraft.advancements.predicates.MinMaxBounds;` | 26.2 advancement package move: net.minecraft.advancements.MinMaxBounds -> net.minecraft.advancements.predicates.MinMaxBounds |
| `TEXT_REPLACE` | `net.minecraft.advancements.MinMaxBounds` | `net.minecraft.advancements.predicates.MinMaxBounds` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.MinMaxBounds -> net.minecraft.advancements.predicates.MinMaxBounds |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.MobEffectsPredicate;` | `import net.minecraft.advancements.predicates.MobEffectsPredicate;` | 26.2 advancement package move: net.minecraft.advancements.MobEffectsPredicate -> net.minecraft.advancements.predicates.MobEffectsPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.MobEffectsPredicate` | `net.minecraft.advancements.predicates.MobEffectsPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.MobEffectsPredicate -> net.minecraft.advancements.predicates.MobEffectsPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.MovementPredicate;` | `import net.minecraft.advancements.predicates.entity.MovementPredicate;` | 26.2 advancement package move: net.minecraft.advancements.MovementPredicate -> net.minecraft.advancements.predicates.entity.MovementPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.MovementPredicate` | `net.minecraft.advancements.predicates.entity.MovementPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.MovementPredicate -> net.minecraft.advancements.predicates.entity.MovementPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.NbtPredicate;` | `import net.minecraft.advancements.predicates.NbtPredicate;` | 26.2 advancement package move: net.minecraft.advancements.NbtPredicate -> net.minecraft.advancements.predicates.NbtPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.NbtPredicate` | `net.minecraft.advancements.predicates.NbtPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.NbtPredicate -> net.minecraft.advancements.predicates.NbtPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.PlayerPredicate;` | `import net.minecraft.advancements.predicates.entity.PlayerPredicate;` | 26.2 advancement package move: net.minecraft.advancements.PlayerPredicate -> net.minecraft.advancements.predicates.entity.PlayerPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.PlayerPredicate` | `net.minecraft.advancements.predicates.entity.PlayerPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.PlayerPredicate -> net.minecraft.advancements.predicates.entity.PlayerPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.RaiderPredicate;` | `import net.minecraft.advancements.predicates.entity.RaiderPredicate;` | 26.2 advancement package move: net.minecraft.advancements.RaiderPredicate -> net.minecraft.advancements.predicates.entity.RaiderPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.RaiderPredicate` | `net.minecraft.advancements.predicates.entity.RaiderPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.RaiderPredicate -> net.minecraft.advancements.predicates.entity.RaiderPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.SheepPredicate;` | `import net.minecraft.advancements.predicates.entity.SheepPredicate;` | 26.2 advancement package move: net.minecraft.advancements.SheepPredicate -> net.minecraft.advancements.predicates.entity.SheepPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.SheepPredicate` | `net.minecraft.advancements.predicates.entity.SheepPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.SheepPredicate -> net.minecraft.advancements.predicates.entity.SheepPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.SingleComponentItemPredicate;` | `import net.minecraft.advancements.predicates.SingleComponentItemPredicate;` | 26.2 advancement package move: net.minecraft.advancements.SingleComponentItemPredicate -> net.minecraft.advancements.predicates.SingleComponentItemPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.SingleComponentItemPredicate` | `net.minecraft.advancements.predicates.SingleComponentItemPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.SingleComponentItemPredicate -> net.minecraft.advancements.predicates.SingleCompone… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.SlimePredicate;` | `import net.minecraft.advancements.predicates.entity.CubeMobPredicate;` | 26.2 advancement package move: net.minecraft.advancements.SlimePredicate -> net.minecraft.advancements.predicates.entity.CubeMobPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.SlimePredicate` | `net.minecraft.advancements.predicates.entity.CubeMobPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.SlimePredicate -> net.minecraft.advancements.predicates.entity.CubeMobPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.SlotsPredicate;` | `import net.minecraft.advancements.predicates.SlotsPredicate;` | 26.2 advancement package move: net.minecraft.advancements.SlotsPredicate -> net.minecraft.advancements.predicates.SlotsPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.SlotsPredicate` | `net.minecraft.advancements.predicates.SlotsPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.SlotsPredicate -> net.minecraft.advancements.predicates.SlotsPredicate |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.StatePropertiesPredicate;` | `import net.minecraft.advancements.predicates.StatePropertiesPredicate;` | 26.2 advancement package move: net.minecraft.advancements.StatePropertiesPredicate -> net.minecraft.advancements.predicates.StatePropertiesPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.StatePropertiesPredicate` | `net.minecraft.advancements.predicates.StatePropertiesPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.StatePropertiesPredicate -> net.minecraft.advancements.predicates.StatePropertiesPr… |
| `IMPORT_CHANGE` | `import net.minecraft.advancements.TagPredicate;` | `import net.minecraft.advancements.predicates.TagPredicate;` | 26.2 advancement package move: net.minecraft.advancements.TagPredicate -> net.minecraft.advancements.predicates.TagPredicate |
| `TEXT_REPLACE` | `net.minecraft.advancements.TagPredicate` | `net.minecraft.advancements.predicates.TagPredicate` | 26.2 fully-qualified advancement package move: net.minecraft.advancements.TagPredicate -> net.minecraft.advancements.predicates.TagPredicate |
| `TEXT_REPLACE` | `SlimePredicate` | `CubeMobPredicate` | 26.2 advancement predicate rename: SlimePredicate -> CubeMobPredicate |

### `26.2` → `26.3`

57 rule(s) (upgrade only).

| Type | Find | Replace with | Why |
|---|---|---|---|
| `TEXT_REPLACE` | `com.mojang.blaze3d.GpuDeviceLossException` | `com.mojang.renderpearl.api.device.GpuDeviceLossException` | 26.3 Renderpearl move: com.mojang.blaze3d.GpuDeviceLossException -> com.mojang.renderpearl.api.device.GpuDeviceLossException. Source: https://github.com/neof… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.GpuFormat` | `com.mojang.renderpearl.api.GpuFormat` | 26.3 Renderpearl move: com.mojang.blaze3d.GpuFormat -> com.mojang.renderpearl.api.GpuFormat. Source: https://github.com/neoforged/.github/blob/main/primers/2… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.GpuOutOfMemoryException` | `com.mojang.renderpearl.api.device.GpuOutOfMemoryException` | 26.3 Renderpearl move: com.mojang.blaze3d.GpuOutOfMemoryException -> com.mojang.renderpearl.api.device.GpuOutOfMemoryException. Source: https://github.com/ne… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.buffers.GpuBuffer` | `com.mojang.renderpearl.api.buffers.GpuBuffer` | 26.3 Renderpearl move: com.mojang.blaze3d.buffers.GpuBuffer -> com.mojang.renderpearl.api.buffers.GpuBuffer. Source: https://github.com/neoforged/.github/blo… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.buffers.GpuBufferSlice` | `com.mojang.renderpearl.api.buffers.GpuBufferSlice` | 26.3 Renderpearl move: com.mojang.blaze3d.buffers.GpuBufferSlice -> com.mojang.renderpearl.api.buffers.GpuBufferSlice. Source: https://github.com/neoforged/.… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.buffers.GpuFence` | `com.mojang.renderpearl.api.commands.GpuFence` | 26.3 Renderpearl move: com.mojang.blaze3d.buffers.GpuFence -> com.mojang.renderpearl.api.commands.GpuFence. Source: https://github.com/neoforged/.github/blob… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.BindGroupLayout` | `com.mojang.renderpearl.api.pipeline.BindGroupLayout` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.BindGroupLayout -> com.mojang.renderpearl.api.pipeline.BindGroupLayout. Source: https://github.com/neoforg… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.BlendEquation` | `com.mojang.renderpearl.api.pipeline.BlendEquation` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.BlendEquation -> com.mojang.renderpearl.api.pipeline.BlendEquation. Source: https://github.com/neoforged/.… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.BlendFactor` | `com.mojang.renderpearl.api.pipeline.BlendFactor` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.BlendFactor -> com.mojang.renderpearl.api.pipeline.BlendFactor. Source: https://github.com/neoforged/.gith… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.BlendFunction` | `com.mojang.renderpearl.api.pipeline.BlendFunction` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.BlendFunction -> com.mojang.renderpearl.api.pipeline.BlendFunction. Source: https://github.com/neoforged/.… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.BlendOp` | `com.mojang.renderpearl.api.pipeline.BlendOp` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.BlendOp -> com.mojang.renderpearl.api.pipeline.BlendOp. Source: https://github.com/neoforged/.github/blob/… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.CompareOp` | `com.mojang.renderpearl.api.pipeline.CompareOp` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.CompareOp -> com.mojang.renderpearl.api.pipeline.CompareOp. Source: https://github.com/neoforged/.github/b… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.CompiledRenderPipeline` | `com.mojang.renderpearl.api.pipeline.CompiledRenderPipeline` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.CompiledRenderPipeline -> com.mojang.renderpearl.api.pipeline.CompiledRenderPipeline. Source: https://gith… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.DepthStencilState` | `com.mojang.renderpearl.api.pipeline.DepthStencilState` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.DepthStencilState -> com.mojang.renderpearl.api.pipeline.DepthStencilState. Source: https://github.com/neo… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.IndexType` | `com.mojang.renderpearl.api.pipeline.IndexType` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.IndexType -> com.mojang.renderpearl.api.pipeline.IndexType. Source: https://github.com/neoforged/.github/b… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.PolygonMode` | `com.mojang.renderpearl.api.pipeline.PolygonMode` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.PolygonMode -> com.mojang.renderpearl.api.pipeline.PolygonMode. Source: https://github.com/neoforged/.gith… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.PrimitiveTopology` | `com.mojang.renderpearl.api.pipeline.PrimitiveTopology` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.PrimitiveTopology -> com.mojang.renderpearl.api.pipeline.PrimitiveTopology. Source: https://github.com/neo… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.RenderPipeline` | `com.mojang.renderpearl.api.pipeline.RenderPipeline` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.RenderPipeline -> com.mojang.renderpearl.api.pipeline.RenderPipeline. Source: https://github.com/neoforged… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.ShaderSource` | `com.mojang.renderpearl.api.pipeline.ShaderSource` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.ShaderSource -> com.mojang.renderpearl.api.pipeline.ShaderSource. Source: https://github.com/neoforged/.gi… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.ShaderType` | `com.mojang.renderpearl.api.pipeline.ShaderType` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.ShaderType -> com.mojang.renderpearl.api.pipeline.ShaderType. Source: https://github.com/neoforged/.github… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.pipeline.UniformType` | `com.mojang.renderpearl.api.pipeline.UniformType` | 26.3 Renderpearl move: com.mojang.blaze3d.pipeline.UniformType -> com.mojang.renderpearl.api.pipeline.UniformType. Source: https://github.com/neoforged/.gith… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.textures.` | `com.mojang.renderpearl.api.textures.` | 26.3 Renderpearl move: com.mojang.blaze3d.textures. -> com.mojang.renderpearl.api.textures.. Source: https://github.com/neoforged/.github/blob/main/primers/2… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.opengl.` | `com.mojang.renderpearl.backend.opengl.` | 26.3 Renderpearl move: com.mojang.blaze3d.opengl. -> com.mojang.renderpearl.backend.opengl.. Source: https://github.com/neoforged/.github/blob/main/primers/2… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.vulkan.` | `com.mojang.renderpearl.backend.vulkan.` | 26.3 Renderpearl move: com.mojang.blaze3d.vulkan. -> com.mojang.renderpearl.backend.vulkan.. Source: https://github.com/neoforged/.github/blob/main/primers/2… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.vertex.VertexFormat` | `com.mojang.renderpearl.api.vertex.VertexFormat` | 26.3 Renderpearl move: com.mojang.blaze3d.vertex.VertexFormat -> com.mojang.renderpearl.api.vertex.VertexFormat. Source: https://github.com/neoforged/.github… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.vertex.VertexFormatElement` | `com.mojang.renderpearl.api.vertex.VertexFormatElement` | 26.3 Renderpearl move: com.mojang.blaze3d.vertex.VertexFormatElement -> com.mojang.renderpearl.api.vertex.VertexFormatElement. Source: https://github.com/neo… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.shaders.GlslCompiler` | `com.mojang.renderpearl.frontend.shaders.GlslCompiler` | 26.3 Renderpearl move: com.mojang.blaze3d.shaders.GlslCompiler -> com.mojang.renderpearl.frontend.shaders.GlslCompiler. Source: https://github.com/neoforged/… |
| `TEXT_REPLACE` | `com.mojang.blaze3d.shaders.ShaderCompileException` | `com.mojang.renderpearl.util.ShaderCompileException` | 26.3 Renderpearl move: com.mojang.blaze3d.shaders.ShaderCompileException -> com.mojang.renderpearl.util.ShaderCompileException. Source: https://github.com/ne… |
| `TEXT_REPLACE` | `ServerboundSwingPacket` | `ServerboundPunchPacket` | 26.3 network packet: ServerboundSwingPacket -> ServerboundPunchPacket. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `handleAnimate` | `handlePunch` | 26.3 server packet handler: handleAnimate -> handlePunch. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `getStructureManager()` | `getStructureTemplateManager()` | 26.3 structure template manager accessor: getStructureManager() -> getStructureTemplateManager(). Source: https://github.com/neoforged/.github/blob/main/prim… |
| `TEXT_REPLACE` | `ExtraCodecs.relaiveNormalizedSubPathCodec` | `ExtraCodecs.relativeNormalizedSubPathCodec` | 26.3 codec spelling: ExtraCodecs.relaiveNormalizedSubPathCodec -> ExtraCodecs.relativeNormalizedSubPathCodec. Source: https://github.com/neoforged/.github/bl… |
| `TEXT_REPLACE` | `ClientboundAnimatePacket.SWING_MAIN_HAND` | `ClientboundSwingAnimationPacket.SWING_MAIN_HAND` | 26.3 swing animation constant owner: ClientboundAnimatePacket.SWING_MAIN_HAND -> ClientboundSwingAnimationPacket.SWING_MAIN_HAND. Source: https://github.com/… |
| `TEXT_REPLACE` | `ClientboundAnimatePacket.SWING_OFF_HAND` | `ClientboundSwingAnimationPacket.SWING_OFF_HAND` | 26.3 swing animation constant owner: ClientboundAnimatePacket.SWING_OFF_HAND -> ClientboundSwingAnimationPacket.SWING_OFF_HAND. Source: https://github.com/ne… |
| `TEXT_REPLACE` | `InteractionResult.SwingSource.CLIENT` | `InteractionResult.SwingSource.PREDICTED` | 26.3 swing source: InteractionResult.SwingSource.CLIENT -> InteractionResult.SwingSource.PREDICTED. Source: https://github.com/neoforged/.github/blob/main/pr… |
| `TEXT_REPLACE` | `InteractionResult.SwingSource.SERVER` | `InteractionResult.SwingSource.SERVER_ONLY` | 26.3 swing source: InteractionResult.SwingSource.SERVER -> InteractionResult.SwingSource.SERVER_ONLY. Source: https://github.com/neoforged/.github/blob/main/… |
| `TEXT_REPLACE` | `LivingEntity.INVULNERABLE_DURATION` | `LivingEntity.DAMAGE_COOLDOWN_DURATION` | 26.3 damage cooldown constant: LivingEntity.INVULNERABLE_DURATION -> LivingEntity.DAMAGE_COOLDOWN_DURATION. Source: https://github.com/neoforged/.github/blob… |
| `TEXT_REPLACE` | `StateHolder.NAME_TAG` | `StateHolder.ID_TAG` | 26.3 state holder serialized id tag: StateHolder.NAME_TAG -> StateHolder.ID_TAG. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `PushReaction.NORMAL` | `PushReaction.PUSH_PULL` | 26.3 push reaction: PushReaction.NORMAL -> PushReaction.PUSH_PULL. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `PushReaction.DESTROY` | `PushReaction.POPPED` | 26.3 push reaction: PushReaction.DESTROY -> PushReaction.POPPED. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `PushReaction.BLOCK` | `PushReaction.IMMOVEABLE` | 26.3 push reaction: PushReaction.BLOCK -> PushReaction.IMMOVEABLE. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `PushReaction.IGNORE` | `PushReaction.IGNORE_ENTITY` | 26.3 push reaction: PushReaction.IGNORE -> PushReaction.IGNORE_ENTITY. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `PushReaction.PUSH_ONLY` | `PushReaction.PUSH` | 26.3 push reaction: PushReaction.PUSH_ONLY -> PushReaction.PUSH. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `Registries.CONFIGURED_FEATURE` | `Registries.FEATURE` | 26.3 feature datapack registry: Registries.CONFIGURED_FEATURE -> Registries.FEATURE. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/inde… |
| `TEXT_REPLACE` | `Registries.CONFIGURED_CARVER` | `Registries.CARVER` | 26.3 carver datapack registry: Registries.CONFIGURED_CARVER -> Registries.CARVER. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `commandsAllowedForOtherPlayers()` | `getGuestCommandAccess()` | 26.3 integrated-server guest command accessor: commandsAllowedForOtherPlayers() -> getGuestCommandAccess(). Source: https://github.com/neoforged/.github/blob… |
| `TEXT_REPLACE` | `setCommandsAllowedForOtherPlayers(` | `setGuestCommandAccess(` | 26.3 integrated-server guest command setter: setCommandsAllowedForOtherPlayers( -> setGuestCommandAccess(. Source: https://github.com/neoforged/.github/blob/… |
| `TEXT_REPLACE` | `setcubeMobHealth(` | `setCubeMobHealth(` | 26.3 cube mob health spelling: setcubeMobHealth( -> setCubeMobHealth(. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `isDealsDamage(` | `canDealDamage(` | 26.3 cube mob damage query: isDealsDamage( -> canDealDamage(. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `ModConfig.Type.COMMON` | `ModConfig.Type.LOCAL` | 26.3 NeoForge local config type: ModConfig.Type.COMMON -> ModConfig.Type.LOCAL. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `ModConfig.Type.SERVER` | `ModConfig.Type.SYNCED` | 26.3 NeoForge synced config type: ModConfig.Type.SERVER -> ModConfig.Type.SYNCED. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `IMPORT_CHANGE` | `import net.minecraft.core.Direction8;` | `import net.minecraft.core.CompositeDirection.Direction8;` | 26.3 Direction8 moved under CompositeDirection. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `net.minecraft.core.Direction8` | `net.minecraft.core.CompositeDirection.Direction8` | 26.3 fully-qualified Direction8 move. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `IMPORT_CHANGE` | `import net.minecraft.server.commands.ItemCommands;` | `import net.minecraft.server.commands.item.ItemCommands;` | 26.3 ItemCommands moved into server.commands.item. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `net.minecraft.server.commands.ItemCommands` | `net.minecraft.server.commands.item.ItemCommands` | 26.3 fully-qualified ItemCommands move. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `IMPORT_CHANGE` | `import net.minecraft.util.AbortableIterationConsumer.Continuation;` | `import net.minecraft.util.Continuation;` | 26.3 Continuation moved out of AbortableIterationConsumer. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
| `TEXT_REPLACE` | `AbortableIterationConsumer.Continuation` | `Continuation` | 26.3 Continuation moved out of AbortableIterationConsumer. Source: https://github.com/neoforged/.github/blob/main/primers/26.3/index.md |
