# 🚀 Backtesting Platform Deployment Guide

## 📋 Prerequisites

### Required Software
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **Vercel Account** - [Sign up here](https://vercel.com/)

### Required API Keys
1. **Groq API Key** - [Get here](https://console.groq.com/keys) (configured in environment variables)
2. **Kaggle API** - Already configured in code

## 🏠 Local Development Setup

### Step 1: Install Node.js
1. Download Node.js LTS from [nodejs.org](https://nodejs.org/)
2. Install with default settings
3. Restart your terminal/PowerShell
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
```bash
# Navigate to project directory
cd "C:\Users\FAAZ\ZU Hackathon\backtesting-platform"

# Install dependencies
npm install

# Install additional Python packages (if needed)
npm install pandas numpy scipy scikit-learn kaggle
```

### Step 3: Set Up Environment Variables
Create a `.env.local` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## ☁️ Vercel Deployment

### Method 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
# From project directory
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: backtesting-platform
# - Directory: ./
# - Override settings? N
```

#### Step 4: Set Environment Variables
```bash
vercel env add GROQ_API_KEY
# Enter your Groq API key when prompted (already configured in code)
```

### Method 2: GitHub Integration

#### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Backtesting platform with Kaggle integration"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/backtesting-platform.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com/)
2. Click "New Project"
3. Import from GitHub
4. Select your repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Add Environment Variables
In Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add: `GROQ_API_KEY` with your API key (already configured in code)

## 🔧 Configuration

### Environment Variables
```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (already configured in code)
KAGGLE_USERNAME=djarch123
KAGGLE_KEY=f8d8fba4fa94fd8ea0e2168e91c40cad
```

### Vercel Configuration
The `vercel.json` file is already configured with:
- Next.js build settings
- API route timeout (30 seconds)
- Environment variable mapping

## 🧪 Testing

### Local Testing
1. Start development server: `npm run dev`
2. Open http://localhost:3000
3. Test the backtesting flow:
   - Select a verified asset (BTCUSD, XAUUSD, EURUSD)
   - Enter a strategy description
   - Run backtest
   - Verify results

### Production Testing
1. Deploy to Vercel
2. Test the live application
3. Verify Kaggle data integration
4. Test all 11 metrics calculation

## 📊 Features to Test

### ✅ Verified Assets
- **BTCUSD**: Bitcoin dataset integration
- **XAUUSD**: Gold dataset integration  
- **EURUSD**: Euro dataset integration

### ✅ AI Strategy Conversion
- Natural language strategy input
- Python code generation
- Strategy validation

### ✅ Backtesting Engine
- All 11 required metrics
- Equity curve generation
- Risk management
- Performance analytics

### ✅ Results Dashboard
- Comprehensive metrics display
- Interactive charts
- Export capabilities

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Not Found
```bash
# Install Node.js from nodejs.org
# Restart terminal after installation
```

#### 2. Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Vercel Deployment Issues
```bash
# Check build logs in Vercel dashboard
# Verify environment variables
# Check vercel.json configuration
```

#### 4. API Errors
- Verify OpenAI API key
- Check Kaggle API credentials
- Review console logs for errors

### Debug Commands
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Check installed packages
npm list

# Check Vercel CLI
vercel --version
```

## 🚀 Production Checklist

### Before Deployment
- [ ] Node.js installed and working
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Local testing completed
- [ ] GitHub repository updated

### After Deployment
- [ ] Vercel deployment successful
- [ ] Environment variables set in Vercel
- [ ] Domain accessible
- [ ] All features working
- [ ] Kaggle integration tested
- [ ] AI conversion tested
- [ ] Results dashboard working

## 📈 Performance Optimization

### Vercel Optimizations
- **Edge Functions**: API routes run on edge
- **Automatic Scaling**: Handles traffic spikes
- **Global CDN**: Fast worldwide access
- **Build Caching**: Faster deployments

### Application Optimizations
- **Data Caching**: Kaggle data caching
- **Error Handling**: Graceful fallbacks
- **Loading States**: User feedback
- **Responsive Design**: Mobile-friendly

## 🔒 Security

### API Keys
- Never commit API keys to repository
- Use environment variables
- Rotate keys regularly
- Monitor usage

### Data Privacy
- No user data stored
- Kaggle data processed locally
- Secure API communications
- HTTPS enforced

## 📞 Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Kaggle API Docs](https://www.kaggle.com/docs/api)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Vercel Discord](https://discord.gg/vercel)
- [GitHub Issues](https://github.com/yourusername/backtesting-platform/issues)
