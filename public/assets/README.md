# Portal Plan Icons

Place the following image files in this directory for the captive portal login page:

## Required Images

| Filename | Used For | Source |
|----------|----------|--------|
| `1hour.png` | 1 Hour plan (Ksh 10) | Clock icon showing "1 HOUR" |
| `calendar.png` | 1 Day plan (Ksh 50) | Calendar icon showing "1 DAY" |
| `days.png` | 3 Days plan (Ksh 150) | Calendar icon showing "3 DAYS" |
| `week.png` | 7 Days plan (Ksh 300) | Calendar icon showing "1 WEEK" |
| `30-days.png` | 1 Month plan (Ksh 1000) | Calendar icon showing "30 DAYS" |

These images are referenced in [src/views/PortalLoginView.vue](../../src/views/PortalLoginView.vue) and displayed on the package selection cards.

## Image Specifications

- Format: PNG (or compatible image format)
- Recommended size: 40x40 pixels (will be scaled by CSS)
- All images are displayed at 40x40 with `object-fit: contain`

## Copy Command

Once you have the images, you can copy them to this directory:

```bash
# Example (from project root):
cp path/to/images/*.png public/assets/
```
