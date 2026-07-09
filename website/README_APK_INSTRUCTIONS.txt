================================================================================
HOW TO DEPLOY TO NETLIFY AND ENABLE INSTANT APK DOWNLOADS
================================================================================

1. PUT YOUR ANDROID APK FILE HERE:
   When you build your APK (using `eas build -p android --profile preview` or `npx expo run:android --variant release`), rename or save the output APK file directly inside this `website` folder as:
   -> nikki-app.apk

   (Note: Must be exactly named `nikki-app.apk` in this folder alongside `index.html` so the download links work automatically!)

2. HOW TO DEPLOY TO NETLIFY IN 30 SECONDS:
   Method A: Drag and Drop (Easiest & Fastest!)
   1. Log in to your Netlify account at https://app.netlify.com
   2. Go to the "Sites" tab and look for the "Deploy manually" box (or drag-and-drop area).
   3. Drag the entire `website` folder from your computer and drop it directly onto Netlify.
   4. Netlify will upload all files (`index.html`, `style.css`, `script.js`, `_headers`, `netlify.toml`, and your `nikki-app.apk`).
   5. Your site is live immediately! You can rename the site URL in Netlify Site Settings (e.g., `https://obsessed-ai.netlify.app`).

   Method B: Netlify CLI
   1. Open a terminal inside this `website` folder.
   2. Run: npx netlify-cli deploy --prod
   3. Follow the quick login prompt and your site will be published live.

3. HOW THE DESKTOP vs. MOBILE DOWNLOAD INTERCEPTION WORKS:
   - When a user visits your Netlify URL on a Desktop/Laptop PC and clicks "Download APK", our smart interception modal pops up showing a dynamic QR Code that scans directly to your Netlify URL so they can open it instantly on their phone!
   - When visited on an Android smartphone or tablet, tapping the Download APK button instantly downloads `nikki-app.apk` directly to their mobile device!
