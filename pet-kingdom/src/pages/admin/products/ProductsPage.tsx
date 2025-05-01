import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductEditModal from "../../../components/admin/products/ProductEditModal";
import { Product as AdminProduct } from "../../../types/admin";
import api from "../../../services/admin-api/axiosConfig";
import "./ProductsPage.css";
import { productApi } from "../../../services/admin-api/productApi";

interface Product extends AdminProduct {
  [key: string]: string | number | boolean | undefined;
}

interface Category {
  _id: string;
  name: string;
  type: "pet" | "tool";
  isActive: boolean;
  children?: Category[];
}
interface Option {
  _id: string;
  path: string;
}
const findNode = (nodes: Category[], id: string): Category | undefined => {
  for (const n of nodes) {
    if (n._id === id) return n;
    if (n.children) {
      const hit = findNode(n.children, id);
      if (hit) return hit;
    }
  }
  return undefined;
};
const ProductsPage: React.FC = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [productType, setProductType] = useState<"pet" | "tool">("tool");
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    isActive: true,
    stock: 0,
    price: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        console.log("Categories response:", response.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: { categoryId },
        });
        setProducts(response.data.data.products);
        if (categoryId) {
          const cat = findNode(categories, categoryId);
          if (cat) setProductType(cat.type);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [categories, categoryId]);

  useEffect(() => {
    const opts: Option[] = [];
    const traverse = (nodes: Category[], parent: string) => {
      nodes.forEach((n) => {
        const curr = parent ? `${parent}/${n.name}` : n.name;
        if (n.children && n.children.length) {
          traverse(n.children, curr);
        } else {
          opts.push({ _id: n._id, path: curr });
        }
      });
    };
    traverse(categories, "");
    setOptions(opts);
  }, [categories]);

  // Update page title based on category
  useEffect(() => {
    const currentCategory = categories.find((cat) => cat._id === categoryId);
    document.title = currentCategory
      ? `${currentCategory.name} Products - Pet Kingdom Admin`
      : "All Products - Pet Kingdom Admin";
  }, [categoryId, categories]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await productApi.uploadImage(formData);
      setNewProduct((prev) => ({ ...prev, imageUrl: uploadRes.url }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = findNode(categories, categoryId);
    setSelectedCategory(category);
    const type = category?.type || "tool";
    setProductType(type);

    setNewProduct({
      ...newProduct,
      categoryId,
      // Reset type-specific fields
      birthday: undefined,
      gender: undefined,
      vaccinated: undefined,
      brand: undefined,
      // Set appropriate stock
      stock: type === "pet" ? 1 : 0,
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    // A. Validate
    if (productType === "pet") {
      if (
        !newProduct.birthday ||
        !newProduct.gender ||
        newProduct.vaccinated === undefined
      ) {
        alert("Fill Birthday, Gender, Vaccination");
        return;
      }
    } else {
      if (
        !newProduct.brand ||
        newProduct.stock === undefined ||
        newProduct.stock < 0
      ) {
        alert("Fill Brand và Stock >= 0");
        return;
      }
    }

    // B. Build payload
    const payload: any = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      categoryId: newProduct.categoryId,
      type: productType,
      stock: productType === "pet" ? 1 : newProduct.stock,
      imageUrl: newProduct.imageUrl,
      isActive: newProduct.isActive,
    };
    if (productType === "pet") {
      payload.birthday = newProduct.birthday;
      payload.gender = newProduct.gender;
      payload.vaccinated = newProduct.vaccinated;
    }
    if (productType === "tool") {
      payload.brand = newProduct.brand;
    }

    try {
      const res = await productApi.createProduct(payload);
      if (res.success) {
        // C. Reset form + reload list
        setNewProduct({
          isActive: true,
          stock: productType === "pet" ? 1 : 0,
          price: 0,
        });
        setSelectedImage(null);
        const prodRes = await productApi.getProducts({ category: categoryId });
        setProducts(prodRes.data.products);
      } else {
        alert("Create failed: " + res.message);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Error creating product");
    }
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    // TODO: Implement API call to update product
    setProducts(
      products.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      return;
    }

    try {
      const res = await productApi.deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((prod) => prod.id !== id));
      } else {
        alert("Xoá thất bại: " + res.message);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Đã có lỗi khi xoá sản phẩm.");
    }
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
      </div>

      <div className="products-grid">
        <form onSubmit={handleAddProduct} className="add-product-form">
          <h2>Add new product</h2>

          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              placeholder="Product Name"
              value={newProduct.name || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <select
              id="productCategory"
              value={newProduct.categoryId || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              {categories.map((parent) =>
                parent.children && parent.children.length ? (
                  <optgroup key={parent._id} label={parent.name}>
                    {parent.children.map((child) => (
                      <option key={child._id} value={child._id}>
                        {child.name}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={parent._id} value={parent._id}>
                    {parent.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
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
          </div>

          {/* Pet-specific fields */}
          {productType === "pet" && (
            <>
              <div className="form-group">
                <label htmlFor="productBirthday">Birthday</label>
                <input
                  id="productBirthday"
                  type="date"
                  value={newProduct.birthday || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, birthday: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productGender">Gender</label>
                <select
                  id="productGender"
                  value={newProduct.gender || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      gender: e.target.value as "male" | "female",
                    })
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="productVaccinated">Vaccination Status</label>
                <select
                  id="productVaccinated"
                  value={
                    newProduct.vaccinated !== undefined
                      ? String(newProduct.vaccinated)
                      : ""
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      vaccinated: e.target.value === "true",
                    })
                  }
                  required
                >
                  <option value="">Select Vaccination Status</option>
                  <option value="true">Vaccinated</option>
                  <option value="false">Not Vaccinated</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value="1"
                  disabled
                  title="Pets can only have stock of 1"
                />
              </div>
            </>
          )}

          {/* Tool-specific fields */}
          {productType === "tool" && (
            <>
              <div className="form-group">
                <label htmlFor="productBrand">Brand</label>
                <input
                  id="productBrand"
                  type="text"
                  value={
                    typeof newProduct.brand === "string"
                      ? newProduct.brand
                      : typeof newProduct.brand === "number"
                      ? String(newProduct.brand)
                      : ""
                  }
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productStock">Stock</label>
                <input
                  id="productStock"
                  type="number"
                  min="0"
                  value={
                    typeof newProduct.stock === "number"
                      ? newProduct.stock
                      : typeof newProduct.stock === "string"
                      ? newProduct.stock
                      : ""
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
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
                  price: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="form-group">
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
