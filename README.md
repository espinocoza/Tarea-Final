# React E‑Commerce (DummyJSON)

Aplicación de e‑commerce en React + Vite que consume la API pública DummyJSON para renderizar productos dinámicamente.  
Incluye búsqueda por nombre/categoría, estados de carga y error, componentes reutilizables y un diseño responsivo.

## Componentes

- `Header.jsx`: logo/nombre y subtítulo del e‑commerce.
- `SearchBar.jsx`: input controlado para búsqueda.
- `Loader.jsx`: indicador visual de carga.
- `ErrorMessage.jsx`: muestra errores cuando falla la API.
- `ProductCard.jsx`: muestra producto con `title`, `price`, `category`, `thumbnail`, `description`.
- `ProductList.jsx`: renderiza la grilla de productos.
- `Footer.jsx`: información básica y año.

## Consumo de API

- Endpoint: `https://dummyjson.com/products?limit=100`
- Se usa `fetch` dentro de `useEffect` en `App.jsx`.
- Manejo de estados: `loading`, `error`, `products` y `searchTerm`.

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Opcionalmente:

```bash
# Crear build de producción
npm run build

# Previsualizar el build
npm run preview
```

## Tecnologías

- React
- Vite

## Responsividad y estética

- Grilla responsiva con `grid` y `minmax`.
- Tipografías del sistema, buen contraste y espaciado.
- Loader y mensajes de error con estilos consistentes.

## Nuevas funcionalidades

- Filtro por categoría: usa `GET /products/categories` y `GET /products/category/:name`.
- Paginación y orden: parámetros `limit`, `skip`, `sortBy`, `order`.
- Carrito de compras: añade, elimina y cambia cantidad; total calculado.

## Screenshots

- Vista general: ./screenshots/home.png
- Loading y búsqueda: ./screenshots/search.png

## Entrega en GitHub

- Repositorio público: https://github.com/espinocoza/Tarea-Final
- Demo en GitHub Pages:  https://espinocoza.github.io/Tarea-Final/
- Contiene README con descripción, componentes, instrucciones de ejecución, tecnologías y capturas.

## Créditos de imágenes

- Imágenes/miniaturas provistas por DummyJSON para fines demostrativos.


