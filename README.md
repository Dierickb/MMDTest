# MMDTest

Esta pagina se desarrolla partiendo del framewoek Node.js para poder ejecutar 
JavaScript del lado del servidor. Se recurre a este framework principalmente 
por su caracteristica de usar el modelo de entrada y salida sin bloqueso y 
controlado por eventos y se mantiene NPM como el gestor de paquetes por defectos de Node.

Como motor de plantillas se optó por EJS que significa JavaScript integrado, con
esto podemos escribir marcado HTML, pero nos permite ejecutar codigo o logica de programacion
en tiempo de ejecución antes de enviar el HTML al navegador antes de su visualización. 
Por otro lado el que nos permita crear vistas parciales facilita crear el sitio web
y el mantenimiento del mismo, ademas de poder reutilizar HTML en varias paginas.

La pagina implementa el framework Bootstrap para ayudar o facilitar a construit una web responsive,
sin embargo tambien se utiliza CSS con el mismo proposito, pero tambien con esto
se logra personalizar aun mas el diseño la pagina.


Se hace uso de las siguientes librerias:
* Argon-2
* Express
* Express-validator
* Express-session
* Express-flash
* Dotenv
* Morgan
* MySQL
* EJS



