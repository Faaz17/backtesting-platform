export interface PythonStrategy {
  code: string;
  entryConditions: string[];
  exitConditions: string[];
  indicators: string[];
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
  };
}

export class NLPToPythonConverter {
  private groqApiKey: string;

  constructor(apiKey: string) {
    this.groqApiKey = apiKey;
  }

  async convertStrategyToPython(nlpStrategy: string): Promise<PythonStrategy> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "groq/compound",
          messages: [
            {
              role: "user",
              content: `You are a trading strategy expert. Convert the following natural language trading strategy into Python code that can be executed in a backtesting engine.

Natural Language Strategy: ${nlpStrategy}

Requirements:
1. Generate Python code that implements the strategy logic
2. The code should work with OHLCV data (Open, High, Low, Close, Volume)
3. Include proper entry and exit conditions
4. Implement risk management (stop loss, take profit)
5. Use common technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands, etc.)
6. The code should be executable and return clear signals

Return the response in this JSON format:
{
  "code": "python code here",
  "entryConditions": ["condition1", "condition2"],
  "exitConditions": ["condition1", "condition2"],
  "indicators": ["indicator1", "indicator2"],
  "riskManagement": {
    "stopLoss": 2.0,
    "takeProfit": 4.0
  }
}

Only return valid JSON, no additional text.`
            }
          ],
          temperature: 0.7,
          max_completion_tokens: 2048,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const pythonCode = data.choices[0].message.content;
      
      console.log('[Groq] Received response:', pythonCode);
      
      const parsedStrategy = JSON.parse(pythonCode);
      return parsedStrategy;
    } catch (error) {
      console.error('Error converting NLP strategy to Python with Groq:', error);
      
      // Fallback to a simple moving average strategy
      return this.getDefaultStrategy();
    }
  }

  private getDefaultStrategy(): PythonStrategy {
    return {
      code: `
def calculate_signals(data):
    """
    Simple Moving Average Crossover Strategy
    """
    import pandas as pd
    import numpy as np
    
    # Calculate moving averages
    data['SMA_20'] = data['close'].rolling(window=20).mean()
    data['SMA_50'] = data['close'].rolling(window=50).mean()
    
    # Generate signals
    data['signal'] = 0
    data.loc[data['SMA_20'] > data['SMA_50'], 'signal'] = 1  # Buy
    data.loc[data['SMA_20'] < data['SMA_50'], 'signal'] = -1  # Sell
    
    return data
`,
      entryConditions: [
        "SMA_20 crosses above SMA_50",
        "Price is above both moving averages"
      ],
      exitConditions: [
        "SMA_20 crosses below SMA_50",
        "Price falls below SMA_20"
      ],
      indicators: ["SMA_20", "SMA_50"],
      riskManagement: {
        stopLoss: 2.0,
        takeProfit: 4.0
      }
    };
  }

  async enhanceStrategyWithIndicators(baseStrategy: PythonStrategy, additionalIndicators: string[]): Promise<PythonStrategy> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "groq/compound",
          messages: [
            {
              role: "user",
              content: `Enhance the following Python trading strategy by adding the requested indicators: ${additionalIndicators.join(', ')}

Current Strategy Code:
${baseStrategy.code}

Requirements:
1. Add the requested indicators to the existing strategy
2. Integrate them into the entry/exit conditions
3. Maintain the existing logic while enhancing it
4. Ensure the code is executable and well-structured
5. Use proper pandas/numpy operations

Return the enhanced code in the same JSON format as before.`
            }
          ],
          temperature: 0.7,
          max_completion_tokens: 2048,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const enhancedCode = data.choices[0].message.content;
      
      const enhancedStrategy = JSON.parse(enhancedCode);
      return enhancedStrategy;
    } catch (error) {
      console.error('Error enhancing strategy with Groq:', error);
      return baseStrategy;
    }
  }

  async validateStrategyCode(code: string): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Basic syntax validation
      if (!code.includes('def ')) {
        errors.push('No function definition found');
      }
      
      if (!code.includes('data[')) {
        errors.push('No data manipulation found');
      }
      
      if (!code.includes('signal')) {
        errors.push('No signal generation found');
      }
      
      // Check for common trading strategy elements
      const requiredElements = ['close', 'rolling', 'mean'];
      for (const element of requiredElements) {
        if (!code.includes(element)) {
          errors.push(`Missing required element: ${element}`);
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Code validation failed: ' + error]
      };
    }
  }

  async generateStrategyDocumentation(strategy: PythonStrategy): Promise<string> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "groq/compound",
          messages: [
            {
              role: "user",
              content: `Generate comprehensive documentation for the following trading strategy:

Strategy Code:
${strategy.code}

Entry Conditions: ${strategy.entryConditions.join(', ')}
Exit Conditions: ${strategy.exitConditions.join(', ')}
Indicators: ${strategy.indicators.join(', ')}
Risk Management: Stop Loss ${strategy.riskManagement.stopLoss}%, Take Profit ${strategy.riskManagement.takeProfit}%

Please provide:
1. Strategy overview and logic
2. How the indicators work together
3. Entry and exit rules explanation
4. Risk management explanation
5. Expected performance characteristics
6. Potential improvements

Format as markdown documentation.`
            }
          ],
          temperature: 0.7,
          max_completion_tokens: 2048,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const documentation = data.choices[0].message.content;
      
      return documentation;
    } catch (error) {
      console.error('Error generating documentation with Groq:', error);
      return 'Documentation generation failed.';
    }
  }
}
