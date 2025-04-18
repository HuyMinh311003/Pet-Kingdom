import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductEditModal from "../../../components/admin/products/ProductEditModal";
import "./ProductsPage.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  type: "pet" | "tool";
  isActive: boolean;
}

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    isActive: true,
    stock: 0,
    price: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // TODO: Fetch categories and products from API
    // For now using mock data
    setCategories([
      { id: "1", name: "Dogs", type: "pet", isActive: true },
      { id: "2", name: "Cats", type: "pet", isActive: true },
      { id: "3", name: "Pet Tools", type: "tool", isActive: true },
    ]);

    // Mock products data
    const mockProducts = [
      {
        id: "1",
        name: "Golden Retriever Puppy",
        description: "Friendly and intelligent puppy",
        price: 15000000,
        categoryId: "1",
        stock: 3,
        imageUrl: "/mock/golden.jpg",
        isActive: true,
      },
      // Add more mock products as needed
    ];

    // Filter products by category if categoryId is provided
    if (categoryId) {
      setProducts(
        mockProducts.filter((product) => product.categoryId === categoryId)
      );
    } else {
      setProducts(mockProducts);
    }
  }, [categoryId]);

  // Update page title based on category
  useEffect(() => {
    const currentCategory = categories.find((cat) => cat.id === categoryId);
    document.title = currentCategory
      ? `${currentCategory.name} Products - Pet Kingdom Admin`
      : "All Products - Pet Kingdom Admin";
  }, [categoryId, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
      // TODO: Implement image upload and get URL
      setNewProduct({
        ...newProduct,
        imageUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to add product
    setProducts([
      ...products,
      { ...newProduct, id: Date.now().toString() } as Product,
    ]);
    setNewProduct({ isActive: true, stock: 0, price: 0 });
    setSelectedImage(null);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    // TODO: Implement API call to update product
    setProducts(
      products.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const handleDeleteProduct = (id: string) => {
    // TODO: Implement API call to delete product
    setProducts(products.filter((prod) => prod.id !== id));
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    handleUpdateProduct(updatedProduct.id, updatedProduct);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Product Management</h1>
        <button className="add-product-btn">Add New Product</button>
      </div>

      <div className="products-grid">
        <form onSubmit={handleAddProduct} className="add-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
            aria-label="Product Name"
          />

          <label htmlFor="productCategory">Category</label>
          <select
            id="productCategory"
            value={newProduct.categoryId || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, categoryId: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="productDescription">Description</label>
          <textarea
            id="productDescription"
            placeholder="Description"
            value={newProduct.description || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            required
          />

          <div className="number-inputs">
            <div>
              <label htmlFor="productPrice">Price (VND)</label>
              <input
                id="productPrice"
                type="number"
                min="0"
                step="1000"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <label htmlFor="productStock">Stock</label>
              <input
                id="productStock"
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: Number(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="image-upload">
            <label htmlFor="productImage">Product Image</label>
            <input
              id="productImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Product preview"
                className="image-preview"
              />
            )}
          </div>

          <button type="submit">Add Product</button>
        </form>

        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-details">
                  <span className="price">
                    {product.price.toLocaleString()} VND
                  </span>
                  <span className="stock">Stock: {product.stock}</span>
                </div>
              </div>
              <div className="product-actions">
                <button
                  className={`status-btn ${
                    product.isActive ? "active" : "inactive"
                  }`}
                  onClick={() =>
                    handleUpdateProduct(product.id, {
                      isActive: !product.isActive,
                    })
                  }
                >
                  {product.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductEditModal
        product={selectedProduct}
        categories={categories}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductsPage;
