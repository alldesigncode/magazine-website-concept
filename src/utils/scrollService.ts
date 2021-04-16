import Scrollbar from 'smooth-scrollbar';

/**
 * Helper Singleton Service to store shared data.
 */
export class ScrollService {
    static instance: ScrollService;
  
    horizontalScrollDisabled = false;
    horizontalScrollRef: Scrollbar;
    
    constructor() {
        if (!ScrollService.instance) {
          ScrollService.instance = this;
        }
    
        return ScrollService.instance;
    }
  }