# syo-ryo-uma (精霊馬)

A joke CLI tool featuring cucumber and eggplant ASCII art running across your terminal.

![Demo](demo.gif)

## Cultural Background

**Shōryō-uma (精霊馬)** are traditional Japanese offerings made during Obon (お盆), a Buddhist festival honoring ancestors' spirits. During this summer festival, families create small "spirit horses" using:

- 🥒 **Cucumber horse (kyūri no uma)** - A cucumber with wooden chopstick legs, representing a swift horse for ancestors' spirits to quickly return home
- 🍆 **Eggplant cow (nasu no ushi)** - An eggplant with chopstick legs, representing a slow cow for spirits to leisurely return to the afterlife, carrying offerings

This playful CLI tool brings these traditional spirit animals to life in your terminal!

## Quick Start (No Installation Required!)

Run instantly with npx:

```bash
# Run the animation without installing
npx syo-ryo-uma

# Try different modes
npx syo-ryo-uma cucumber      # Just the cucumber horse
npx syo-ryo-uma eggplant      # Just the eggplant cow
npx syo-ryo-uma --reverse     # Spirits returning home
npx syo-ryo-uma 10            # Turbo mode!
```

## Installation (Optional)

If you want to install it globally:

```bash
npm install -g syo-ryo-uma
```

## Usage

```bash
# Run both animations sequentially (default)
syo-ryo-uma

# Run individual animations
syo-ryo-uma cucumber        # Cucumber horse only
syo-ryo-uma eggplant        # Eggplant cow only

# Animation options
syo-ryo-uma --reverse       # Animate from left to right (spirits coming home)
syo-ryo-uma --endless       # Loop animations endlessly (Ctrl+C to stop)
syo-ryo-uma --stay          # Display static art without animation
syo-ryo-uma 10              # Set speed (lower = faster, default: 30)

# Combinations
syo-ryo-uma --reverse cucumber 10   # Fast cucumber returning home
syo-ryo-uma --endless eggplant      # Endless eggplant loop
syo-ryo-uma --endless --reverse     # Endless reverse animation
syo-ryo-uma --stay cucumber          # Static cucumber display
```

## Features

- 🎭 **Alternate screen buffer** - Keeps your terminal history clean
- 🏃 **Running animation** - Watch them gallop across your screen
- 🔄 **Reverse mode** - Spirits can travel in both directions
- ♾️ **Endless mode** - Loop animations continuously
- 📍 **Stay mode** - Display static art for contemplation
- 📦 **Zero dependencies** - Pure Node.js implementation
- ⚡ **No installation needed** - Run instantly with npx

## Credits

- **Original Illustration**: [さくっと素材 - 精霊馬のイラスト](https://sakutto-sozai.com/2740/) - The ASCII art is based on this wonderful Shōryō-uma illustration
- **ASCII Art Conversion**: Created using [ASCII Art Generator](https://www.asciiart.eu/image-to-ascii)

## License

MIT
