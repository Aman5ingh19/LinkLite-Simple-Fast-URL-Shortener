# LinkLite — Simple & Fast URL Shortener

LinkLite is a clean, modern, beginner-friendly URL shortener built with **Next.js App Router (JavaScript ES6+)**, **Tailwind CSS**, **PostgreSQL**, and **Prisma ORM**. It transforms long web addresses into clean 6-character short links, tracks visitor click counts atomically, enforces strict server-side validation, and offers instant redirection.

---

## ⚡ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** JavaScript (ES6+) — pure `.js` and `.jsx`, zero TypeScript
- **Styling:** Tailwind CSS (Modern dark mode, glassmorphism, responsive)
- **Database:** PostgreSQL
- **ORM:** Prisma ORM with `@prisma/adapter-pg` driver adapter
- **Icons:** Lucide React

---

## ✨ Features

1. **Home Page:** Clean, intuitive UI with large URL input field, paste button, and "Shorten URL" trigger.
2. **Unique Short Code Generation:** Generates collision-resistant 6-character alphanumeric codes with automated collision detection and exponential fallback.
3. **Instant Redirection:** Visiting `/[shortCode]` performs an instant HTTP 307 redirect to the original destination URL.
4. **Copy Link:** One-click copy button with instant visual feedback (`Copied!`).
5. **URL History:** Real-time history table (desktop) and card list (mobile) showing original destination, short link, creation timestamp, and click count.
6. **Delete URL:** One-click deletion with confirmation dialog to protect against accidental removal.
7. **Atomic Click Counter:** Automatically increments visitor count in PostgreSQL each time a link is visited.
8. **Server-Side Validation:** Rejects empty or malformed URLs, enforcing strict `http://` and `https://` protocol requirements.
9. **Responsive Design:** Polished user experience across mobile, tablet, and desktop devices.
10. **Custom 404 Page:** Friendly "Link Not Found" page when navigating to expired, deleted, or non-existent short links.

---

## 🗄️ Database Architecture

The application uses a PostgreSQL database managed via Prisma with the `ShortUrl` model:

```prisma
model ShortUrl {
  id          String   @id @default(cuid())
  originalUrl String   @db.Text
  shortCode   String   @unique
  clickCount  Int      @default(0)
  createdAt   DateTime @default(now())

  @@index([shortCode])
  @@index([createdAt])
  @@map("short_urls")
}
```

### Constraints & Indexes
- `id`: CUID primary key.
- `shortCode`: Unique constraint (`@unique`), automatically indexed for $O(1)$ lookup performance on redirects.
- `createdAt`: Indexed for fast descending history queries (`ORDER BY createdAt DESC`).

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- **Node.js** 18+ (tested on Node v24)
- **PostgreSQL** instance (local, Docker, or cloud like Neon / Supabase / Railway)

### 2. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd "LinkLite — URL Shortener"
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update your `DATABASE_URL` in `.env`:
```env
# Example for local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linklite?schema=public"

# Example for Neon / Supabase cloud PostgreSQL
# DATABASE_URL="postgresql://user:password@ep-host.region.aws.neon.tech/linklite?sslmode=require"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Database Migrations
Initialize the database schema:
```bash
npx prisma migrate dev --name init
```
Generate the Prisma Client:
```bash
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Application

### 1. Shorten a URL
- Enter a valid URL like `https://github.com` or `https://news.ycombinator.com/`.
- Click **"Shorten URL"**.
- A green success card appears with your new short link `http://localhost:3000/[shortCode]`.

### 2. Test Copy to Clipboard
- Click **"Copy Link"**. Notice the button changes to **"Copied!"** and a toast notification appears.

### 3. Test Redirection & Click Counting
- Click **"Visit"** or open `http://localhost:3000/[shortCode]` in a new tab.
- You will be redirected immediately to the destination website.
- In the LinkLite dashboard, click the **Refresh** button next to the history header — the click counter will increment from `0` to `1`.

### 4. Test Server-Side Validation
- Try submitting `javascript:alert(1)` or `not-a-valid-url`.
- LinkLite will reject the input with a descriptive error message:
  - *Disallowed protocol "javascript:". Only "http://" and "https://" links are permitted.*
  - *Invalid URL format. Please include http:// or https://.*

### 5. Test Link Deletion
- Click the trash icon next to a shortened URL.
- A confirmation modal appears asking: *"Delete Short Link?"*.
- Confirm deletion: the link is removed from the database and disappears from history.
- Visiting the deleted short link will now render LinkLite's custom **404 Not Found** page.

---

## ☁️ Vercel Deployment Instructions

Deploying LinkLite to Vercel is seamless:

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete LinkLite URL Shortener"
git push origin main
```

### Step 2: Import Project to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"** and select your LinkLite repository.
3. Keep the framework preset as **Next.js**.

### Step 3: Configure Database on Vercel
You can either attach **Vercel Postgres / Neon** directly:
1. In the Vercel dashboard, go to the **Storage** tab and create a **PostgreSQL** database (powered by Neon).
2. Vercel will automatically inject `DATABASE_URL` into your environment variables.
3. Or manually set `DATABASE_URL` in **Project Settings > Environment Variables** with your PostgreSQL connection string.
4. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://your-app.vercel.app`).

### Step 4: Run Migrations on Production
In your `package.json`, the `postinstall` script is already configured:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```
For production migrations, you can add a build command or run:
```bash
npx prisma migrate deploy
```

### Step 5: Deploy
Click **"Deploy"**. Vercel will build and deploy your application.

---

## 📁 Project Structure

```
LinkLite — URL Shortener/
├── app/
│   ├── [shortCode]/
│   │   └── page.js           # Dynamic redirection route & atomic click tracking
│   ├── api/
│   │   └── urls/
│   │       ├── route.js      # GET (all links) & POST (create short URL)
│   │       └── [id]/
│   │           └── route.js  # DELETE short URL by ID
│   ├── favicon.ico
│   ├── globals.css           # Tailwind CSS imports, dark theme, glassmorphism
│   ├── layout.js             # Root layout with Geist font and SEO tags
│   ├── not-found.js          # Custom 404 page for missing/deleted links
│   └── page.js               # Main Home Page component
├── components/
│   ├── Navbar.jsx            # Brand header and database status badge
│   ├── Toast.jsx             # User notification toast
│   ├── UrlForm.jsx           # URL input, paste button, validation & submission
│   ├── UrlHistory.jsx        # History table (desktop), cards (mobile), delete modal
│   └── UrlResult.jsx         # Success result card with copy & visit buttons
├── lib/
│   ├── prisma.js             # PrismaClient singleton with pg adapter
│   └── utils.js              # Validation, code generation, collision check, dates
├── prisma/
│   ├── migrations/           # Database migration files
│   └── schema.prisma         # Prisma schema with ShortUrl model
├── .env.example              # Environment variables template
├── jsconfig.json             # Path alias (@/*) configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── prisma7.config.js         # Prisma 7 configuration file
└── README.md                 # Complete documentation & setup guide
```

---

## 📄 License
MIT © LinkLite
