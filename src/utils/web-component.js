import store from './store';

class SanWebComponent extends HTMLElement {
    static loadedWebComponent = {};

    constructor() {
      super();
      this.script = document.createElement('script');
    }
  
    connectedCallback() {
      try {
        this.webComponent = this.webComponent || this.getAttribute('web-component');
        this.url = this.url || this.getAttribute('url');
        this.props = this.props ? JSON.parse(this.props) : JSON.parse(this.getAttribute('props') || '{}');
        this.events = this.events ? JSON.parse(this.events) : JSON.parse(this.getAttribute('events') || '{}');
      } catch (error) {
        console.error('Error al parsear las props o los eventos:', error);
      }
  
      this.loadComponent();
    }

    disconnectedCallback() {
      this.script.parentNode.removeChild(this.script);
  
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }

      if (this.listeners) {
        this.listeners.forEach(({element, eventName, handler}) => {
          element.removeEventListener(eventName, handler);
        });
      }
    }
  
    async loadComponent() {
      if (SanWebComponent.loadedWebComponent[this.url]) {
        console.log(`WebComponent at ${this.url} already loaded, waiting...`);
        await this.waitForComponent(); // Espera a que se cargue el componente
        this.render(); // Renderiza el componente una vez que esté cargado
        return;
      }
      
      this.script.src = this.url;
      SanWebComponent.loadedWebComponent[this.url] = {
        promise: null,
        loaded: false
      };
    
      this.script.onerror = (error) => {
        console.error(`Error loading ${this.url}:`, error);
      };
    
      this.script.onload = async () => {
        SanWebComponent.loadedWebComponent[this.url].loaded = true;
        if (SanWebComponent.loadedWebComponent[this.url].promise) {
          SanWebComponent.loadedWebComponent[this.url].promise.resolve();
        }
        this.render();
      };
    
      document.head.appendChild(this.script);
    }
    
    waitForComponent() {
      return new Promise((resolve) => {
        if (SanWebComponent.loadedWebComponent[this.url].loaded) {
          resolve();
        } else {
          SanWebComponent.loadedWebComponent[this.url].promise = { resolve };
        }
      });
    }
  
    render() {
      try {
        const element = document.createElement(this.webComponent);
        element.store = store;
        
        while (this.childNodes.length > 0) {
          const child = this.childNodes[0];
          element.appendChild(child);
        }

        this.appendChild(element);

        Object.entries(this.props).forEach(([key, value]) => {
          element[key] = value;
        });
    
        Object.entries(this.events).forEach(([eventName, handlerName]) => {
          this.listeners = this.listeners || [];
          this.listeners.push({ element, eventName, handler: window[handlerName] });
          element.addEventListener(eventName, window[handlerName]);
        });

        
      } catch (error) {
        console.error('Error al renderizar el componente:', error);
      }
    }
  }
  
  customElements.define('san-web-component', SanWebComponent);
