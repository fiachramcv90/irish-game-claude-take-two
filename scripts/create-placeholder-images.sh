#!/bin/bash

# Create placeholder images for Irish vocabulary
# This script generates simple colored rectangles with text labels as placeholders

echo "Creating placeholder images for Irish Language Game..."

# Check if ImageMagick is available, if not use a simple approach
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create placeholder images..."
    
    # Animals placeholders
    convert -size 360x360 -background "#E8F5E8" -fill "#2E7D32" -pointsize 24 -gravity center label:"madra\n(dog)" public/images/vocabulary/animals/madra-dog-001.webp
    convert -size 360x360 -background "#E8F5E8" -fill "#2E7D32" -pointsize 24 -gravity center label:"cat\n(cat)" public/images/vocabulary/animals/cat-cat-001.webp
    convert -size 360x360 -background "#E8F5E8" -fill "#2E7D32" -pointsize 24 -gravity center label:"bó\n(cow)" public/images/vocabulary/animals/bó-cow-001.webp
    convert -size 360x360 -background "#E8F5E8" -fill "#2E7D32" -pointsize 24 -gravity center label:"capall\n(horse)" public/images/vocabulary/animals/capall-horse-001.webp
    
    # Colors placeholders
    convert -size 360x360 -background "#FF0000" -fill "#FFFFFF" -pointsize 24 -gravity center label:"dearg\n(red)" public/images/vocabulary/colors/dearg-red-001.webp
    convert -size 360x360 -background "#0000FF" -fill "#FFFFFF" -pointsize 24 -gravity center label:"gorm\n(blue)" public/images/vocabulary/colors/gorm-blue-001.webp
    convert -size 360x360 -background "#FFFFFF" -fill "#000000" -pointsize 24 -gravity center label:"bán\n(white)" public/images/vocabulary/colors/bán-white-001.webp
    convert -size 360x360 -background "#000000" -fill "#FFFFFF" -pointsize 24 -gravity center label:"dubh\n(black)" public/images/vocabulary/colors/dubh-black-001.webp
    
    echo "Placeholder images created successfully!"
else
    echo "ImageMagick not found. Creating simple HTML-based placeholders..."
    
    # Create a simple HTML file that can generate placeholder images
    cat > public/images/placeholder-generator.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Irish Vocabulary Placeholder Generator</title>
    <style>
        .placeholder {
            width: 360px;
            height: 360px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 10px;
            border-radius: 12px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .animal { background: linear-gradient(135deg, #4CAF50, #2E7D32); }
        .color-red { background: #FF0000; }
        .color-blue { background: #0000FF; }
        .color-white { background: #FFFFFF; color: #000000; text-shadow: none; }
        .color-black { background: #000000; }
    </style>
</head>
<body>
    <h1>Irish Vocabulary Placeholders</h1>
    <p>Use browser dev tools to save these as images</p>
    
    <div class="placeholder animal">madra<br>(dog)</div>
    <div class="placeholder animal">cat<br>(cat)</div>
    <div class="placeholder animal">bó<br>(cow)</div>
    <div class="placeholder animal">capall<br>(horse)</div>
    
    <div class="placeholder color-red">dearg<br>(red)</div>
    <div class="placeholder color-blue">gorm<br>(blue)</div>
    <div class="placeholder color-white">bán<br>(white)</div>
    <div class="placeholder color-black">dubh<br>(black)</div>
</body>
</html>
EOF
    echo "HTML placeholder generator created at public/images/placeholder-generator.html"
fi

echo "Image setup complete!"