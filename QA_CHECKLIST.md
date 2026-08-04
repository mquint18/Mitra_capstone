# Mitra — QA Testing Checklist

Run through this list before each deploy. Check off each item as you test it manually in the browser (or automate with the scripts in `/tests`).

## Authentication & Registration
- [ ] Sign up with an email that already exists → shows "already exists" error
- [ ] Sign up with mismatched password/confirm password → shows error, does not submit
- [ ] Password under 8 characters → blocked with inline error
- [ ] Name field with numbers/symbols/emojis → blocked or stripped
- [ ] Empty form submission → shows all required field errors
- [ ] Login with correct email, wrong password → "Invalid email or password"
- [ ] Login with email that doesn't exist → same generic error (no user enumeration)
- [ ] Resident tries `/business/login` → does not log in
- [ ] Business tries `/login` → does not log in
- [ ] Expired JWT → redirected to login, localStorage cleared
- [ ] Tampered JWT (edit a character) → rejected, redirected to login

## Business Registration
- [ ] Business name is only whitespace → blocked
- [ ] Duplicate business email or username → blocked with clear error
- [ ] Missing required fields one at a time → each shows its own error
- [ ] Very long description → does not break layout
- [ ] Keywords with empty entries (`"lawn,,care,"`) → empty entries filtered out
- [ ] Invalid phone format → formatted or blocked
- [ ] Website without `https://` → still saves, does not crash link

## Search & Booking
- [ ] Search with special characters (`%`, `$`, `<script>`) → no crash, no injection
- [ ] Search returns zero results → friendly empty state, not blank screen
- [ ] Search with only whitespace → treated as empty search
- [ ] Booking a date in the past → blocked (calendar `min` date)
- [ ] Booking with no time selected → submit button disabled
- [ ] Cancel a completed booking → cancel button not shown
- [ ] Business with zero availability → shows "closed" state, not error

## Dashboard & Data
- [ ] New resident, zero bookings → friendly empty state
- [ ] New business, zero bookings → friendly empty state
- [ ] Resident manually navigates to `/dashboard` (business route) → redirected
- [ ] Non-admin navigates to `/admin` → redirected, not shown data

## Network & Reliability
- [ ] Submit form on slow/offline network → shows loading state, then friendly error
- [ ] Double-click submit button → only one request fires
- [ ] Refresh mid-form → no crash, form resets cleanly
- [ ] Backend down → frontend shows "Unable to connect" not a blank crash

## Mobile & Responsive
- [ ] 320px viewport → no horizontal scroll, all buttons tappable
- [ ] Long business name/description → truncates or wraps, doesn't break card

## Security
- [ ] Call `/api/admin/*` with no token → 401
- [ ] Call `/api/bookings/:id` for another user's booking → 403
- [ ] Business description with `<script>` tag → renders as text, does not execute
