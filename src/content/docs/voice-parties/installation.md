---
title: Installation
description: Install Voice Parties on a Fabric or NeoForge client. No server installation is needed.
---

:::caution[Not public yet]
Release jars are not public yet. When `0.1.0` is out it will be on the GitHub Releases page and Modrinth. Until then,
testers get builds through the [Discord](https://discord.gg/vV2USr9phF).
:::

## Requirements

| | Fabric | NeoForge |
|---|---|---|
| Minecraft | `1.21.11` | `1.21.11` |
| Loader | Fabric Loader `0.19.5+` | NeoForge `21.11.48+` |
| Also needed | [Fabric API](https://modrinth.com/mod/fabric-api) `0.141.6+1.21.11` | — |
| Optional | [Mod Menu](https://modrinth.com/mod/modmenu) (adds a Config button) | — |
| Java | 21 | 21 |
| Jar | `voiceparties-fabric-0.1.0.jar` | `voiceparties-neoforge-0.1.0.jar` |

Voice runs on **64-bit Windows, macOS (Intel and Apple Silicon) and Linux (x86_64 and aarch64)**.

## Client install (1 minute)

1. Install the loader for Minecraft 1.21.11 (Fabric or NeoForge).
2. Put the jar for your loader in your `.minecraft/mods` folder. On Fabric, add **Fabric API** too.
3. Start the game. The title screen shows a small **Voice Parties** button.
4. Your Minecraft account connects by itself within a few seconds — the Account tab shows your name and head with
   **"Verified Minecraft account"**.
5. Press **P** in a world (change it in *Options → Controls*) and add a friend, start a chat or create a party.

:::note
There is no echo cancellation yet, so **use headphones** in voice.
:::

## Server install

**There isn't one.** Voice Parties is a client-only mod (`"environment": "client"` on Fabric, `side = "CLIENT"` on
NeoForge). Server owners install nothing; it works on vanilla, modded and plugin servers, in singleplayer and even on
the title screen.

If a server has its own `/p` command, turn off **Settings → Chat → Short /p command** — `/partychat` always keeps
working. See [Commands & Keybinds](/voice-parties/commands-keybinds/).

## Building from source

```bash
# Fabric jar -> build/libs/
./gradlew build

# NeoForge jar -> neoforge/build/libs/
./gradlew -p neoforge build
```

On Windows use `gradlew.bat`. Loom needs a recent JDK to run Gradle (**25** at the time of writing); the mod itself
targets **Java 21**.

### Running your own backend

`supabase/` is the whole backend:

1. Create a Supabase project.
2. Apply `supabase/migrations/` in order.
3. Deploy the `voice` and `minecraft` edge functions (voice needs your own Cloudflare Realtime app ID and secret).
4. Point the mod at your project in `src/main/resources/voiceparties-backend.properties`.

## Updating and uninstalling

- **Update:** replace the jar in `mods/`. Your session and settings in `config/voiceparties/` are kept.
- **Uninstall:** remove the jar. To also remove local data, delete `config/voiceparties/`. To delete your account on
  the backend, ask on the [Discord](https://discord.gg/vV2USr9phF) (see [Privacy](/voice-parties/privacy/)).
