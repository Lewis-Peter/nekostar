---
title: "One More P-Core Than Retail: The ThinkPad T14s Gen 6 I Found on Xianyu"
date: 2026-08-28
tags: ["thinkpad", "amd", "linux", "secondhand"]
summary: "I paid ¥3,560 on Xianyu for a ThinkPad T14s Gen 6 whose CPU turned out to be an engineering sample. I counted the cores: 4 big + 4 small — one more P-core than the retail Ryzen AI 7 PRO 360. Here is the hardware evidence, my speculation, and whether the thing is actually usable."
cover: "/images/t14s-eng-sample/cover.png"
draft: false
apiNote: false
---

![AMD Eng Sample: 100-000001335-10_Y (4+4) @ 5.00 GHz — retail is 3 big + 5 small; this one is 4 + 4](/images/t14s-eng-sample/cover.png)

## 1. How it started: a patient shopper, defeated

I wanted to play games.

That modest requirement got me thoroughly beaten up in 2026. RAM prices have gone somewhere past unhinged, and they dragged the entire PC market into the madness with them.

It is not that I have no computers. I have a MacBook, and Apple silicon really is fast — no argument there. But in practice it perfectly reproduces the old joke about the guy whose uncle plays games on a MacBook. New titles are fine. Older ones have compatibility problems bad enough to make you climb the walls.

The trouble is that my setup had already gone all-in on ARM: the MacBook is ARM, and my Windows machine is a WoA box (Windows on ARM, 8cx Gen 3). Adding a third ARM device would have broken me.

So: x86, then.

And then came the classic ending for anyone who waits for a better deal — the longer you wait, the worse it gets. I had my eye on a Core Ultra 7 228V (Lunar Lake) laptop. It jumped ¥2,000, landing close to ¥6,000. For a machine released *last year*. I had no words.

Fine, handhelds. Also up.

All right. If even the cheapest halfway-decent option, a ROG Ally Z1E, costs ¥3,000, why not just buy a small laptop and use it as a game console?

So I went to Xianyu — China's largest secondhand marketplace, the "seafood market" as everyone calls it — and ran into this rather strange ThinkPad.

I told myself it was for the TrackPoint, for the faith. Faith, sure. Faith does not exist; this was my first TrackPoint machine, and what I actually wanted was something with a bit of resistance under the finger.

The listing was more detailed than I expected:

> ThinkPad T14s Gen 6, 2025 model
> **The processor named AMD Eng Sample 10000001335 is actually an AMD Ryzen™ AI 7 PRO 360. Engineering unit.**
> Performance is very good, strong integrated graphics, available with 32 GB and 64 GB of RAM.

**¥3,560, no SSD included. Sold.**

I went in knowing it was an engineering unit — that is exactly where the price comes from. Remember that sentence of his, though: he did not merely say it was an engineering sample, he specifically mapped that Eng Sample number to a concrete retail model.

Nothing he wrote was wrong. But it was nowhere near the whole story.

![The Xianyu listing: the seller states that "the processor named AMD Eng Sample 10000001335 is actually an AMD Ryzen AI 7 PRO 360, engineering unit"](/images/t14s-eng-sample/xianyu-listing.jpg)

## 2. Arrival: inspect first, install later

![The ThinkPad T14s I picked up on Xianyu for ¥3,560 — TrackPoint still in place](/images/t14s-eng-sample/thinkpad-t14s.jpg)

The machine came without storage, so I added a Samsung 990 EVO Plus 2 TB, wiped it, and installed Arch.

I bought that SSD new for under ¥800 at the time. Today the price is close to triple that.

A consumer SSD I picked up on a whim two years ago has, on paper, outperformed almost every investment product I know of. There is a Chinese saying about memory chips — "hesitate and it's gone" — that I used to read as a joke. I get it now. In a sense, the part on this laptop that has held its value best is not the rare engineering-sample CPU. It is the drive I casually slotted in.

The inspection results first, all of them genuine:

- ThinkPad T14s Gen 6, MTM `21M1FVT002`
- 32 GB LPDDR5-7500 soldered (4 × 8 GiB Micron, running at the full 7500 MT/s)
- 14-inch BOE `MNE007JA1-2` panel
- Qualcomm FastConnect 7800, Wi-Fi 7
- Battery 5B11H56406, 58 Wh design capacity

One complaint in passing: it is 2026 and this machine still ships a 1920×1200, 60 Hz screen. And it is not a case of "there was a high-res option and I skipped it" — check [Lenovo's official spec sheet](https://psref.lenovo.com/Product/ThinkPad/ThinkPad_T14s_Gen_6_AMD) and **the AMD version of the T14s Gen 6 has no high-resolution option at all**. Both panel choices are 1920×1200. Coming back from a Retina display, my eyes filed a complaint for the first two days.

The one consolation is the gamut: of those two options, one is full sRGB and the other is a low-gamut touch panel, and I drew the good one (102% sRGB, by my own math from the values the panel reports). Nobody on Xianyu writes "mine happens to be the good panel" in a listing. That was pure luck.

But two other things actually caught my attention. They point at the same conclusion: this machine was never sold to an individual.

### Surprise one: it has a smart card reader

There is something on the chassis I did not expect: a smart card reader, working, card goes in and it reads.

On ThinkPads this is an optional extra, and the people who pay for it are overwhelmingly enterprise and government buyers: badge access, identity verification, banking logins. Very few individuals tick that box — though retail configurations can include it too, so on its own this is only a weak signal.

And I have no use for it. I have never once used it. Its value here is not whether it works; it is the hint it drops about how this machine was specced at the factory.

### Surprise two: 99% battery health

Design capacity 58 Wh, measured 57.47 Wh remaining. **99% health.**

For a used laptop, the most likely explanations for that number are: the seller replaced the battery, or the machine was barely used between leaving the factory and reaching me. (Battery-gauge estimates carry their own error, so this is a strong hint, not proof.)

An enterprise-oriented optional card reader, plus a battery with almost no cycles on it. Individually neither means much. Together they start to be interesting.

As you will see, they point to the same answer as the CPU does.

## 3. After the install, I thought I had been scammed

The line `AMD Eng Sample: 100-000001335-10_Y` in `lscpu` was not a shock — the seller said it was an engineering unit, and that is precisely the price I came for.

What actually short-circuited my brain was fastfetch.

I ran it right after installing, and the CPU row said: **4 P-cores + 4 E-cores.**

![fastfetch output: the CPU line reads AMD Eng Sample: 100-000001335-10_Y (4+4) @ 5.00 GHz](/images/t14s-eng-sample/fastfetch-4plus4.png)

I stared at it for a couple of seconds.

**Hold on. That's wrong.**

The Ryzen AI 7 PRO 360 is 3 big + 5 small.

That split is awkward enough to sound made up, but it is the official spec. I had checked before buying and remembered it clearly.

When the specs do not match, the first word that comes to mind is **fraud**.

Then I flipped the machine over and looked at the bottom cover.

**ThinkPad T14s Gen 5**

![The rear label says "ThinkPad T14s Gen 5" in plain print — while the firmware insists it is a Gen 6](/images/t14s-eng-sample/rear-gen5.jpg)

Great.

Gen 5 is the previous generation, and its AMD version used Phoenix — the 7840U / 8840U family. My brain immediately jumped to the worst case: the seller had sold me a last-gen machine with a 7840U dressed up as an AI 7 PRO 360.

And I had already confirmed receipt.

---

The first thing I did after calming down was ask the firmware who it thought it was:

```bash
$ cat /sys/devices/virtual/dmi/id/{product_name,product_version,board_name}
21M1FVT002
ThinkPad T14s Gen 6
21M1FVT002
```

Firmware says Gen 6. The bottom cover says Gen 5.

And the `21M1` MTM prefix belongs to the T14s Gen 6 AMD version, as does the board model. In other words the machine itself is a Gen 6; only that bottom cover is a Gen 5 part.

So what is going on with the cover?

The answer is mundane: **Lenovo cut a corner.**

The Gen 5 and Gen 6 bottom covers use the same tooling. Flip one over and you will find several different model numbers printed on the inside. One shell serves several generations, and whichever number is silkscreened outside is the one you get. Not a swapped case, not mixed parts — just a factory common part.

False alarm. But also a lesson: trust the firmware over the sticker. The files under `/sys/devices/virtual/dmi/id/` are far more reliable than anything printed on the chassis.

That ruled out half of the worst case: the board really is a Gen 6.

But the CPU? What was the 4+4 about?

What exactly had my ¥3,560 bought?

## 4. So what chip is it, really

So I set out to identify the CPU. Not out of curiosity — I wanted to know what those ¥3,560 had bought.

Engineering samples do not report a model name, but hardware identity is etched into the silicon, and silicon does not lie.

### Ruling out the worst case first

`lscpu` gives two numbers: `CPU family: 26` and `Model: 36`.

Family 26 is AMD's **Zen 5**.

Half a sigh of relief. The 7840U I was afraid of is previous-generation Zen 4, family 25. This is 26, so it cannot be a 7840U.

But that is as far as it gets me. Zen 5 mobile comes in several tiers, and 4+4 still does not match the AI 7 PRO 360's 3+5.

Which raised a second suspicion: could this be a lower-tier part passed off as a 360?

AMD has two very similar chips in this generation: the higher-tier **Strix Point** (which the AI 7 PRO 360 belongs to) and the lower-tier **Krackan Point**. The two share the same family/model numbers, so CPUID alone cannot tell them apart.

### But the GPU's "ID number" can

The GPU inside the chip carries a hardcoded device ID. It cannot be changed, and nobody would bother. Mine reads `1002:150E`.

Cross-reference Linux's built-in device name database:

```
1114  Krackan  [Radeon 840M / 860M]
150e  Strix    [Radeon 880M / 890M]     ← mine is this one
```

The lower-tier Krackan is `1114`. Mine is **`150E`** — Strix Point, the higher tier.

The impersonation theory collapsed too.

### Then count the GPU's compute units

There is one more confirmation available. You can count the GPU's actual size directly; the kernel interface states it plainly:

- The chip **physically has 16 compute units**
- **12 are actually enabled**

Sixteen is the full Strix Point configuration, corresponding to the Radeon 890M. The 12 that are enabled correspond to the Radeon 880M — exactly the official GPU configuration of the AI 7 PRO 360.

One easily confused point while we are here: that device-name table says `Radeon 880M / 890M` because it is a family-level entry — both models share one ID. What actually separates them is the CU count: 16 is the 890M, 12 is the 880M. So mine is an 880M, not an 890M.

And the lower-tier Krackan die physically has only 8 CUs. There is no way to reach 12 from there.

This also explains something that had been bugging me: why does every piece of software report the GPU model as that engineering-sample CPU string?

Because AMD's driver database has no entry for it. That table is indexed by device ID plus revision, and my revision is `C2`. The table has C1, C4, C5, C6 — **it skips C2 specifically.** No such person; so the driver falls back to the name the chip reports for itself.

This GPU's revision was never written into the retail database, because it was never a retail product.

The internal codename of the chip's AI unit also comes back as the higher-tier Strix Point. Third piece of evidence, same conclusion.

### Conclusion: the seller did not know what he was selling either

Three mutually independent pieces of hardware evidence — the GPU's PCI ID, the GPU's physical CU count, and the NPU's codename — all point to Strix Point.

So: is there a retail model in the Strix Point family that is exactly "8 cores + 12 CUs"?

There is. And it is the one the seller wrote in the listing: **Ryzen AI 7 PRO 360.**

Architecture, total core count, both cache levels, GPU size, AI unit, maximum boost clock — all match, item by item.

So the truth is less exotic than I briefly feared. The retail model the seller named is broadly right. The T14s Gen 6 genuinely ships in a Ryzen AI 7 PRO 360 configuration, and the architecture, GPU, cache, and NPU all line up.

The only unusual thing is the chip itself: it is a pre-production engineering sample sent to Lenovo for platform validation, not a retail part off the line.

And that is probably as far as the seller's knowledge went. He knew it was an engineering unit; he even looked up which retail model that Eng Sample number corresponded to, and wrote it into the listing honestly. All of that is correct, and more diligent than most sellers manage.

But he almost certainly never counted how many P-cores were inside.

Honestly, if that 4+4 line had not startled me, I would not have counted either.

![SoC topology: 4 P-cores + 4 E-cores, two non-shared 8 MB caches, 12 GPU compute units (16 physical, 4 disabled), 50 TOPS NPU](/images/t14s-eng-sample/soc-topology.png)

## 5. The one item that does not match

In that list of "matches item by item," I deliberately left one item out: how those 8 cores are split.

Zen 5 mobile chips are hybrid: Zen 5 P-cores clock higher, while Zen 5c E-cores are optimized for efficiency and area with a substantially lower ceiling. On this machine the measured split is a tidy 4 + 4:

```
cpu0-3, cpu8-11   →  4996 MHz   ← 4 × Zen 5 P-cores
cpu4-7, cpu12-15  →  3314 MHz   ← 4 × Zen 5c E-cores
```

The retail Ryzen AI 7 PRO 360 is 3 P-cores + 5 E-cores.

**One more P-core, one fewer E-core.**

This is not a guess. [AMD's official spec page](https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-300-series/amd-ryzen-ai-7-pro-360.html) states `3x Zen 5, 5x Zen 5c` under "Processor Architecture" in black and white.

How odd was that split at the time? [topcpu's headline](https://www.topcpu.net/en/news/first-look-at-ryzen-ai-7-pro-360-a-bizarre-mix-of-3-zen5-5-zen5c) literally called it "A Bizarre Mix of 3 Zen5 + 5 Zen5c," and [Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/ryzen-ai-7-pro-360-exposed-in-new-benchmark) wrote it up as well.

The peak clocks differ by nearly 50% (4996 vs. 3314 MHz). Clock speed is not performance, and the real gap depends on workload type, power budget, and scheduling. But for single-threaded work and for everyday loads that cannot saturate 8 cores — which is most games and most desktop software — having one more core that can run at high clocks is a concrete advantage.

I also looked at the cache topology while I was there: the 4 P-cores share one 8 MB L3, the 4 E-cores share another 8 MB, 16 MB total, matching the retail spec. So relative to the 360's stated numbers, nothing was cut at this level — though a full Strix Point P-core CCX has 16 MB, so this 8 MB is itself a trimmed-down configuration.

**¥3,560 for a CPU with one more P-core than the shipping version.** However you run the numbers, that is not a loss.

So why did AMD settle on such an awkward 3+5 split? That question and "why did this machine end up on a secondhand marketplace" turn out to be the same question.

### My speculation: a "stronger 360" that never shipped

Everything above is fact, produced by commands. **From here on this is personal speculation** — I have no channel to verify any of it, so take it as entertainment.

Put the three chips side by side and it gets clearer:

|  | P-cores | E-cores |
| --- | --- | --- |
| The tier above: AI 9 365 | **4** | 6 |
| Mine | **4** | 4 |
| The shipping AI 7 PRO 360 | **3** | 5 |

Look at the middle row against the top one: identical P-core count, identical GPU. The only difference is E-cores.

And in the scenarios people actually spend their time in, the P-core count is what decides things. Which means that if this 4+4 part had shipped as an AI 7, it would have gone toe-to-toe with a noticeably more expensive tier in the most common workloads.

That is textbook cannibalization.

Seen the other way, 3+5 is safe: only 3 P-cores, clearly weaker than the tier above, product lines cleanly separated. So I lean toward reading that awkward 3+5 as segmentation rather than a yield compromise. This chip had to be weak in exactly the right way.

So what is the one in my hands? Three possibilities. The most boring — and the one that deserves to go first — is that validation samples have core configurations chosen to serve validation, where fusing off a few cores is often an offhand decision that need not correspond to any product plan that ever existed. The other two make better stories: either it was an early configuration of the 360, changed to 3+5 shortly before launch to protect the tier above; or it was a separately developed model that got cancelled, stuck in the middle, awkward to sell against both neighbors, and quietly dropped.

Either way, several signs suggest it was not far from production: a 4996 MHz boost is essentially the retail 5.0 GHz spec, whereas very early samples usually fall well short; the instruction set is complete; and it was already installed in a complete laptop running a production BIOS that still takes updates. These are all circumstantial, and from the outside I cannot tell which validation stage it belongs to.

As for how it ended up sitting on a secondhand marketplace waiting for me — that is another question I do not have an answer to.

There is one detail in the listing worth noting, though: "available with 32 GB and 64 GB." The seller had more than one, sorted by configuration. That is not "someone selling the laptop they used." That is a batch of identical validation machines entering the secondhand market at once.

Add the enterprise-option card reader and the battery with almost no cycles, and it is clear this machine did not leave the factory intended for an individual who wanted to play games.

## 6. So is it actually usable

This is what someone who spent the money actually cares about. Engineering samples have a bad reputation for two reasons: possible unfixed hardware bugs, and cut-down functionality.

To be clear up front: I have only had it two weeks, which is not enough to declare any hardware "stable." But I ran a fairly unkind set of tests in those two weeks, and the conclusion is that within what I measured, nothing distinguishes it from retail except the core split.

Clocks reach spec, holding a steady 4.94 GHz under full load. Nothing is missing functionally either — I deliberately tried a handful of obscure instructions that even retail owners rarely touch, and they are all present, so this is not a feature-crippled half-product. The NPU is fine as well; I have been running local LLM inference on it, and long sessions have not caused problems.

As for games — that is why I bought it.

The ROG Ally Z1E I was originally going to buy has 12 RDNA 3 compute units. Mine has the same 12, but on the half-generation-newer RDNA 3.5. Price: ¥3,560 vs. ¥3,000, and mine came without storage, so with the 2 TB SSD my total goes higher still. In exchange I get an entire 14-inch laptop with 32 GB of RAM.

In practice: very good. The fan is definitely louder than a MacBook's, no point pretending otherwise; but it is far quieter than a gaming laptop, not the kind that takes off the moment a game launches.

And the thing that mattered most is solved: **old games run.** The "my uncle plays games on a MacBook" problem from the opening simply does not exist once you are back on x86.

For concrete numbers, I tried Kerbal Space Program. It is famously CPU-bound because it simulates physics part by part, and the bigger the rocket the harder it works.

![A large KSP craft in orbit at a steady 60 FPS (86 average). Note the overlay: CPU usage is only 14%, GPU clock 862 MHz — nowhere near the 2700 MHz ceiling](/images/t14s-eng-sample/ksp-mangohud.jpg)

Orbital flight was already this easy, so I built an 87-part rocket and launched it, watching the system readouts throughout:

|  | Measured | Ceiling |
| --- | --- | --- |
| Physics keeping up? | **1.000** (fully) | 1.0 |
| SoC power | 14 W | 28 W |
| Temperature | 62 °C | 100 °C |
| P-core clock | 2,729 MHz | 4,996 MHz |
| Total across 16 threads | 192% | 1600% |

The first row is the key one. KSP's physics simulation has a particular property: if the CPU cannot keep up, it does not drop frames, it slows down in-game time instead. That ratio held at 1.000 the entire way, never once dipping, meaning this machine handled the rocket's physics without breaking a sweat.

(That row reflects physics only, not render frame rate. The rendering numbers are in the screenshot above: a steady 60 FPS, 86 average.)

The remaining rows all say the same thing: half the power budget used, 38 degrees of thermal headroom left, P-cores not even reaching 55% of their clock ceiling. Of the sixteen threads, not one exceeded 60% utilization.

In plain terms, this machine has plenty in reserve for games like this.

I did find its temperament, though. Running a mobile game in an Android container, I hit a stutter, and the cause was interesting: the game's main thread drifted back and forth across all 16 cores, periodically landing on one of the 4 E-cores, so every frame came up just short. One command to pin it to the P-cores took the frame rate from 30 straight to 60.

Which nicely confirms the earlier "one more P-core" finding: in single-thread-bound scenarios, P-core count and clock are everything. No amount of E-cores helps — you may even need to keep threads out of them.

## 7. The costs

A bargain is never free.

**No warranty.** An impossible CPU in a machine of murky provenance means no support of any kind. I do not count this as being cheated — the seller said "no warranty" from the start, and that was the premise on which I accepted the price. The deeper issue is that engineering samples nominally remain AMD property, are conventionally issued only to OEMs and partners for validation, and were never meant to enter retail channels at all. So it is not a question of "slightly worse warranty" — there is no legitimate recourse channel whatsoever. That, too, is part of where the price comes from.

**Performance is locked by a power limit.** Under full load the power draw is pinned at 22 W, while the temperature is only 86 °C and the fan is nowhere near maxed out. The firmware is holding it down deliberately, and no software approach can lift it. I did later find that the lock can be opened: a higher-wattage charger raised the performance ceiling by 27%, no disassembly and no BIOS modification required. That deserves its own post; noting it here for now.

**It has a temper.** I tried forcing a power-limit change under full load and the machine locked up on the spot. Later, a low-level hardware probe wiped my boot entries entirely — F12 was completely empty, as if no OS had ever been installed. I recovered it by repairing the boot partition, without losing a byte of data. Lesson: do not poke at low-level interfaces on this machine while it is under heavy load, and shut down properly rather than holding the power button.

## 8. Was ¥3,560 worth it

In a word: **absolutely.**

And that verdict is not sentiment, it is what the market makes it look like. Go back to the opening: the 228V laptop rose ¥2,000 to nearly ¥6,000, handhelds rose with it, and the cheapest ROG Ally Z1E is ¥3,000. Meanwhile, at the listing prices I see as I write this, ¥3,560 will not buy you a decent beaten-up 228V on the secondhand market. (These prices move fast; the number may well be different by the time you read this.) **In a market where everything is going up, the only place still behaving reasonably turns out to be the secondhand market.** That is absurd on its face, but it is what 2026 looks like.

If you are considering this route: worth it, but only if you can inspect a machine yourself.

## 9. Appendix: six commands to run the day a used laptop arrives

Whether or not you bought an engineering unit, run these the day the machine shows up:

```bash
# 1. What name does the CPU report? "Eng Sample" essentially confirms an engineering sample
#    (the converse does not hold: its absence does not guarantee a retail part)
lscpu | grep -E 'Model name|Stepping'

# 2. Core makeup — how many big and small cores (for AMD/Intel hybrids; group by peak clock)
for i in $(seq 0 $(($(nproc)-1))); do
  echo -n "cpu$i: "; cat /sys/devices/system/cpu/cpu$i/cpufreq/cpuinfo_max_freq
done

# 3. Battery health — a reference figure; below 80% is worth weighing against the listing and price
upower -i $(upower -e | grep BAT) | grep -E 'energy-full|capacity'

# 4. Drive power-on hours and bytes written — note this describes *this drive*, and drives get swapped
sudo smartctl -a /dev/nvme0n1 | grep -Ei 'power_on|data_units_written'

# 5. Cache topology — which L3 each core cluster shares, and whether capacity matches spec
lscpu -C | grep L3
cat /sys/devices/system/cpu/cpu0/cache/index3/shared_cpu_list

# 6. Panel model and color parameters — listings never mention these, but the panel reports them
edid-decode /sys/class/drm/card*-eDP-*/edid | grep -iE 'Manufacturer|Model|Red|Green|Blue'
```

Number 4 deserves emphasis. The most common lie on a secondhand marketplace is "personal use, barely touched," and SMART data does not lie: power-on hours and cumulative writes are right there. A machine advertised as "only three months old" with four thousand power-on hours and 80 TB written has obviously been worked hard. This check beats any visual inspection — with the single caveat that it only proves the history of *that drive*, and drives can be replaced, so read it alongside chassis condition and battery cycles.

(Mine came without a drive, so this one did no good for me. But precisely because there was no drive, I lost one line of evidence about how long it had been used, which is what made that 99% battery the strongest signal I had.)

One more note on number 6: EDID gives you three chromaticity coordinates, not a directly readable "percentage." You have to compare the area of the triangle they form against the sRGB reference triangle to get a coverage figure. If that sounds tedious, the easier route is to read the panel model number and look up its published specifications.

---

One last aside.

When I bought it, my goal was extremely plain: find an x86 machine that runs old games, and stop suffering inside an all-ARM setup.

Two weeks later, a strange theme has emerged on this laptop: **I bought it to play games, and it has been playing games for me instead.**

An idle script is already farming Arknights automatically. More absurdly, on Linux you can even have an AI fly your spacecraft in Kerbal Space Program.

I will save that rabbit hole for the next post.

---

If you have seen an `Eng Sample` machine on a secondhand marketplace, or you happen to own a genuine AI 7 PRO 360 and can compare numbers with me, the comments are open.

---

*All hardware figures in this article were measured on Linux and the commands are reproducible. Retail specifications used for comparison come from AMD's official pages and published media testing.*
