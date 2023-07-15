import { Constant } from './constant';

class Store {
  constructor() {
    // Comprueba si ya existe una instancia de Store en el localStorage
    const storedData = localStorage.getItem(Constant.KEY_STORE);
    if (storedData) {
      console.debug('Returning existing instance of Store from localStorage');
      this.data = JSON.parse(storedData); // Recupera los datos almacenados
    } else {
      this.data = {}; // Inicializa los datos si no hay datos almacenados
    }

    this.subscribers = new Set(); // Almacena los suscriptores de la tienda
  }

  // Suscribirse a las actualizaciones de la tienda
  subscribe(callback) {
    console.debug('Subscribing to store updates');
    this.subscribers.add(callback); // Agrega la función de devolución de llamada al conjunto de suscriptores
    callback(JSON.parse(localStorage.getItem(Constant.KEY_STORE))); // Llama inicialmente a la función de devolución de llamada con los datos actuales
  }

  // Cancelar la suscripción a las actualizaciones de la tienda
  unsubscribe(callback) {
    console.debug('Unsubscribing from store updates');
    this.subscribers.delete(callback); // Elimina la función de devolución de llamada del conjunto de suscriptores
  }

  // Actualizar los datos de la tienda
  update(newData) {
    if (typeof newData === 'object' && newData !== null) {
      console.debug('Updating store data');
      this.data = { ...JSON.parse(localStorage.getItem(Constant.KEY_STORE)), ...newData }; // Fusiona los datos existentes con los nuevos datos proporcionados
      // Guarda los datos actualizados en el localStorage
      localStorage.setItem(Constant.KEY_STORE, JSON.stringify(this.data));
      this.notify(); // Notifica a los suscriptores sobre el cambio de datos
    } else {
      console.error('Error: Only objects can be added to the store.');
    }
  }

  // Notificar a los suscriptores sobre los cambios en los datos de la tienda
  notify() {
    console.debug('Notifying subscribers');
    this.subscribers.forEach((callback) => {
      callback(JSON.parse(localStorage.getItem(Constant.KEY_STORE))); // Llama a cada función de devolución de llamada con los datos actuales
    });
  }
}

// Exporta una instancia única de la clase Store
export default new Store();
