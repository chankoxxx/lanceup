import"@testing-library/jest-dom/vitest";
import{cleanup}from"@testing-library/react";
import{afterEach}from"vitest";
afterEach(()=>cleanup());
class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null; readonly rootMargin = "0px"; readonly thresholds = [0];
  constructor(private callback: IntersectionObserverCallback) {}
  disconnect() {} observe(target: Element) { this.callback([{ isIntersecting:true,target } as IntersectionObserverEntry], this); }
  takeRecords() { return []; } unobserve() {}
}
globalThis.IntersectionObserver = TestIntersectionObserver;
