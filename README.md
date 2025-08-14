# syo-ryo-uma

A joke CLI tool featuring cucumber and eggplant ASCII art running across your terminal.

## Installation

```bash
npm install -g syo-ryo-uma
```

## Usage

```bash
# Run both animations sequentially (default)
syo-ryo-uma

# Run cucumber animation only
syo-ryo-uma cucumber

# Run eggplant animation only
syo-ryo-uma eggplant

# Display static art (no animation, stays in console)
syo-ryo-uma --stay
syo-ryo-uma --stay cucumber
syo-ryo-uma --stay eggplant

# Run animations in reverse (left to right)
syo-ryo-uma --reverse              # Both animations moving left to right
syo-ryo-uma --reverse cucumber     # Cucumber moving left to right
syo-ryo-uma --reverse 10           # Both animations reversed at fast speed

# Run with custom speed (lower is faster, default: 30)
syo-ryo-uma 10              # Both animations at fast speed
syo-ryo-uma cucumber 20     # Cucumber animation at custom speed
syo-ryo-uma eggplant 10     # Eggplant animation at fast speed
```

## Features

- **Alternate screen buffer** - Animations don't pollute your terminal history
- **Sequential animations** - Default mode shows cucumber followed by eggplant
- **Reverse mode** - Animations can go from left to right
- **Stay mode** - Display ASCII art statically without animation
- **Zero dependencies** - Pure Node.js implementation

## What it does

Displays ASCII art of a cucumber and/or eggplant that runs across your terminal from right to left. That's it. That's the joke.

Press `Ctrl+C` to stop the animation.

## License

MIT