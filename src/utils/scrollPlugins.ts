import { ScrollbarPlugin } from 'smooth-scrollbar';
import { ScrollService } from './scrollService';

export class HorizontalScrollPlugin extends ScrollbarPlugin {
    static pluginName = "horizontalScroll";

    private scrollService = new ScrollService();
  
    transformDelta(delta, fromEvent) {
      if (!/wheel/.test(fromEvent.type)) {
        return delta;
      }
  
      const { x, y } = delta;
  
      if (this.scrollService.horizontalScrollDisabled) {
        return delta;
      } else {
        return {
          y: 0,
          x: Math.abs(x) > Math.abs(y) ? x : y
        };
      }
    }
  }


  export class ModalPlugin extends ScrollbarPlugin {
    static pluginName = 'modal';
  
    static defaultOptions = {
      open: false,
    };
  
    transformDelta(delta) {
      return this.options.open ? { x: 0, y: 0 } : delta;
    }
  }
  