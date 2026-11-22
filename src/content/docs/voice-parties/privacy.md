---
title: Privacy
description: What Voice Parties sends off your computer, where it is kept, and how to delete it.
---

Plain description of what Voice Parties sends off your computer and where it is kept.

## Where data goes

Voice Parties has one online backend, a [Supabase](https://supabase.com) project run by the mod's author. The mod
talks to it over HTTPS. Party voice is relayed by [Cloudflare Realtime](https://developers.cloudflare.com/realtime/).
There are no other servers, no analytics and no advertising.

## What is stored on the backend

| What | Why | Who can see it |
|---|---|---|
| Your Minecraft account (UUID and name, checked with Mojang), and any others you synced to it | Your account is your Minecraft account; others see your real name and skin | People you share a party, chat, invite or friendship with |
| Your friends, friend requests and block list | The Friends tab | You; each friend sees that you are friends |
| Private nicknames you give people | Shown only to you | Only you |
| Parties, party invites and party chat messages | Party features | Members of that party |
| Direct messages and group messages | Chat | Members of that conversation |
| Images you attach | Chat | Members of that conversation |
| Who is in voice right now, and how long you have used voice today and this month | The voice limits and queue | Only the backend. Your party sees who is in voice |
| "Online", server label and location | Shown to your party | Your party, **only if you turn each one on** in Settings → Privacy. All three are off by default |

Party chat messages are deleted after 7 days, and direct and group messages after 30 days. Images are kept until
the conversation or account is deleted. Messages are not end-to-end encrypted: the backend operator is technically
able to read them.

## What is not stored

- **Voice audio.** Your voice is sent, encrypted in transit, to Cloudflare, which passes it on live to the party
  members in voice with you. It is not recorded or stored by Voice Parties. Cloudflare sees your IP address, as any
  service you connect to does.
- **Server addresses.** The address of the server you play on is not sent, unless you choose to send a server
  invite, which puts that address in the message.
- **Your Minecraft or Microsoft login.** Connecting uses Mojang's normal session check: the game tells Mojang it is
  joining a one-time code, and the backend asks Mojang who did. Your game login token only ever goes to Mojang.
- **An email or password.** There are none.

## Things worth knowing

- **Server invites.** Opening an invite asks that server for its icon and player count, which shows the server your
  IP address, exactly like looking at it in the multiplayer list. This only happens after you open the invite,
  unless you turned on automatic previews in Settings → Privacy.
- **Skins.** Player heads are fetched from Mojang's servers the same way the game does.
- **On your computer.** Your session is saved under `config/voiceparties/account/`, one per Minecraft account. Settings are in
  `config/voiceparties/client.properties`. Images you save go to `screenshots/voiceparties/`.
- **Word filter.** Messages containing slurs or explicit sexual terms are refused by the backend. Ordinary
  swearing is allowed.

## Deleting your data

Ask on the [Discord](https://discord.gg/vV2USr9phF) to have your account deleted. Deleting an account removes its
profile, Minecraft accounts, friends, blocks and nicknames. Messages you sent stay in the conversations they
were sent to, shown without your name, until they are deleted as above.
