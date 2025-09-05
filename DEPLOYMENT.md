# Deployment Guide - Know Your Rights Now

This guide covers deployment options for the Know Your Rights Now application.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vistara-apps/this-is-a-6508)

1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### 2. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/vistara-apps/this-is-a-6508)

1. Click the deploy button above
2. Connect your GitHub account
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Configure environment variables

### 3. Docker Deployment

```bash
# Build the image
docker build -t know-your-rights-now .

# Run the container
docker run -p 3000:80 \
  -e VITE_OPENAI_API_KEY=your_key \
  -e VITE_PINATA_API_KEY=your_key \
  -e VITE_PINATA_SECRET_KEY=your_key \
  -e VITE_STRIPE_PUBLISHABLE_KEY=your_key \
  know-your-rights-now
```

## 🔧 Environment Variables

Set these environment variables in your deployment platform:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | No* | `sk-...` |
| `VITE_PINATA_API_KEY` | Pinata API key for IPFS storage | No* | `your_api_key` |
| `VITE_PINATA_SECRET_KEY` | Pinata secret key | No* | `your_secret_key` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payments | No* | `pk_live_...` |

*Not required - app works with mock data if not provided

## 🏗 Manual Deployment

### Prerequisites
- Node.js 18+
- npm or yarn

### Build Process

1. **Clone and install**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-6508.git
   cd this-is-a-6508
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Deploy the `dist/` folder**
   Upload the contents of the `dist/` folder to your web server.

### Static Hosting Options

- **GitHub Pages**: Deploy from `dist/` folder
- **AWS S3**: Upload `dist/` contents to S3 bucket
- **Firebase Hosting**: Use `firebase deploy`
- **Surge.sh**: Use `surge dist/`

## 🐳 Docker Configuration

### Dockerfile
The included Dockerfile creates a production-ready container:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_OPENAI_API_KEY=${OPENAI_API_KEY}
      - VITE_PINATA_API_KEY=${PINATA_API_KEY}
      - VITE_PINATA_SECRET_KEY=${PINATA_SECRET_KEY}
      - VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
```

## 🔒 Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use different keys for development and production

### HTTPS
- Always deploy with HTTPS enabled
- Use SSL certificates (Let's Encrypt is free)
- Configure proper security headers

### Content Security Policy
Add these headers to your web server:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; connect-src 'self' https://api.openai.com https://api.pinata.cloud https://gateway.pinata.cloud; media-src 'self' blob:; img-src 'self' data: blob:;
```

## 📊 Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics 4
- **Performance**: Web Vitals
- **Uptime**: Pingdom or UptimeRobot

### Health Check Endpoint
The app serves a health check at `/health` (if configured):

```javascript
// Add to your server configuration
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

## 🚀 Performance Optimization

### Build Optimizations
- Code splitting is enabled by default
- Assets are minified and compressed
- Tree shaking removes unused code

### CDN Configuration
Configure your CDN to cache static assets:

```
# Cache static assets for 1 year
/assets/* -> Cache-Control: public, max-age=31536000, immutable

# Cache HTML for 1 hour
/*.html -> Cache-Control: public, max-age=3600
```

### Service Worker
Consider adding a service worker for offline functionality:

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          VITE_PINATA_API_KEY: ${{ secrets.PINATA_API_KEY }}
          VITE_PINATA_SECRET_KEY: ${{ secrets.PINATA_SECRET_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (requires 18+)
   - Clear node_modules and reinstall
   - Check for syntax errors

2. **API Keys Not Working**
   - Verify environment variable names
   - Check API key validity
   - Ensure proper permissions

3. **Camera/Microphone Not Working**
   - Requires HTTPS in production
   - Check browser permissions
   - Verify device compatibility

### Debug Mode
Enable debug logging by setting:
```bash
VITE_DEBUG=true
```

## 📞 Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/vistara-apps/this-is-a-6508/issues)
2. Review the [README.md](README.md)
3. Contact support at support@knowyourrightsnow.com

---

**Happy Deploying!** 🚀
