# Paul Graham Essay Tracker

A simple Chrome extension that adds a checkbox and a star next to each essay on [paulgraham.com/articles.html](https://paulgraham.com/articles.html), so you can mark what you've read and favorite what is worth rereading.

Your read and favorite selections are saved with `chrome.storage.local`, so they persist after refreshes and browser restarts.

Favorited essays are shown with a filled star (`★`) and highlighted text.

## Install

1. Open `chrome://extensions`
2. Turn on Developer mode
3. Click `Load unpacked`
4. Select this project folder

## Files

- `manifest.json` - Chrome extension config
- `content.js` - injects checkboxes and saves read state
- `favorites.js` - injects stars, highlights favorites, and saves favorite state


Happy readingss
