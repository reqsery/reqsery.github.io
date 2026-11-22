---
title: FAQ & Known Limits
description: Frequently asked questions about Voice Parties, plus the limits and unfinished (WIP) parts of the 0.1.0 pre-release.
sidebar:
  label: FAQ & Known Limits
---

## General

### Where can I download it?

Nowhere yet — Voice Parties is **pre-release**. `0.1.0` will be published on GitHub Releases and Modrinth as
`voiceparties-fabric-0.1.0.jar` and `voiceparties-neoforge-0.1.0.jar`. Join the
[Discord](https://discord.gg/vV2USr9phF) to get into testing.

### Does the server need to install anything?

No. It is a **client-only** mod. It works on any server, in singleplayer and on the title screen.

### Do my friends need to be on the same server?

No. Parties, chats and voice go through the Voice Parties backend, not the Minecraft server, so your party can be
spread across different servers or singleplayer worlds.

### Can Fabric and NeoForge players party together?

Yes. Both loaders share the same accounts and backend.

### Do I need to make an account?

No. Your Minecraft account **is** your account. It connects automatically with Mojang's normal session check. There is
no sign-up, email or password, and your Minecraft/Microsoft login token only ever goes to Mojang.

### I have several Minecraft accounts. Can they share chats?

Yes. On the Account tab press **Get a code** on one account, then on the other enter the code and press **Sync**. Both
accounts then share one set of chats and friends. A wrong or old code gives a clear error.

### Which Minecraft versions are supported?

Only **1.21.11** (Fabric Loader 0.19.5+ with Fabric API 0.141.6+, or NeoForge 21.11.48+), on Java 21. More versions
are planned after `0.1.0`.

### A server already has a `/p` command. What do I do?

Turn off **Settings → Chat → Short /p command** and use `/partychat` instead. The setting applies when you join a world.

## Voice

### I hear an echo / my friends hear themselves.

There is **no echo cancellation yet**. Use headphones.

### Nobody can hear me.

- You **join muted** by default — press *Unmute Mic* in the voice panel, or turn off *Join voice muted*.
- With **Push to talk**, you must bind a push-to-talk key in *Controls*.
- Check **Mic sensitivity** — at high values, quiet speech is cut. Use **Settings → Voice → Start test**: the bar turns
  green when your party would hear you.
- Pick the right microphone under **Settings → Voice → Devices**.

### Why was I disconnected from voice?

- If you are **alone in voice**, you are disconnected after about **3 minutes**, with a message saying why.
- Leaving the party ends your voice session.
- Voice is free and shared, so there are **fair-use limits** (a daily amount for everyone, a daily and monthly amount per
  player) and a **queue** when it's busy. The mod tells you when voice is full.

### Is my voice recorded?

No. Audio is relayed live by Cloudflare Realtime, encrypted in transit, and never recorded or stored. See
[Privacy](/voice-parties/privacy/).

### Can a player outside my party hear us?

No. Only party members who have joined voice can hear it.

## Chat

### What are the message limits?

- Sending messages very fast is rate limited (after about 8 quick messages you are told to slow down; it recovers in a few seconds).
- Images: **PNG or JPEG only**, compressed to **1 MB**; about **3 images per minute** (a 4th within a minute is refused).
- Group chats hold up to **32 people**.
- A word filter refuses slurs and explicit sexual terms. Ordinary swearing is allowed.

### How long are messages kept?

Party chat for **7 days**; DMs and group messages for **30 days**. Images stay until the conversation or account is
deleted. Messages are **not end-to-end encrypted**.

### How do I block someone?

Open their profile (click their name or head) and block them. They can no longer message you, the friendship is
removed, and they are not told. Unblock from **Settings → Privacy → Blocked players**.

## Known limits & work in progress

:::caution[These are not implemented yet in 0.1.0]
- **No public release** — builds are tester-only until `0.1.0` ships.
- **No echo cancellation** in voice.
- **Only Minecraft 1.21.11.** Other versions are planned after `0.1.0`.
- **No end-to-end encryption** for messages; the backend operator can technically read them.
- **No in-game account deletion.** Ask on the [Discord](https://discord.gg/vV2USr9phF) to have your account deleted.
- **No server-side component** — this is by design, not missing: there is no server plugin and none is planned.
:::

Other things to know:

- Voice uses a shared, free relay, so availability is subject to the fair-use limits and queue above.
- Local session files under `config/voiceparties/account/` are saved with restricted permissions but are not encrypted at rest.

## Reporting a bug

Report it on the [Discord](https://discord.gg/vV2USr9phF) and attach your `logs/latest.log`. Note what you clicked,
what you expected and what you saw. Red error lines mentioning `voiceparties` in the log are especially useful.
