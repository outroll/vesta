# Upgrade Notes

This document contains important information for upgrading Vesta Control Panel and notes about breaking changes.

## React UI Modernization

The React UI has been upgraded from React 16 to React 18 and includes several major dependency updates.

### Breaking Changes

#### React 18
- `ReactDOM.render()` replaced with `createRoot()` (already updated in code)
- Automatic batching is now enabled by default
- Concurrent features available (optional to use)

#### React Router 6
The project now uses React Router 6, which has breaking changes from v5:

**Route Definition Changes:**
```javascript
// OLD (v5)
<Switch>
  <Route path="/users" component={Users} />
  <Route path="/user/:id" component={User} />
</Switch>

// NEW (v6)
<Routes>
  <Route path="/users" element={<Users />} />
  <Route path="/user/:id" element={<User />} />
</Routes>
```

**useHistory → useNavigate:**
```javascript
// OLD (v5)
import { useHistory } from 'react-router-dom';
const history = useHistory();
history.push('/home');

// NEW (v6)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/home');
```

**Nested Routes:**
```javascript
// OLD (v5)
<Route path="/users">
  <Users />
</Route>

// NEW (v6)
<Route path="/users/*" element={<Users />} />
// Inside Users component, use relative routes
```

#### Bootstrap 5
Bootstrap has been updated from 4.3 to 5.3.3:

**Major Changes:**
- jQuery is no longer required by Bootstrap
- Popper.js v2 is used instead of Popper.js v1
- Many class names have changed (e.g., `ml-` → `ms-`, `mr-` → `me-`)
- Form controls have new markup
- `.form-group` class removed
- Data attributes now use `data-bs-*` instead of `data-*`

**Migration Guide:** https://getbootstrap.com/docs/5.3/migration/

#### Redux
Updated to Redux 5.x and React-Redux 9.x:

- Redux Toolkit is recommended for new code
- Legacy createStore is deprecated (use configureStore from @reduxjs/toolkit)
- No major breaking changes for most use cases

#### node-sass → sass
The deprecated `node-sass` has been replaced with `sass` (Dart Sass):

- SASS syntax is fully compatible
- Better performance
- More actively maintained
- No changes needed to `.scss` files

### Security Updates

#### Axios
Updated from 0.21.4 to 1.7.9, fixing:
- CVE-2020-28168: SSRF vulnerability
- CVE-2021-3749: Regular expression denial of service
- Multiple other security issues

**API Changes:**
Most code should work without changes, but verify:
```javascript
// Ensure error handling includes response data
axios.get('/api/endpoint')
  .catch(error => {
    if (error.response) {
      // Server responded with error
      console.log(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.log(error.request);
    }
  });
```

#### jQuery
Updated to 3.7.1 for security patches. No breaking changes expected.

### Installation After Update

1. **Delete old node_modules and package-lock.json:**
   ```bash
   cd src/react
   rm -rf node_modules package-lock.json
   ```

2. **Install fresh dependencies:**
   ```bash
   npm install
   ```

3. **Test the build:**
   ```bash
   npm run build
   ```

4. **Run development server:**
   ```bash
   npm start
   ```

### Known Issues

#### React Router Migration
If you see errors about `Switch` or `component` prop not working:
- Replace `<Switch>` with `<Routes>`
- Replace `component={Component}` with `element={<Component />}`
- Replace `useHistory()` with `useNavigate()`

#### Bootstrap Class Names
If styling looks broken:
- Update spacing classes (`ml-*` → `ms-*`, `mr-*` → `me-*`, `pl-*` → `ps-*`, `pr-*` → `pe-*`)
- Update data attributes (`data-toggle` → `data-bs-toggle`)
- Review form markup

#### Build Warnings
Some warnings during build are expected during migration:
- Deprecated lifecycle methods (if any)
- Console warnings about React Router patterns

### Testing Checklist

After upgrading, test the following:

- [ ] Login functionality
- [ ] Dashboard loads correctly
- [ ] User management
- [ ] Domain management
- [ ] Database management
- [ ] DNS management
- [ ] Mail management
- [ ] File manager
- [ ] Settings/configuration pages
- [ ] API functionality
- [ ] Mobile responsiveness

### Rollback Plan

If issues occur:

1. **Revert package.json:**
   ```bash
   git checkout HEAD^ src/react/package.json
   ```

2. **Restore old dependencies:**
   ```bash
   cd src/react
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

## Server-Side Updates

### PHP Requirements
- Minimum PHP 7.4 recommended
- PHP 8.x supported

### System Requirements
- Node.js 18+ for development
- Bash 4.0+
- Modern Linux distribution (see README.md)

## Migration from Older Versions

### From 0.9.x to 1.0.x

1. **Backup everything:**
   ```bash
   v-backup-users
   ```

2. **Review customizations:**
   - Custom templates
   - Modified configuration files
   - Custom scripts

3. **Update system:**
   ```bash
   v-update-sys-vesta
   ```

4. **Test thoroughly:**
   - Create test domains
   - Test email functionality
   - Verify backups work

### Database Migrations
Database schema updates are handled automatically by the update script.

## Getting Help

If you encounter issues:

1. Check [GitHub Issues](https://github.com/outroll/vesta/issues)
2. Search the [Forum](https://forum.vestacp.com/)
3. Join [Gitter Chat](https://gitter.im/vesta-cp/Lobby)
4. Review logs in `/usr/local/vesta/log/`

## Contributing

Found a bug in the upgrade process? Please report it on GitHub Issues with:
- Your OS version
- VestaCP version you're upgrading from/to
- Error messages
- Steps to reproduce

---

Last Updated: 2025-01-07
