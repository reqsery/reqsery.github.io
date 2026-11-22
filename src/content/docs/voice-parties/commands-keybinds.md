---
title: Commands & Keybinds
description: Voice Parties client commands (/p, /partychat), in-chat composer commands and key bindings.
---

All Voice Parties commands are **client-side commands**: they never reach the Minecraft server, so the server cannot
read them and they work everywhere.

## Keybinds

Change these in **Options → Controls** under the **Voice Parties** category (or *Settings → General → Change keys*).

| Key binding | Default | What it does |
|---|---|---|
| Open Voice Parties | **P** | Opens the Voice Parties menu (Messages, Friends, Party, Invites, Settings) |
| Open Party Chat | *unbound* | Opens the party chat screen directly |
| Toggle party chat mode | *unbound* | Switches the normal chat box into party-only mode (same as `/p toggle`) |
| Mute Microphone (party voice) | *unbound* | Mutes/unmutes your mic in party voice without opening the menu |
| Push to talk (party voice) | *unbound* | Hold to talk when **Talk mode** is *Push to talk* |

:::caution
If you switch **Talk mode** to *Push to talk* but never bind the key, nobody will hear you. The Voice settings page
warns: "No key yet. Pick one in Controls".
:::

## Party chat commands

`/partychat` always exists. `/p` is a short alias that can be turned off in **Settings → Chat → Short /p command** for
servers that have their own `/p` (a client command hides the server's). The setting is read when you join a world.

| Command | What it does |
|---|---|
| `/p <message>` | Send one message to your party |
| `/p on` | Party-only chat: everything you type in normal chat goes to your party (not to the server) |
| `/p off` | Back to normal chat |
| `/p toggle` | Switch party-only chat on or off |
| `/p` or `/p help` | Show the list of party chat commands and whether party-only mode is on |

While party-only mode is on, a green tag is shown above the chat box. Other commands (anything starting with `/`)
still go to the game as normal. Party chat needs you to be connected and in a party; otherwise the mod tells you why.

If the backend is busy, messages are held and retried in order without duplicates. Sending too fast is rate limited.

## In-chat composer commands

Inside a Voice Parties chat (DM, group or party), typing `/` opens a command popup; `@` opens a mention popup. Use
**Up/Down** to move, **Tab** or **Enter** to pick, **Esc** to hide.

| Command | What it does |
|---|---|
| `/server` | Invite the chat to the server you're on (sends a card with the address) |
| `/mute` | Mute this chat |
| `/mentions` | Only notify me for @mentions in this chat |
| `/unmute` | Notify me of every message in this chat |
| `@name` | Mention a player — highlighted for them, with a ping sound |
| `@everyone` | Notify everyone in the group |

## Other shortcuts

- **Enter** sends a message.
- **Page Up / Page Down** scroll the conversation.
- **Esc** closes a menu or goes back to the chat.
- Drag a PNG/JPEG onto the game window to attach it to the open chat.
- Clicking `[Open]` on a Voice Parties line in normal Minecraft chat opens that conversation.
