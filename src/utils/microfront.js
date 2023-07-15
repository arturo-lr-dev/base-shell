import store from './store';

class SanMicroFront extends HTMLElement {
    static loadedMicroFronts = {}; // Añade un objeto estático para llevar un registro de los microfronts que se han cargado

    constructor() {
      super();
      this.script = document.createElement('script');
    }
  
    connectedCallback() {
      try {
        this.name = this.name || this.getAttribute('name');
        this.webComponent = this.webComponent || this.getAttribute('webComponent');
        this.exposedModule = this.exposedModule || this.getAttribute('exposedModule');
        this.remoteEntry = this.remoteEntry || this.getAttribute('remoteEntry');
        this.props = JSON.parse(this.props || '{}') || JSON.parse(this.getAttribute('props') || '{}');
        this.events = JSON.parse(this.events || '{}') || JSON.parse(this.getAttribute('events') || '{}');
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
      // Verifica si el microfront ya se ha cargado
      if (SanMicroFront.loadedMicroFronts[this.remoteEntry]) {
        console.log(`Microfront at ${this.remoteEntry} already loaded, skipping...`);
        this.render(); // Si ya se cargó, simplemente renderiza el componente
        return;
      }

      this.script.src = this.remoteEntry;

      this.script.onerror = (error) => {
        console.error(`Error loading ${this.remoteEntry}:`, error);
      };
  
      this.script.onload = async () => {
        const container = window[this.name];
        if (!container) {
          console.error(`Could not find container for ${this.name}`);
          return;
        }
        
        container.init({});

        const factory = await container.get(this.exposedModule);
        if (!factory) {
          console.error(`Could not load module ${this.exposedModule} from container ${this.name}`);
          return;
        }
  
        const Module = factory();
        this.module = Module;
        SanMicroFront.loadedMicroFronts[this.remoteEntry] = true; // Marca el microfront como cargado

        this.render();
      };
  
      document.head.appendChild(this.script);
    }
  
    render() {
      try {
        const element = document.createElement(this.webComponent);
        element.store = store;

        Object.entries(this.props).forEach(([key, value]) => {
          element[key] = value;
        });
  
        Object.entries(this.events).forEach(([eventName, handlerName]) => {
          this.listeners = this.listeners || [];
          this.listeners.push({element, eventName, handler: window[handlerName]});
          element.addEventListener(eventName, window[handlerName]);
        });
  
        this.appendChild(element);
      } catch (error) {
        console.error('Error al renderizar el componente:', error);
      }
    }
  }
  
  customElements.define('san-microfront', SanMicroFront);
