# React UI and API Fixes

This document describes the fixes made to the React frontend and API service layer.

## Authentication Token Fixes

The React app communicates with the PHP backend via API calls. Each call requires a CSRF token for authentication. Several service files were missing these tokens, causing API calls to fail.

### Files Fixed

| File | Functions Fixed |
|------|-----------------|
| `ControlPanelService/Package.js` | `addPackage()`, `updatePackage()` |
| `ControlPanelService/RRD.js` | `getRrdList()` |
| `ControlPanelService/Statistics.js` | `getStatisticsList()` |
| `ControlPanelService/Logs.js` | `getLogsList()` |
| `ControlPanelService/WebLogs.js` | `getWebLogs()` |
| `ControlPanelService/Favorites.js` | `addFavorite()`, `deleteFavorite()` |
| `ControlPanelService/UserNS.js` | `getUserNS()` |
| `ControlPanelService/Backup.js` | `getBackupList()`, `scheduleBackup()`, `getBackupDetails()`, `restoreBackupSetting()`, `getBackupExclusions()`, `getBackupExclusionsInfo()` |

### Fix Pattern

Before:
```javascript
export const getBackupList = () => {
  return axios.get(BASE_URL + webApiUri);
}
```

After:
```javascript
export const getBackupList = () => {
  return axios.get(BASE_URL + webApiUri, {
    params: {
      token: getAuthToken()
    }
  });
}
```

## External Link Fixes

React Router's `<Link>` component is for internal navigation only. Using it for external URLs (phpMyAdmin, webmail) caused incorrect URL concatenation.

### Problem

```jsx
// This creates: /list/db/https://server:8084/
<Link to={{ pathname: 'https://server:8084/' }}>phpMyAdmin</Link>
```

### Solution

```jsx
// This creates correct external link
<a href="https://server:8084/" target="_blank" rel="noopener noreferrer">
  phpMyAdmin
</a>
```

### Files Fixed

| File | Link Fixed |
|------|------------|
| `containers/Databases/Databases.jsx` | phpMyAdmin, phpPgAdmin links |
| `containers/Mails/Mails.jsx` | Webmail link |

## Modal Accessibility Fix

The modal component had a fixed `aria-hidden="true"` attribute, which caused accessibility issues when the modal was visible with focusable elements.

### File

`components/ControlPanel/Modal/Modal.jsx`

### Fix

Before:
```jsx
<div className={`modal fade ${show ? 'show' : ''}`}
     aria-hidden="true">
```

After:
```jsx
<div className={`modal fade ${show ? 'show' : ''}`}
     aria-hidden={!show}>
```

Also fixed `tabindex` to `tabIndex` (React camelCase).

## Build and Deploy

After making changes to React files:

```bash
cd src/react
npm run build

# Copy to web directory
cp -r build/static/js/* ../../web/static/js/
cp -r build/static/css/* ../../web/static/css/
cp build/index.html ../../web/static/index.html
```

## Testing

All fixes were tested on an Ubuntu 22.04 VM:

- ✅ Package add/edit works
- ✅ Statistics and graphs load
- ✅ Web logs viewer works
- ✅ Backup list and scheduling works
- ✅ phpMyAdmin link opens correctly
- ✅ Webmail link opens correctly
- ✅ Modal accessibility warning resolved
