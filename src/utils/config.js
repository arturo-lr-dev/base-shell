// Microfont repos from https://www.npmjs.com/package/@angular-architects/module-federation-tools

 window['config'] = {
    "microfronts": {
        "vue": {
            "name": "vue",
            "webComponent": "vue-element",
            "exposedModule": "./web-components",
            "remoteEntry": "http://localhost:4205/remoteEntry.js",
            "props": '{"foo": "value"}',
            "events": '{"fooEvent": "fooHandler"}'
        },
    
        "angular12": {
            "name": "angular3",
            "webComponent": "angular3-element",
            "exposedModule": "./web-components",
            "remoteEntry": "http://localhost:4202/remoteEntry.js",
        },
    
        "angular-last": {
            "name": "angular",
            "webComponent": "angular-element-16",
            "exposedModule": "./web-components",
            "remoteEntry": "http://localhost:4200/remoteEntry.js"
        },
    
        "react": {
            "name": "react",
            "webComponent": "react-element",
            "exposedModule": "./web-components",
            "remoteEntry": "http://localhost:4204/remoteEntry.js",
        }
    },
    "elements": {
        "image": {
            "webComponent": "lazy-image",
            "url": "https://unpkg.com/@power-elements/lazy-image/lazy-image.js",
            "props": '{"src": "https://allthings.how/content/images/size/w2000/wordpress/2021/02/allthings.how-how-to-make-everything-smaller-in-windows-10-computer-display-resolution.png"}'
        },
        "image-2": {
            "webComponent": "lazy-image",
            "url": "https://unpkg.com/@power-elements/lazy-image/lazy-image.js",
            "props": '{"src": "https://allthings.how/content/images/size/w2000/wordpress/2021/02/allthings.how-how-to-make-everything-smaller-in-windows-10-computer-display-resolution.png"}'
        }
    }
};

function loadConfig() {
    const microfronts = window['config'].microfronts;
    Object.keys(microfronts).forEach(mfe => {
        const element = document.createElement('san-microfront');
        Object.keys(microfronts[mfe]).forEach(prop => {
            element[prop] = microfronts[mfe][prop];
        });
        document.body.appendChild(element);
    });

    const elements = window['config'].elements;
    Object.keys(elements).forEach(elem => {
        const element = document.createElement('san-web-component');
        Object.keys(elements[elem]).forEach(prop => {
            element[prop] = elements[elem][prop];
        });
        document.body.appendChild(element);
    });

}

loadConfig();

// Prueba de duplicar
setTimeout(() => {
    // loadConfig();
}, 10000)