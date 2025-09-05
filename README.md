# Know Your Rights Now

**Instant legal guidance in your pocket.**

A comprehensive web application that provides immediate, accessible legal information and documentation tools for individuals encountering law enforcement, empowering them with knowledge and support.

## 🚀 Features

### Core Features
- **State-Specific Rights Cards**: Mobile-optimized, one-page guides detailing user rights when stopped by law enforcement, tailored to the user's current location
- **De-escalation Scripts & Tactics**: Pre-written phrases and actionable strategies designed to help users de-escalate tense situations with law enforcement
- **One-Tap Incident Recording**: Quick-access button to immediately start recording audio and video, capturing location data automatically during an incident
- **Shareable Incident Summary**: Auto-generates concise, shareable reports of incidents based on recorded data and user input

### Pro Features (Subscription)
- **AI-Powered Scripts**: Personalized de-escalation scripts generated using OpenAI
- **Unlimited Incident Documentation**: No limits on recording length or storage
- **Advanced Incident Summaries**: AI-generated professional summaries suitable for legal review
- **IPFS Storage**: Decentralized storage for incident recordings and summaries via Pinata
- **Priority Support**: Enhanced customer support for Pro subscribers

## 🛠 Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hooks and Context
- **APIs**: 
  - OpenAI GPT-3.5 for AI-generated content
  - Pinata for IPFS storage
  - Stripe for payment processing
  - Browser Geolocation API
- **Storage**: LocalStorage for client-side data persistence
- **Deployment**: Docker-ready with Dockerfile included

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with camera/microphone support
- API keys for external services (optional, app works with mock data)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-6508.git
   cd this-is-a-6508
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (optional)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

The app requires several API keys for full functionality. Copy `.env.example` to `.env` and configure:

```env
# OpenAI API (for AI-generated scripts and summaries)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Pinata IPFS (for decentralized storage)
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here

# Stripe (for payment processing)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**Note**: The app will work with mock data if API keys are not provided, making it easy to test and develop locally.

### API Key Setup

1. **OpenAI API**: Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Pinata IPFS**: Register at [Pinata](https://app.pinata.cloud/keys) for IPFS storage
3. **Stripe**: Get your publishable key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

## 🏗 Architecture

### Data Model

The application implements a comprehensive data model as specified in the PRD:

#### User Entity
```javascript
{
  userId: string,
  email: string (optional),
  subscriptionStatus: 'free' | 'active' | 'cancelled',
  preferredLanguage: 'en' | 'es',
  settings: {
    autoLocation: boolean,
    notifications: boolean,
    dataRetention: number
  }
}
```

#### Incident Entity
```javascript
{
  incidentId: string,
  userId: string,
  timestamp: string,
  location: { latitude: number, longitude: number },
  audioRecordingUrl: string,
  videoRecordingUrl: string,
  userNotes: string,
  generatedSummaryUrl: string,
  status: 'draft' | 'recorded' | 'completed'
}
```

#### Rights Card Entity
```javascript
{
  cardId: string,
  state: string,
  language: 'en' | 'es',
  content: {
    coreRights: string[],
    whatToSay: string[],
    whatNotToSay: string[],
    stateSpecific: string[]
  }
}
```

### Service Layer

The application uses a clean service architecture:

- **API Services** (`src/services/api.js`): External API integrations
- **Data Services** (`src/services/dataService.js`): Data persistence and management
- **Custom Hooks** (`src/hooks/`): React hooks for state management
- **Components** (`src/components/`): Reusable UI components

## 🎨 Design System

The app implements a comprehensive design system with Tailwind CSS:

### Color Palette
- **Background**: `hsl(210 30% 98%)`
- **Surface**: `hsl(0 0% 100%)`
- **Primary**: `hsl(210 40% 45%)`
- **Accent**: `hsl(160 60% 50%)`
- **Text Primary**: `hsl(210 30% 15%)`
- **Text Secondary**: `hsl(210 30% 45%)`

### Typography
- **Display**: `text-4xl font-semibold`
- **Heading**: `text-2xl font-bold`
- **Subheading**: `text-xl font-semibold`
- **Body**: `text-base leading-7`
- **Caption**: `text-sm text-secondary`

### Components
- **AppShell**: Main application layout
- **InfoCard**: Content containers with variants
- **Button**: Interactive elements with multiple variants
- **Modal**: Overlay dialogs
- **SearchBar**: Input components

## 📱 User Flows

### 1. Accessing Rights Information
1. User opens the app
2. App detects user's location (with permission)
3. App displays relevant state-specific rights card
4. User can switch language (English/Spanish)
5. User can access de-escalation scripts

### 2. Recording an Incident
1. User taps 'Record Incident' button
2. App requests camera/microphone permissions
3. App starts recording with location capture
4. User can pause/stop recording
5. User adds optional notes
6. App offers to generate shareable summary (Pro feature)

### 3. Generating AI Scripts
1. User selects scenario type
2. User clicks 'Generate' (Pro feature)
3. App generates personalized scripts using OpenAI
4. User can save, copy, or customize scripts

## 🔒 Privacy & Security

- **Local Storage**: User data stored locally on device
- **IPFS Storage**: Incident recordings stored on decentralized IPFS network
- **No Server Storage**: No personal data stored on central servers
- **Permission-Based**: Camera/microphone access only when explicitly granted
- **Encryption**: All API communications use HTTPS

## 🚀 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t know-your-rights-now .

# Run the container
docker run -p 3000:80 know-your-rights-now
```

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting platform
```

### Environment Variables for Production

Set these environment variables in your hosting platform:
- `VITE_OPENAI_API_KEY`
- `VITE_PINATA_API_KEY`
- `VITE_PINATA_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main layout
│   ├── RightsCard.jsx  # Rights information display
│   ├── DeescalationScripts.jsx  # Script management
│   ├── IncidentRecorder.jsx     # Recording interface
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useLocation.js  # Geolocation management
│   ├── useSubscription.js  # Subscription handling
│   └── ...
├── services/           # Service layer
│   ├── api.js         # External API integrations
│   └── dataService.js # Data management
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Legal Disclaimer

This application provides educational information only and is not a substitute for legal counsel. Users should consult with qualified attorneys for specific legal advice. The information provided may not be current or applicable to all jurisdictions.

## 🆘 Support

For support, please contact [support@knowyourrightsnow.com](mailto:support@knowyourrightsnow.com) or create an issue in this repository.

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Icons by Lucide React
- AI powered by OpenAI
- Storage by Pinata IPFS
- Payments by Stripe

---

**Know Your Rights Now** - Empowering individuals with knowledge and tools to protect their constitutional rights.
