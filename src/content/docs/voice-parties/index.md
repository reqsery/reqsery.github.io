---
title: Voice Parties — Overview
description: Voice Parties is a client-side Minecraft mod for party voice, party chat, DMs and friends that follow you across servers. Pre-release / WIP.
sidebar:
  label: Overview
---

:::caution[Pre-release — work in progress]
Voice Parties is heading for its first public release, **`0.1.0`**. **Builds are not public yet.** Join the
[Discord](https://discord.gg/vV2USr9phF) to follow progress and get into testing. Everything on these pages describes
the `0.1.0` release candidate and may change before release.
:::

Party voice, party chat, DMs and friends for Minecraft that **follow you to every server**.
Voice Parties is **client-side**: no server mod, no plugin, nothing for the server owner to install.

- **Author:** reqsery
- **Loaders:** Fabric and NeoForge (one jar per loader)
- **Minecraft:** `1.21.11` (Java 21)
- **License:** All Rights Reserved — you may use it and include it in modpacks that download it from the official page, but you may not re-upload it or publish modified versions.

## What it does

- **Party voice anywhere.** Talk to your party on any server, in singleplayer or on the title screen. Your party
  doesn't have to be on the same server. Only your party hears you, and you always join muted (by default).
- **Parties.** Create one, invite people by Minecraft name, kick, leave, transfer ownership, see who's online.
- **Party chat** in the menu, or straight from normal chat with `/p hello`. `/p on` sends everything you type to your party.
- **DMs and group chats** (up to 32 people) with anyone who uses Voice Parties, on any server, delivered live.
- **Friends** by Minecraft name, with requests you accept or decline.
- **Images** (PNG or JPEG, compressed to 1 MB) and **@mentions** with a popup while you type.
- **Server invites:** send the server you're on; your friend sees its icon, description and player count and joins with one click.
- **Several Minecraft accounts?** Sync them on the Account tab with a short code and they share one set of chats and friends.
- **Per-chat notifications, blocking, private nicknames**, three looks (Default, Dark, Light) and a selection colour.
- **Cross-loader:** Fabric and NeoForge players share the same accounts and can party together.

## Why not a regular voice chat mod?

Regular voice chat mods talk **through the Minecraft server**, so the server has to install them and you can only
talk to people on that server. Voice Parties goes through **its own backend** instead, so it works on servers that have
never heard of it, and your party stays together when you switch servers.

## How it works

| Part | What it uses |
|---|---|
| Accounts | Your **Minecraft account is your Voice Parties account.** It connects automatically using Mojang's normal session check — the same one servers use. No sign-up, email or password. |
| Chat, parties, friends | A [Supabase](https://supabase.com) backend over HTTPS (database, realtime delivery, edge functions). |
| Voice | Audio relayed live by [Cloudflare Realtime](https://developers.cloudflare.com/realtime/), never recorded. The WebRTC voice engine ([webrtc-java](https://github.com/devopvoid/webrtc-java)) is bundled for 64-bit Windows, macOS and Linux — which is why the jar is about 45 MB. |

Voice is free and shared, so it has **fair-use limits**: a daily amount for everyone, a daily and monthly amount per
player, and a queue when it's busy. The mod tells you when voice is full.

## Known limits in 0.1.0

- **No echo cancellation yet** — use headphones in voice.
- Only Minecraft **1.21.11** is supported. More versions are planned after `0.1.0` (ports will be made with
  [MC Mod Porter](/mc-mod-porter/)).
- Party chat is deleted after **7 days**; DMs and group messages after **30 days**.
- Messages are **not end-to-end encrypted**.

See [FAQ & Known Limits](/voice-parties/faq/) for more.

## Next steps

- [Installation](/voice-parties/installation/)
- [Commands & Keybinds](/voice-parties/commands-keybinds/)
- [Configuration](/voice-parties/configuration/)
- [Privacy](/voice-parties/privacy/)
