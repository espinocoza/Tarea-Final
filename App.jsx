import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import ProductList from './components/ProductList.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import Cart from './components/Cart.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/Loader.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [limit, setLimit] = useState(20)
  const [skip, setSkip] = useState(0)
  const [sortBy, setSortBy] = useState('title')
  const [order, setOrder] = useState('asc')
  // Descripciones se muestran en inglés tal como las entrega la API

  // Cart state
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p))
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, qty: 1 }]
    })
  }
  const removeFromCart = (id) => setCartItems((prev) => prev.filter((p) => p.id !== id))
  const changeQty = (id, delta) => setCartItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p)))
  const clearCart = () => setCartItems([])

  // Persist cart in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setCartItems(parsed)
      }
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  // Close with ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setShowCart(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onCheckout = () => {
    // Simulación de checkout: en proyecto real se integraría con un backend/pasarela
    alert(`Checkout:\nArtículos: ${cartItems.reduce((a,i)=>a+i.qty,0)}\nTotal: $${cartItems.reduce((a,i)=>a+i.price*i.qty,0).toFixed(2)}`)
  }

  useEffect(() => {
    let isMounted = true
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const base = selectedCategory === 'all'
          ? 'https://dummyjson.com/products'
          : `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}`
        const params = new URLSearchParams({ limit: String(limit), skip: String(skip), sortBy, order, select: 'title,price,thumbnail,category,description,id' })
        const url = `${base}?${params.toString()}`
        console.log('[App] Fetching:', url)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (isMounted) setProducts(Array.isArray(data?.products) ? data.products : [])
      } catch (err) {
        if (isMounted) setError('No se pudieron cargar los productos. Intenta nuevamente más tarde.')
        console.error('[App] Fetch error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => { isMounted = false }
  }, [limit, skip, sortBy, order, selectedCategory])

  // Fetch categories once (use category-list which returns array of strings)
  useEffect(() => {
    let mounted = true
    async function fetchCategories() {
      try {
        const res = await fetch('https://dummyjson.com/products/category-list')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (mounted) setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
    return () => { mounted = false }
  }, [])

  // Traducción manual eliminada

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return products
    return products.filter(p => (
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    ))
  }, [searchTerm, products])

  return (
    <div className="app">
      <Header cartCount={cartItems.reduce((acc, it) => acc + it.qty, 0)} onToggleCart={() => setShowCart((v) => !v)} />
      <main className="container">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="controls">
          <CategoryFilter categories={['all', ...categories]} selected={selectedCategory} onChange={setSelectedCategory} />
          <div className="query-controls">
            <label>
              Límite
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                {[10,20,30,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label>
              Saltar
              <select value={skip} onChange={(e) => setSkip(Number(e.target.value))}>
                {[0,10,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label>
              Ordenar por
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {['title','price','rating'].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <label>
              Orden
              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                {['asc','desc'].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            
          </div>
        </div>

        {loading && <Loader label="Cargando productos..." />}
        {!loading && error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <ProductList products={filtered} onAddToCart={addToCart} />
        )}

        {showCart && (
          <>
            <div className="overlay" onClick={() => setShowCart(false)} />
            <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Carrito de compras">
              <Cart items={cartItems} onRemove={removeFromCart} onChangeQty={changeQty} onClear={clearCart} onCheckout={onCheckout} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
