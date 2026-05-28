const fs = require('fs');
const path = require('path');

// Figma API configuration
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Missing required environment variables: FIGMA_TOKEN and/or FIGMA_FILE_KEY');
  process.exit(1);
}

async function fetchFigmaTokens() {
  try {
    // Fetch design tokens from Figma Variables API
    const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Create tokens directory if it doesn't exist
    const tokensDir = path.join(process.cwd(), 'tokens');
    if (!fs.existsSync(tokensDir)) {
      fs.mkdirSync(tokensDir, { recursive: true });
    }

    // Transform Figma variables to Style Dictionary format
    const tokens = transformFigmaVariables(data);
    
    // Write tokens to JSON files
    Object.entries(tokens).forEach(([category, categoryTokens]) => {
      const filePath = path.join(tokensDir, `${category}.json`);
      fs.writeFileSync(filePath, JSON.stringify(categoryTokens, null, 2));
      console.log(`✅ Created ${filePath}`);
    });

    console.log('🎉 Successfully fetched and processed Figma tokens!');
    
  } catch (error) {
    console.error('❌ Error fetching Figma tokens:', error.message);
    process.exit(1);
  }
}

function transformFigmaVariables(figmaData) {
  const tokens = {
    colors: {},
    spacing: {},
    typography: {},
    sizing: {}
  };

  // Process variables from Figma response
  if (figmaData.meta && figmaData.meta.variables) {
    Object.values(figmaData.meta.variables).forEach(variable => {
      const category = getCategoryFromVariable(variable);
      const tokenName = variable.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Get the default value (first mode)
      const defaultModeId = Object.keys(variable.valuesByMode)[0];
      const value = variable.valuesByMode[defaultModeId];
      
      if (category && tokens[category]) {
        tokens[category][tokenName] = {
          value: transformValue(value, variable.resolvedType),
          type: getTokenType(variable.resolvedType)
        };
      }
    });
  }

  return tokens;
}

function getCategoryFromVariable(variable) {
  const name = variable.name.toLowerCase();
  
  if (name.includes('color') || name.includes('bg') || name.includes('text')) {
    return 'colors';
  } else if (name.includes('space') || name.includes('gap') || name.includes('margin') || name.includes('padding')) {
    return 'spacing';
  } else if (name.includes('font') || name.includes('text') || name.includes('typography')) {
    return 'typography';
  } else if (name.includes('size') || name.includes('width') || name.includes('height')) {
    return 'sizing';
  }
  
  return 'colors'; // default fallback
}

function transformValue(value, type) {
  if (typeof value === 'object' && value.r !== undefined) {
    // RGBA color object
    return `rgba(${Math.round(value.r * 255)}, ${Math.round(value.g * 255)}, ${Math.round(value.b * 255)}, ${value.a || 1})`;
  } else if (typeof value === 'number') {
    // Numeric value (likely pixels)
    return `${value}px`;
  }
  
  return value;
}

function getTokenType(resolvedType) {
  switch (resolvedType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'dimension';
    case 'STRING':
      return 'fontFamily';
    default:
      return 'dimension';
  }
}

// Run the script
fetchFigmaTokens();