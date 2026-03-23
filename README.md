# 🚀 Basavachetan Chanshetty — Portfolio Website

A professional, production-ready portfolio website for a Full Stack Developer at IBM.
Built with **Node.js + Express + EJS** with a clean dark/blue theme.

---

## 📁 Folder Structure

```
portFolio/
├── data/
│   └── portfolio.json        # All portfolio content (edit this to update content)
├── public/
│   ├── css/
│   │   └── style.css         # All styles (dark theme + responsive)
│   ├── js/
│   │   └── main.js           # Typing effect, animations, form, scroll
│   └── favicon.svg           # SVG favicon
├── views/
│   ├── index.ejs             # Main portfolio page template
│   └── 404.ejs               # 404 error page
├── .dockerignore
├── .env                      # Environment variables (not committed)
├── .gitignore
├── Dockerfile                # Docker container config
├── package.json
├── render.yaml               # Render.com deployment config
├── server.js                 # Express server entry point
└── README.md
```

---

## ✨ Features

- 🎨 **Dark + Blue accent theme** (IBM-inspired)
- 📱 **Fully responsive** (mobile, tablet, desktop)
- ⚡ **Smooth scroll** + scroll-triggered animations
- ⌨️ **Typing effect** in hero section
- 📊 **Animated skill progress bars**
- 🃏 **Project cards** with tech tags
- 📅 **Experience timeline**
- 📬 **Contact form** with validation
- 🔒 **Security headers** via Helmet.js
- 🗜️ **Gzip compression**
- 🏥 **Health check endpoint** (`/health`)
- 🔌 **JSON API endpoint** (`/api/portfolio`)
- 🐳 **Docker ready**
- 🚀 **Render / Railway / Vercel ready**

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Runtime   | Node.js 20+                       |
| Framework | Express 4                         |
| Templates | EJS                               |
| Styling   | Custom CSS (no framework)         |
| Icons     | Font Awesome 6                    |
| Fonts     | Google Fonts (Inter + Fira Code)  |
| Security  | Helmet.js                         |
| Logging   | Morgan                            |
| Compress  | Compression                       |

---

## 🚀 Run Locally

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/laxman-dev/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# (or just use the existing .env file)

# 4. Start development server (with auto-reload)
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Production Mode

```bash
NODE_ENV=production npm start
```

---

## 🌐 Deploy on Render (Recommended — Free)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

2. **Go to [render.com](https://render.com)** and sign up/login

3. **Click "New +" → "Web Service"**

4. **Connect your GitHub repository**

5. **Configure the service:**
   | Setting       | Value              |
   |---------------|--------------------|
   | Name          | laxman-portfolio   |
   | Runtime       | Node                |
   | Build Command | `npm install`      |
   | Start Command | `npm start`        |
   | Plan          | Free               |

6. **Add Environment Variables:**
   | Key        | Value       |
   |------------|-------------|
   | NODE_ENV   | production  |
   | PORT       | 3000        |

7. **Click "Create Web Service"** — Render will auto-deploy!

> ✅ The `render.yaml` file in the repo handles this automatically if you use "Blueprint" deployment.

---

## 🚂 Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up

2. Click **"New Project" → "Deploy from GitHub repo"**

3. Select your repository

4. Railway auto-detects Node.js and deploys

5. Add environment variables in the Railway dashboard:
   - `NODE_ENV=production`
   - `PORT=3000`

6. Your app will be live at `https://your-app.railway.app`

---

## ▲ Deploy on Vercel (Node.js)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Create `vercel.json` in project root:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "server.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "server.js" }]
   }
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

---

## 🐳 Deploy with Docker

### Build and Run Locally

```bash
# Build the Docker image
docker build -t laxman-portfolio .

# Run the container
docker run -p 3000:3000 -e NODE_ENV=production laxman-portfolio

# Open: http://localhost:3000
```

### Docker Compose (Optional)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### Push to Docker Hub

```bash
docker tag laxman-portfolio yourdockerhubuser/laxman-portfolio:latest
docker push yourdockerhubuser/laxman-portfolio:latest
```

---

## 🔧 Customization

### Update Portfolio Content
Edit `data/portfolio.json` — all sections (owner info, skills, projects, experience, education) are driven from this single file.

### Update Styles
Edit `public/css/style.css` — CSS custom properties at the top control the entire color theme:
```css
:root {
  --color-primary: #0f62fe;   /* Change accent color here */
  --color-bg:      #0a0e1a;   /* Change background here  */
}
```

### Add Real Contact Form
In `public/js/main.js`, replace the simulated submission with a real API call:
```js
const res = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message }),
});
```
Then add a `/api/contact` POST route in `server.js` with Nodemailer.

---

## 📡 API Endpoints

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| GET    | `/`             | Main portfolio page            |
| GET    | `/api/portfolio`| Portfolio data as JSON         |
| GET    | `/health`       | Health check (for monitoring)  |

---

## 📄 License

MIT © [Laxman Chanshetty](https://github.com/laxman-dev)
