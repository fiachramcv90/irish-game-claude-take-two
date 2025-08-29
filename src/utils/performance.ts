/**
 * Performance optimization utilities for Irish Language Matching Game
 */

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load images with intersection observer
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        image.src = src;
        image.classList.remove('lazy');
        observer.unobserve(image);
      }
    });
  });
  
  imageObserver.observe(img);
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  startTimer(label: string): void {
    const start = performance.now();
    this.metrics.set(`${label}_start`, [start]);
  }
  
  endTimer(label: string): number {
    const end = performance.now();
    const startTimes = this.metrics.get(`${label}_start`);
    if (startTimes) {
      const duration = end - startTimes[0];
      const existing = this.metrics.get(label) || [];
      this.metrics.set(label, [...existing, duration]);
      return duration;
    }
    return 0;
  }
  
  getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  getMetrics(): Record<string, { average: number; samples: number }> {
    const result: Record<string, { average: number; samples: number }> = {};
    this.metrics.forEach((times, label) => {
      if (!label.endsWith('_start')) {
        result[label] = {
          average: this.getAverageTime(label),
          samples: times.length
        };
      }
    });
    return result;
  }
  
  clear(): void {
    this.metrics.clear();
  }
}

// Memory usage monitoring
export function getMemoryUsage(): any {
  if ('memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

// Check if device has touch capability
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get device performance tier (basic estimation)
export function getPerformanceTier(): 'low' | 'medium' | 'high' {
  const memory = getMemoryUsage();
  const cores = navigator.hardwareConcurrency || 2;
  
  // Simple heuristic based on available information
  if (memory && memory.jsHeapSizeLimit < 1000000000) return 'low'; // < 1GB heap
  if (cores < 4) return 'low';
  if (cores >= 8 && (!memory || memory.jsHeapSizeLimit > 4000000000)) return 'high';
  return 'medium';
}

// Optimize images based on device capabilities
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
  // Check WebP support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'webp' : 'jpeg';
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();