# Rollback Instructions

## Current Version: Background Color #92B53D (Green)
## Previous Version: Background Color #1E3F46 (Teal)

### Quick Rollback Command

If the new green background (#92B53D) doesn't work well, run this to restore the previous teal background (#1E3F46):

```bash
# Find and replace in all files at once
cd /path/to/your/app/store

# Rollback background colors
sed -i 's/from-\[#92B53D\] via-\[#7a9832\] to-\[#627a28\]/from-[#1E3F46] via-[#163238] to-[#0e2529]/g' src/components/Prog.tsx
sed -i 's/from-\[#92B53D\] via-\[#7a9832\] to-\[#627a28\]/from-[#1E3F46] via-[#163238] to-[#0e2529]/g' src/pages/dashboard.tsx
sed -i 's/from-\[#92B53D\] via-\[#7a9832\] to-\[#627a28\]/from-[#1E3F46] via-[#163238] to-[#0e2529]/g' src/pages/purchases.tsx
sed -i 's/from-\[#92B53D\] via-\[#7a9832\] to-\[#627a28\]/from-[#1E3F46] via-[#163238] to-[#0e2529]/g' src/pages/TransactionHistory.tsx
sed -i 's/from-\[#92B53D\] via-\[#7a9832\] to-\[#627a28\]/from-[#1E3F46] via-[#163238] to-[#0e2529]/g' src/pages/ChangePassword.tsx

# Rebuild and restart
npm run build
pm2 restart all
```

### Or Manual Rollback

Replace this:
```
bg-gradient-to-r from-[#92B53D] via-[#7a9832] to-[#627a28]
```

With this:
```
bg-gradient-to-r from-[#1E3F46] via-[#163238] to-[#0e2529]
```

In these files:
- src/components/Prog.tsx
- src/pages/dashboard.tsx
- src/pages/purchases.tsx
- src/pages/TransactionHistory.tsx
- src/pages/ChangePassword.tsx

Then rebuild: `npm run build && pm2 restart all`
