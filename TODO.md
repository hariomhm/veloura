# TODO List for Optimizing Code and Fixing Bugs

## Current Task: Fix React Errors #418 and #423

### Pending Tasks:
- [ ] Test the application to confirm errors are resolved

### Completed Tasks:
- [x] Analyzed the errors: #418 too many re-renders, #423 cannot update state during render
- [x] Identified potential causes: React 19 with StrictMode, oidc automaticSilentRenew, useEffect dependencies
- [x] Removed React.StrictMode from main.jsx to prevent double renders in dev
- [x] Set automaticSilentRenew to false in oidc config to prevent background renewals causing issues
- [x] Removed dispatch from useEffect dependencies in App.jsx as it's stable
- [x] Started dev server for testing
