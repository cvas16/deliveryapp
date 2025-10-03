# Delivery App

## Descripción
Este proyecto es una aplicación de entrega que permite a los usuarios registrarse, iniciar sesión y gestionar sus pedidos. La aplicación está dividida en dos partes: el backend y el frontend.

## Estructura del Proyecto
```
delivery-app
├── backend
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── .gitignore
│   └── js
│       ├── admin.js
│       ├── auth.js
│       ├── cart.js
│       ├── dashboard.js
│       ├── main.js
│       └── utils.js
├── frontend
│   ├── index.html
│   ├── admin.html
│   ├── dashboard.html
│   ├── orders.html
│   ├── register.html
│   ├── main.js
│   ├── counter.js
│   ├── script.js
│   ├── style.css
│   ├── styles.css
│   └── assets
│       ├── javascript.svg
│       └── vite.svg
├── README.md
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega a la carpeta del proyecto:
   ```
   cd delivery-app
   ```

3. Instala las dependencias del backend:
   ```
   cd backend
   npm install
   ```

4. Instala las dependencias del frontend:
   ```
   cd ../frontend
   npm install
   ```

## Uso

1. Inicia el servidor backend:
   ```
   cd backend
   node server.js
   ```

2. Abre el archivo `index.html` en un navegador para acceder a la aplicación frontend.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT.