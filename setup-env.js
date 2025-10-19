// Environment setup script
const fs = require('fs');
const path = require('path');

// Create .env.local file with OpenAI API key
const envContent = `# OpenAI API Key for AI strategy conversion
OPENAI_API_KEY=your_openai_api_key_here

# Kaggle API Credentials (already configured in code)
KAGGLE_USERNAME=djarch123
KAGGLE_KEY=f8d8fba4fa94fd8ea0e2168e91c40cad`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('📝 Please edit .env.local and add your OpenAI API key');
  console.log('🔑 Get your API key from: https://platform.openai.com/api-keys');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
}
