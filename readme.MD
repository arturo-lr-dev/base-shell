<san-microfront
    name="vue"
    web-element="vue-element"
    exposed-module="./web-components"
    remoteEntry="http://localhost:4205/remoteEntry.js" 
    props='{"foo": "value"}' 
    events='{"fooEvent": "fooHandler"}'>
</san-microfront>


<san-web-component 
    web-component="lazy-image" 
    url="https://unpkg.com/@power-elements/lazy-image/lazy-image.js"
    props='{"src": "https://allthings.how/content/images/size/w2000/wordpress/2021/02/allthings.how-how-to-make-everything-smaller-in-windows-10-computer-display-resolution.png"}'>
</san-web-component>