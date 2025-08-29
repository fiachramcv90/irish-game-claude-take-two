# Asset Sourcing and Management Strategy

**Phase**: 2 - Design & Architecture  
**Agent**: Asset Manager  
**Date**: 2024-08-29  
**Status**: Comprehensive Strategy Completed

---

Based on the comprehensive research from the general-purpose agent, here are the key strategic recommendations for immediate Phase 3 implementation:

## 🎯 **Immediate Implementation Priorities**

### **Priority 1: Critical Path Images (First 2 Weeks)**
- **Animals Category**: 15 images (madra, cat, bó, capall, etc.)
- **Colors Category**: 12 images (dearg, gorm, bán, etc.)
- **Total**: 27 images covering our Priority 1 vocabulary

**Sources**:
- **Unsplash.com**: 70% of animal and color images (CC0 license)
- **Pexels.com**: 20% supplementary images
- **Irish Cultural Sources**: 10% culturally specific contexts

### **Priority 2: Performance Optimization**
- **WebP Format**: Primary format targeting <50KB per image
- **Responsive Sizes**: 140px, 160px, 180px, 360px variants
- **Progressive Loading**: Critical images cached, others lazy-loaded

### **Priority 3: Cultural Validation Process**
- **Tier 1**: Automated appropriateness checking
- **Tier 2**: Irish language educator review
- **Tier 3**: Native Irish speaker final approval

---

## 📋 **Technical Implementation Requirements**

### **Image Processing Pipeline**
```bash
# Automated batch processing setup
mkdir -p public/images/vocabulary/{animals,colors,food,family,numbers}/{webp,jpeg,metadata}

# ImageMagick + cwebp processing pipeline ready for implementation
```

### **File Organization**
```
Pattern: {irishWord}-{englishWord}-{sequenceNumber}-{size}.{extension}
Example: madra-dog-001-180.webp
```

### **Responsive Image Component**
- React component with WebP → JPEG → PNG fallbacks
- Proper accessibility alt text with Irish pronunciation context
- Progressive enhancement for modern browsers

---

## 🌍 **Cultural Authenticity Standards**

### **Approved Sources for Irish Cultural Context**
1. **Tourism Ireland Media Centre** - Official cultural imagery
2. **Wikimedia Commons Irish Collections** - Heritage imagery
3. **Irish Cultural Organizations** - Authentic representations

### **Avoid**:
- Stereotypical leprechauns, excessive shamrocks
- Tourist-cliché representations
- Culturally inappropriate contexts

### **Embrace**:
- Modern Irish life contexts
- Diverse Irish family representations
- Authentic Irish food preparations
- Contemporary Irish cultural elements

---

## 📊 **Budget and Timeline**

### **Cost Breakdown**:
- **Free Sources (70%)**: $0 (Unsplash, Pexels, Wikimedia)
- **Irish Cultural Sources (20%)**: $0-500 (permission/attribution costs)
- **Premium Sources (10%)**: $500-1000 (Getty Images, Shutterstock for specific needs)

**Total Estimated Budget**: $500-1500 for 67 high-quality images

### **Timeline**:
- **Week 1**: Free source collection (30+ images)
- **Week 2**: Cultural source acquisition and validation
- **Week 3**: Premium source gap-filling and optimization
- **Week 4**: Final processing, metadata, and quality assurance

---

This strategy provides immediate, actionable guidance for Phase 3 while ensuring cultural authenticity, technical performance, and accessibility compliance.