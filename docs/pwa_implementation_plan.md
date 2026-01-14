# PWA & Offline Support Implementation Plan

This plan outlines the steps to transform TurboNotes into a Progressive Web App (PWA) with offline capabilities using `@serwist/next` and `serwist`.

## User Review Required
> [!IMPORTANT]
> **Offline Data Sync Strategy**: This plan enables **caching of static assets and READ access** to previously visited notes while offline.
> **Write operations** (creating/editing notes) while offline will **FAIL** unless we implement a complex local-first sync queue (e.g., storing mutations in IndexedDB and replaying them when online).
>
> **Proposed Scope**:
> 1.  **Installable PWA**: Add manifest, icons, and service worker.
> 2.  **Offline Reads**: Cache JS/CSS and visited API responses (stale-while-revalidate).
> 3.  **Offline UI**: Show a custom "You are offline" warning if trying to save.
>
> If full *offline editing* is required, we would need a significant architectural change (e.g., replacing simple React Query mutations with a sync engine like PouchDB or RxDB, or building a custom optimistic mutation queue). **For now, we assume "Offline Support" means "the app loads and shows data while offline".**

## Proposed Changes

### 1. Packages & Configuration
Install `@serwist/next` and `serwist` to handle service worker generation.

#### [NEW] Dependencies
- `@serwist/next`
- `serwist`

#### [MODIFY] [next.config.ts](file:///Users/emmanueljimenez/Documents/Work/turbonotes/frontend/next.config.ts)
- Wrap configuration with `withSerwist` to generate the service worker on build.

### 2. Manifest & Metadata
Create the standard Web App Manifest to allow installation on home screens.

#### [NEW] [files]
- `frontend/app/manifest.ts`: Generates `manifest.json` dynamically (name, icons, theme color).
- `frontend/public/icons/`: (User needs to provide icons, or we generate simple placeholders).

### 3. Service Worker Logic
Define the caching strategy. We will use a "Stale While Revalidate" strategy for API calls and "Cache First" for static assets.

#### [NEW] [frontend/app/sw.ts](file:///Users/emmanueljimenez/Documents/Work/turbonotes/frontend/app/sw.ts)
- Define `defaultCache` + custom runtime caching for `/api/notes/`.

### 4. UI Indicators
Update the UI to reflect offline status.

#### [MODIFY] [NoteEditor](file:///Users/emmanueljimenez/Documents/Work/turbonotes/frontend/components/note-editor.tsx)
- Add a `useOnlineStatus` hook.
- Disable "Save" (or show warning) when offline.

## Verification Plan

### Automated Tests
- `npm run build`: Ensure Service Worker is generated (`public/sw.js`).

### Manual Verification
1.  **Lighthouse Audit**: Run PWA check in Chrome DevTools.
2.  **Offline Mode**:
    - Load app, browse notes.
    - Turn off WiFi/Network in DevTools.
    - Refresh page -> App should load (200 OK via Service Worker).
    - Navigate to a visited note -> Should load.
    - Try to save -> Should show "Offline" message.
