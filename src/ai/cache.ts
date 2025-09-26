/**
 * Simple in-memory cache for AI responses to avoid repeated calls
 * In production, consider using Redis or a more robust caching solution
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class AICache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  private generateKey(input: any, functionName: string): string {
    return `${functionName}:${JSON.stringify(input)}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  get(input: any, functionName: string): any | null {
    const key = this.generateKey(input, functionName);
    const entry = this.cache.get(key);
    
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(input: any, functionName: string, data: any, ttl?: number): void {
    const key = this.generateKey(input, functionName);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Remove expired entries to prevent memory leaks
  cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }
}

export const aiCache = new AICache();

// Cleanup expired entries every 10 minutes
setInterval(() => {
  aiCache.cleanup();
}, 10 * 60 * 1000);
