# Asset Standards and Guidelines

This document establishes comprehensive standards for images, media assets, and visual content used in the Irish Language Matching Game.

## Asset Overview

### Asset Types
- **Primary Images**: Pictures representing Irish vocabulary words
- **UI Icons**: Interface elements, buttons, and navigation
- **Background Images**: Game backgrounds and decorative elements
- **Logo and Branding**: Game identity and Irish cultural elements
- **Future Assets**: Audio pronunciations, animations (Phase 2+)

### Quality Principles
- **Cultural Authenticity**: Accurate representation of Irish culture and contexts
- **Visual Clarity**: Clear, easily recognizable images suitable for learning
- **Performance Optimization**: Fast-loading, appropriately sized assets
- **Accessibility**: Compatible with screen readers and assistive technologies
- **Consistency**: Unified visual style throughout the application

---

## Image Standards

### Technical Specifications

#### File Formats
**Primary Format**: WebP with JPEG/PNG fallbacks
- **WebP**: Modern format, 25-35% smaller than JPEG, supported by 95%+ browsers
- **JPEG Fallback**: For older browsers, high compatibility
- **PNG Fallback**: For images requiring transparency or sharp edges

**Format Decision Matrix**:
```
Photographs (vocabulary images): WebP → JPEG → PNG
Icons with transparency: WebP → PNG
Simple graphics: WebP → PNG → SVG
Logo and branding: SVG → WebP → PNG
```

#### Resolution and Sizing
**Vocabulary Images**:
- **Display Size**: 200x200px maximum on desktop, 150x150px on mobile
- **Source Resolution**: 400x400px (2x for retina displays)
- **Aspect Ratio**: 1:1 (square) for consistency in card layouts
- **File Size Target**: <50KB per image (WebP), <80KB (JPEG)

**UI Icons**:
- **Display Sizes**: 16px, 24px, 32px, 48px (common breakpoints)
- **Source Resolution**: SVG preferred for scalability
- **File Size Target**: <10KB per icon

**Responsive Breakpoints**:
```css
/* Mobile First Approach */
.vocabulary-image {
  width: 120px;
  height: 120px;
}

@media (min-width: 768px) {
  .vocabulary-image {
    width: 150px;
    height: 150px;
  }
}

@media (min-width: 1024px) {
  .vocabulary-image {
    width: 200px;
    height: 200px;
  }
}
```

#### Image Quality Standards
**Vocabulary Images**:
- **Minimum Resolution**: 300x300px source
- **Color Depth**: 24-bit color (16.7 million colors)
- **Compression**: Balanced quality/filesize (85-90% JPEG quality)
- **Sharpness**: Crisp, clear focus on subject
- **Lighting**: Even, natural lighting preferred

**Accessibility Requirements**:
- **Contrast**: High contrast between subject and background
- **Clarity**: No visual noise or distracting elements
- **Recognition**: Instantly recognizable representation of the concept
- **Cultural Context**: Appropriate visual context for Irish learners

### Visual Style Guidelines

#### Photography Style
**Preferred Style**:
- **Clean Backgrounds**: Minimal, non-distracting backgrounds
- **Natural Lighting**: Soft, even lighting
- **Realistic Colors**: Accurate color representation
- **Sharp Focus**: Clear subject focus, minimal depth of field blur
- **Professional Quality**: High-quality, stock-photo level images

**Cultural Considerations**:
- **Irish Context**: When appropriate, show Irish cultural contexts
- **Universal Appeal**: Balance Irish culture with universal recognition
- **Diversity**: Include diverse representations where applicable
- **Modern Context**: Contemporary Irish life alongside traditional elements

#### Image Composition
**Framing Guidelines**:
- **Subject Centered**: Primary subject in center of frame
- **Adequate Padding**: 10-15% padding around edges for cropping flexibility
- **Single Subject**: One clear subject per image to avoid confusion
- **Consistent Perspective**: Similar viewing angles across categories

**Background Standards**:
- **Clean Backgrounds**: White, light gray, or naturally blurred backgrounds
- **No Text**: Backgrounds should not contain readable text
- **Cultural Neutrality**: Avoid backgrounds that might be culturally specific unless intended
- **Consistent Style**: Similar background treatment across vocabulary categories

### Image Categories and Requirements

#### Animals (Ainmhithe)
**Style Requirements**:
- **Individual Animals**: Single animal per image, clear full-body or head shots
- **Natural Poses**: Animals in natural, recognizable poses
- **Clean Backgrounds**: Removed or blurred natural backgrounds
- **High Recognition**: Typical breed representations (e.g., common dog breeds)

**Specific Examples**:
- **madra (dog)**: Golden retriever or similar friendly breed, sitting or standing
- **cat (cat)**: Domestic shorthair cat, alert and facing camera
- **bó (cow)**: Holstein or similar dairy cow, full body in pasture setting

#### Colors (Dathanna)
**Style Requirements**:
- **Pure Color Examples**: Objects that clearly demonstrate the color
- **Multiple Objects**: When helpful, show color in multiple contexts
- **High Saturation**: Vibrant, clear color representation
- **Universal Recognition**: Objects universally associated with that color

**Specific Examples**:
- **dearg (red)**: Red apple, red rose, or red car
- **gorm (blue)**: Blue sky, blue car, or blue flower
- **glas (green)**: Green grass, green apple, or green leaves

#### Food (Bia)
**Style Requirements**:
- **Fresh Appearance**: Food should look fresh and appealing
- **Cultural Context**: When appropriate, show Irish food contexts
- **Clear Identification**: Easily recognizable food items
- **Consistent Lighting**: Professional food photography lighting

**Specific Examples**:
- **arán (bread)**: Irish soda bread or brown bread when culturally appropriate
- **bainne (milk)**: Glass of milk or milk bottle
- **úll (apple)**: Fresh, red or green apple with good lighting

---

## Asset Organization

### File Structure
```
assets/
├── images/
│   ├── vocabulary/
│   │   ├── animals/
│   │   │   ├── webp/
│   │   │   │   ├── madra-dog-001.webp
│   │   │   │   └── cat-cat-001.webp
│   │   │   ├── jpeg/
│   │   │   │   ├── madra-dog-001.jpg
│   │   │   │   └── cat-cat-001.jpg
│   │   │   └── png/
│   │   │       ├── madra-dog-001.png
│   │   │       └── cat-cat-001.png
│   │   ├── colors/
│   │   ├── food/
│   │   └── family/
│   ├── ui/
│   │   ├── icons/
│   │   ├── buttons/
│   │   └── backgrounds/
│   └── branding/
│       ├── logos/
│       └── irish-elements/
├── audio/ (future)
│   └── pronunciations/
└── fonts/
    └── irish-capable/
```

### Naming Conventions
**Vocabulary Images**:
Format: `{irishWord}-{englishWord}-{sequenceNumber}.{extension}`
- Examples:
  - `madra-dog-001.webp`
  - `dearg-red-001.webp`
  - `arán-bread-002.jpg` (alternative image)

**UI Assets**:
Format: `{purpose}-{description}-{size}.{extension}`
- Examples:
  - `icon-play-24px.svg`
  - `button-primary-normal.webp`
  - `background-game-board.webp`

**Metadata Requirements**:
- All images must have corresponding metadata files
- Include alt text, descriptions, and cultural context
- Track source, licensing, and modification history

### Asset Metadata

#### Image Metadata Structure
```json
{
  "id": "madra-dog-001",
  "irishWord": "madra",
  "englishTranslation": "dog",
  "category": "animals",
  "formats": {
    "webp": "/images/vocabulary/animals/webp/madra-dog-001.webp",
    "jpeg": "/images/vocabulary/animals/jpeg/madra-dog-001.jpg",
    "png": "/images/vocabulary/animals/png/madra-dog-001.png"
  },
  "dimensions": {
    "width": 400,
    "height": 400
  },
  "fileSize": {
    "webp": 45120,
    "jpeg": 67840,
    "png": 123456
  },
  "altText": "A friendly golden retriever dog sitting outdoors",
  "description": "Golden retriever representing the Irish word 'madra' meaning dog",
  "culturalContext": "Universal pet context, no specific Irish cultural elements",
  "source": "Stock photography - Unsplash",
  "license": "Creative Commons",
  "dateAdded": "2024-01-01T00:00:00Z",
  "verified": true,
  "tags": ["animals", "pets", "common", "domestic"]
}
```

---

## Asset Sourcing

### Sourcing Strategy

#### Primary Sources (Recommended)
1. **Unsplash**: High-quality, free stock photography
2. **Pexels**: Community-driven stock photos
3. **Pixabay**: Large collection with various licenses
4. **Wikimedia Commons**: Free cultural and educational images
5. **Custom Photography**: Original photos when needed

#### Irish Cultural Sources
1. **Irish Cultural Organizations**: Museums, cultural centers
2. **Tourism Ireland**: Official tourism imagery
3. **National Library of Ireland**: Historical and cultural images
4. **Local Photographers**: Irish photographers for cultural authenticity

#### Licensing Requirements
**Preferred Licenses**:
- Creative Commons CC0 (Public Domain)
- Creative Commons CC-BY (Attribution required)
- Royalty-free commercial licenses

**License Tracking**:
- All licenses must be documented and tracked
- Attribution requirements must be met
- Commercial use permissions verified
- Expiration dates monitored for licensed content

### Quality Control Process

#### Image Review Workflow
1. **Technical Review**: Resolution, format, file size compliance
2. **Cultural Review**: Appropriateness for Irish language learning
3. **Educational Review**: Learning effectiveness and clarity
4. **Accessibility Review**: Screen reader compatibility and contrast
5. **Legal Review**: Licensing and usage rights verification

#### Review Checklist
**Technical Quality**:
- [ ] Resolution meets minimum requirements (300x300px)
- [ ] File size within targets (<50KB WebP, <80KB JPEG)
- [ ] Multiple format versions created
- [ ] Proper compression applied
- [ ] Image sharpness and clarity verified

**Content Quality**:
- [ ] Subject clearly represents the vocabulary word
- [ ] Culturally appropriate for Irish learners
- [ ] No distracting background elements
- [ ] Professional photography quality
- [ ] Consistent with visual style guide

**Accessibility**:
- [ ] High contrast between subject and background
- [ ] Alt text written and descriptive
- [ ] No essential information conveyed only through color
- [ ] Compatible with screen reader descriptions

**Legal Compliance**:
- [ ] Licensing rights documented
- [ ] Attribution requirements met
- [ ] Commercial use permissions verified
- [ ] No trademark or copyright violations

---

## Optimization Guidelines

### Performance Optimization

#### Image Compression
**Automated Optimization Pipeline**:
1. **Source Processing**: Convert from original to working format
2. **Format Generation**: Create WebP, JPEG, and PNG versions
3. **Size Optimization**: Compress while maintaining quality
4. **Responsive Sizing**: Generate multiple size variants
5. **Metadata Generation**: Create asset metadata files

**Compression Settings**:
```javascript
// WebP Settings
const webpOptions = {
  quality: 85,
  method: 4, // Higher compression effort
  preset: 'photo', // Optimize for photographs
  autoFilter: true
};

// JPEG Settings  
const jpegOptions = {
  quality: 88,
  progressive: true,
  mozjpeg: true // Use mozjpeg encoder for better compression
};

// PNG Settings
const pngOptions = {
  compressionLevel: 9,
  palette: true, // Use palette when beneficial
  strip: true // Remove metadata
};
```

#### Loading Optimization
**Lazy Loading Strategy**:
```typescript
interface ImageLoadingStrategy {
  priority: 'high' | 'normal' | 'low';
  loading: 'eager' | 'lazy';
  sizes: string;
  srcSet: string;
}

// Critical images (current game cards)
const criticalImageConfig: ImageLoadingStrategy = {
  priority: 'high',
  loading: 'eager',
  sizes: '(max-width: 768px) 150px, 200px',
  srcSet: 'image-150.webp 150w, image-200.webp 200w, image-300.webp 300w'
};

// Non-critical images (upcoming levels)
const lazyImageConfig: ImageLoadingStrategy = {
  priority: 'normal',
  loading: 'lazy',
  sizes: '(max-width: 768px) 150px, 200px',
  srcSet: 'image-150.webp 150w, image-200.webp 200w'
};
```

### Caching Strategy

#### Browser Caching
```http
# Cache Headers for Assets
Cache-Control: public, max-age=31536000, immutable
ETag: "unique-hash-for-asset"
Last-Modified: Wed, 01 Jan 2024 00:00:00 GMT
```

#### Service Worker Caching
```javascript
// Cache critical vocabulary images
const CRITICAL_IMAGES = [
  '/images/vocabulary/animals/webp/madra-dog-001.webp',
  '/images/vocabulary/colors/webp/dearg-red-001.webp',
  // ... other critical images
];

// Cache with network-first strategy for images
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images-v1').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

---

## Accessibility Standards

### Screen Reader Support

#### Alt Text Guidelines
**Vocabulary Images**:
```html
<!-- Good: Descriptive and contextual -->
<img 
  src="madra-dog-001.webp" 
  alt="A friendly golden retriever dog sitting in a grassy field, representing the Irish word madra"
  lang="ga"
  data-irish-word="madra"
  data-english="dog"
/>

<!-- Bad: Too brief or generic -->
<img src="dog.jpg" alt="dog" />
```

**Alt Text Formula**:
`[Visual description] + [Cultural context if relevant] + [Learning context]`

#### Screen Reader Integration
```typescript
const ImageWithIrishContext: React.FC<{
  src: string;
  irishWord: string;
  englishTranslation: string;
  altText: string;
}> = ({ src, irishWord, englishTranslation, altText }) => {
  return (
    <>
      <img 
        src={src}
        alt={altText}
        role="img"
        aria-describedby={`irish-context-${irishWord}`}
      />
      <div 
        id={`irish-context-${irishWord}`}
        className="sr-only"
        aria-hidden="true"
      >
        Irish word: {irishWord}, English meaning: {englishTranslation}
      </div>
    </>
  );
};
```

### Color and Contrast
**Minimum Requirements**:
- **Text Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
- **Image Contrast**: Sufficient contrast between subject and background
- **Color Independence**: No information conveyed through color alone

**Testing Tools**:
- WebAIM Contrast Checker
- Lighthouse accessibility audit
- Screen reader testing (NVDA, JAWS, VoiceOver)

---

## Quality Assurance

### Testing Procedures

#### Image Quality Testing
1. **Visual Testing**: Manual review of all images across devices
2. **Performance Testing**: Load time measurement and optimization
3. **Accessibility Testing**: Screen reader and contrast validation
4. **Cultural Testing**: Review by Irish cultural consultants
5. **Educational Testing**: Learning effectiveness assessment

#### Automated Quality Checks
```javascript
// Example automated image quality validation
const validateImageQuality = async (imagePath) => {
  const checks = {
    fileSize: await checkFileSize(imagePath),
    dimensions: await checkDimensions(imagePath),
    format: await checkFormat(imagePath),
    compression: await checkCompression(imagePath),
    accessibility: await checkAccessibility(imagePath)
  };
  
  return {
    passed: Object.values(checks).every(check => check.passed),
    results: checks
  };
};
```

### Content Review Process

#### Multi-Stage Review
1. **Asset Manager**: Technical and visual quality review
2. **Content Specialist**: Cultural appropriateness and educational value
3. **UI/UX Designer**: Visual consistency and user experience
4. **QA Agent**: Accessibility and performance validation
5. **Project Orchestrator**: Final approval and integration

---

This comprehensive asset standards guide ensures all visual content in the Irish Language Matching Game meets high standards for quality, performance, accessibility, and cultural authenticity while supporting effective language learning.