import Home from './pages/customer/home/Home';
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProductList from './components/products/ProductList';
import CustomerLayout from './layouts/CustomerLayout';
import { CartProvider } from './contexts/CartContext';
import ProfilePage from './components/profile/ProfilePage';
function App() {

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/profile/*" element={<ProfilePage />} />
          </Route>

        </Routes>

      </Router>
    </CartProvider>
  );
}

export default App;
