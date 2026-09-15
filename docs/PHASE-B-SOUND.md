# Authored sound handoff

No sound assets or playback engine were present. No synthetic tones or placeholder recordings were added. The application emits `epoch:feedback` browser events through `src/uiFeedback.js`; `event.detail.type` identifies the cue. A future mixer should respect mute, resume AudioContext only after a user gesture, and give the final action cue priority over the initiating tap.

| Event / category | Desired asset | Direction |
| --- | --- | --- |
| `tap` | ui-tap.ogg | Quiet, dry wood or leather, under 100ms |
| `primary` | ui-primary.ogg | Slightly firmer button action, under 160ms |
| `success`, `equip` | ui-success.ogg | Subtle fitted metal/leather click, under 250ms |
| `invalid` | ui-unavailable.ogg | Soft low wooden tick, under 180ms |
| `currency`, `reward` | reward-gain.ogg | Small restrained coin cluster, under 450ms |
| `unlock` | unlock.ogg | Warm short ceremonial accent, under 700ms |
| `level-up` | promotion.ogg | Restrained rising brass accent, under 600ms |
| `achievement` | achievement.ogg | Brief medal/coin accent, under 650ms |
| `battle-start`, `battle-ability` | command.ogg | Soft drum or command accent, under 250ms |
| `victory` | victory.ogg | Short dignified resolution, under 1.2s |
| `defeat` | defeat.ogg | Low restrained resolution, under 900ms |

All files are missing and require authored/licensed assets. Do not play every overlapping event: throttle taps, combine currency gains, and prioritize unlock/achievement/victory. No new visual art is required for this pass; existing content marked as pending remains pending.
