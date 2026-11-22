---
title: Configuration
description: Every Voice Parties setting — in-game Settings tabs and the config/voiceparties/client.properties file.
---

Voice Parties is configured in-game from **Voice Parties → Settings** (or Mod Menu's *Config* button on Fabric).
Settings are saved locally to:

```text
.minecraft/config/voiceparties/client.properties
```

The file never contains account data, tokens or message content. It is written atomically, so a crash never leaves a
half-written file; invalid values fall back to defaults.

## Settings tabs

### General

| Setting | Options | Default |
|---|---|---|
| Open Voice Parties key / Change keys | Opens *Controls* | **P** |
| Button on title & pause menus | On / Off | On |
| Time format | 24-hour / 12-hour | 24-hour |
| Message previews | On / Off | On |
| Look | Default (grey), Dark (black), Light (white) | Default |
| Selection colour | Green, Blue, Red, Purple, Orange, Pink | Green |

### Chat

| Setting | Options | Default |
|---|---|---|
| Short /p command | On / Off (`/partychat` always works) | On |
| Toggle party chat key | Opens *Controls* | unbound |
| Party messages in Minecraft chat | On / Off | On |
| Highlight @mentions | On / Off | On |
| Show images automatically | On / Off (off: images wait for a click) | On |
| Image size in chat | Small / Medium / Large | Medium |
| Word filter | Information only — enforced by the backend | — |

### Notifications

| Setting | Options | Default |
|---|---|---|
| Direct messages | Every message / Only @mentions / Nothing | Every message |
| Group messages | Every message / Only @mentions / Nothing | Every message |
| Party chat | Every message / Only @mentions / Nothing | Every message |
| Ping sound for @mentions | On / Off | On |
| Per-chat overrides | Set per chat with `/mute`, `/mentions`, `/unmute`; "Reset all" clears them | — |

### Voice

| Section | Setting | Options | Default |
|---|---|---|---|
| Devices | Microphone / Speakers / headphones | Any device, or *System default* | System default |
| Talking | Talk mode | Voice activity / Push to talk | Voice activity |
| Talking | Push-to-talk key | Opens *Controls* | unbound |
| Talking | Mic sensitivity | 0–100 (0 sends everything) | 30 |
| Talking | Noise suppression | On / Off | On |
| Talking | Automatic mic volume | On / Off | On |
| Sound | Voice volume | 0–200 % | 100 % |
| Sound | One player's volume | 0–200 % per player (from their profile) | 100 % |
| Joining and keys | Join voice muted | On / Off | On |
| Joining and keys | Mute microphone key | Opens *Controls* | unbound |
| Overlay | Show who's talking in-game | On / Off | On |
| Overlay | Overlay position | Top left / Top right / Bottom left / Bottom right | Top left |
| Overlay | Heads only | On / Off | Off |
| — | Mic test | Start / Stop — hear yourself; the bar turns green when your party would hear you | — |

### Privacy

| Setting | Options | Default |
|---|---|---|
| Who can message me | Everyone / Group members / Nobody | — |
| Who can invite me to groups | Everyone / Group members / Nobody | — |
| Show when I'm online (party sharing) | On / Off | **Off** |
| Show which server I'm on (party sharing) | On / Off | **Off** |
| Show my location (party sharing) | On / Off | **Off** |
| Preview server invites automatically | On / Off | **Off** |
| Blocked players | List with *Unblock* | — |

### Account and About

- **Account:** connection status and *Open Account* — shows your verified Minecraft account(s); *Get a code* / *Sync* links another Minecraft account.
- **About:** version, *Updates & support* (Discord) and *Credits*.

## `client.properties` keys

You normally don't need to edit this file — use the in-game screen. For reference, these are the keys the mod reads:

| Key | Type | Default | Meaning |
|---|---|---|---|
| `voice_hud` | bool | `true` | Show who's talking in-game |
| `hud_corner` | 0–3 | `0` | Overlay corner: 0 top left, 1 top right, 2 bottom left, 3 bottom right |
| `hud_compact` | bool | `false` | Overlay shows heads only |
| `menu_buttons` | bool | `true` | Button on title & pause menus |
| `clock_24h` | bool | `true` | 24-hour clock |
| `message_previews` | bool | `true` | Message previews |
| `party_chat_in_game` | bool | `true` | Party lines in normal Minecraft chat |
| `short_party_command` | bool | `true` | Register `/p` |
| `auto_images` | bool | `true` | Load chat images automatically |
| `image_size` | 0–2 | `1` | Small / Medium / Large |
| `mentions` | bool | `true` | Highlight @mentions |
| `mention_sound` | bool | `true` | Ping sound for @mentions |
| `dm_level`, `group_level`, `party_level` | 0–2 | `0` | 0 every message, 1 only @mentions, 2 nothing |
| `chat_levels` | `id=level;…` | empty | Per-chat notification overrides |
| `mic_device`, `speaker_device` | string | empty | Device name; empty follows the system default |
| `voice_volume` | 0–200 | `100` | Other players' volume (%) |
| `volume.<account-uuid>` | 0–200 | — | One player's volume |
| `auto_gain` | bool | `true` | Automatic mic volume |
| `join_muted` | bool | `true` | Join voice muted |
| `push_to_talk` | bool | `false` | Push to talk instead of voice activity |
| `sensitivity` | 0–100 | `30` | Voice-activity threshold |
| `noise_suppression` | bool | `true` | Noise suppression |
| `theme` | 0–2 | `0` | Default / Dark / Light |
| `accent` | 0–5 | `0` | Green / Blue / Red / Purple / Orange / Pink |
| `server_previews` | bool | `false` | Preview server invites automatically |
| `welcomed` | bool | `false` | First-run welcome card was shown |

Older `notify_direct`, `notify_groups` and `notify_invites` on/off keys are still read and converted.

:::note
Party-sharing toggles (online / server / location) and the DM/invite policies are stored on your **account**, not in
this file, so they follow you across devices.
:::

## Other local files

| Path | Contents |
|---|---|
| `config/voiceparties/account/<minecraft-uuid>/` | Saved session, one per Minecraft account |
| `screenshots/voiceparties/` | Images you save from chats |
