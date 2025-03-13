# JJJ Combat Simulator Card Assets

This folder contains the card images for the JJJ Combat Simulator.

## Card Format

Cards should be in PNG format with dimensions of 1094x1485 pixels.

## Naming Convention

Cards must follow this naming convention:

```
Card Name_<Attack Value>_<Defense Value>.png
```

For example:
- `Gorilla Warrior_3_8.png` - A card named "Gorilla Warrior" with Attack 3 and Defense 8
- `Thunder Bull_7_2.png` - A card named "Thunder Bull" with Attack 7 and Defense 2

## Adding New Cards

1. Create your card image with dimensions 1094x1485 pixels
2. Name it according to the convention above
3. Place it in this folder
4. The application will automatically detect and load the card

## Notes

- Attack and Defense values should be integers between 1 and 10
- The card name can contain spaces, but should not contain underscores
- The application will display the cards at 50% of their original size 