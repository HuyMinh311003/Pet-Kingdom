import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductEditModal from "../../../components/admin/products/ProductEditModal";
import { Product } from "../../../types/admin";
import { categoryApi } from "../../../services/admin-api/categoryApi";
import { productApi } from "../../../services/admin-api/productApi";
import "./ProductsPage.css";


interface Category {
  _id: string;
  name: string;
  type: "pet" | "tool";
  isActive: boolean;
  children?: Category[];
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

const findLeaf = (nodes: Category[]): Category | null => {
  for (const n of nodes) {
    if (!n.children || n.children.length === 0) return n;
    const leaf = findLeaf(n.children);
    if (leaf) return leaf;
  }
  return null;
};

const ProductsPage: React.FC = () => {
  const { categoryId: paramCatId } = useParams<{ categoryId?: string }>();

  // STATES
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [productType, setProductType] = useState<"pet" | "tool">("tool");
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    isActive: true,
    stock: 0,
    price: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevTypeRef = useRef<"pet" | "tool">(productType);
  // 1) Load all categories (active only)
  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => {
        if (res.success) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error("Fetch categories error:", err));
  }, []);

  // 2) Choose default category once categories arrive
  useEffect(() => {
    if (!categories.length) return;

    const defaultCat =
      (paramCatId && findNode(categories, paramCatId)) || findLeaf(categories);

    if (defaultCat) {
      setSelectedCategory(defaultCat);
    }
  }, [categories, paramCatId]);

  useEffect(() => {
    if (!selectedCategory) return;

    const newType = selectedCategory.type;
    // Nếu type thay đổi so với trước đó → reset toàn bộ form
    if (prevTypeRef.current !== newType) {
      setProductType(newType);
      setNewProduct({
        categoryId: selectedCategory._id,
        isActive: true,
        stock: newType === "pet" ? 1 : 0,
        price: 0,
        // reset thêm các field khác tùy type:
        ...(newType === "pet"
          ? { birthday: "", gender: undefined, vaccinated: undefined }
          : { brand: "", /* tool-specific */ }
        )
      });
    } else {
      // Cùng type thì chỉ update categoryId, giữ nguyên các giá trị khác
      setNewProduct(prev => ({
        ...prev,
        categoryId: selectedCategory._id
      }));
    }
    // Cập nhật lại prevType
    prevTypeRef.current = newType;
    productApi
      .getProductsByCategory(selectedCategory._id)
      .then(res => {
        if (res.success) setProducts(res.data.products);
      })
      .catch(err => console.error("Fetch products error:", err));
  }, [selectedCategory]);


  // 4) Handler khi user chọn category khác từ dropdown
  const handleCategoryChange = (catId: string) => {
    const cat = findNode(categories, catId);
    if (cat) {
      setSelectedCategory(cat);
    }
  };

  // 5) Update document.title
  useEffect(() => {
    if (selectedCategory) {
      document.title = `${selectedCategory.name} Products - Pet Kingdom Admin`;
    } else {
      document.title = "All Products - Pet Kingdom Admin";
    }
  }, [selectedCategory]);

  // IMAGE UPLOAD
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

  // ADD NEW PRODUCT
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // validate
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

    // build payload
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
        // reset form + reload list
        setNewProduct({
          categoryId: selectedCategory!._id,
          isActive: true,
          stock: selectedCategory!.type === "pet" ? 1 : 0,
          price: 0,
          // reset các field khác nếu cần:
          name: "",
          description: "",
          brand: "",
          birthday: "",
          gender: undefined,
          vaccinated: undefined
        });
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (selectedCategory) {
          const listRes = await productApi.getProductsByCategory(
            selectedCategory._id
          );
          if (listRes.success) {
            setProducts(listRes.data.products);
          }
        }
      } else {
        alert("Create failed: " + res.message);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Error creating product");
    }
  };

  // UPDATE PRODUCT (chỉ mock state)
  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    const product = products.find((p) => p.id === id);
    if (!product) return alert("Product not found");

    const type = updates.type || product.type;

    // Validate theo type
    if (type === "pet") {
      if (
        updates.birthday === undefined ||
        updates.gender === undefined ||
        updates.vaccinated === undefined
      ) {
        alert("Pet update missing fields: birthday, gender, vaccinated");
        return;
      }
    } else if (type === "tool") {
      if (
        updates.brand === undefined ||
        updates.stock === undefined
      ) {
        alert("Tool update missing fields: brand, stock");
        return;
      }
    }

    const res = await productApi.updateProduct(id, updates);
    if (res.success) {
      setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } else {
      alert("Update failed: " + res.message);
    }
  } catch (err) {
    console.error("Error updating product:", err);
    alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
  }
};


  // DELETE PRODUCT
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?"))
      return;
    try {
      const res = await productApi.deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Xoá thất bại: " + res.message);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Đã có lỗi khi xoá sản phẩm.");
    }
  };

  // EDIT MODAL
  const handleEditClick = (product: Product) => {
      console.log("Clicked Edit Product:", product); // 👉 ADD THIS LINE
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };
  const handleSaveProduct = (updated: Product) => {
    handleUpdateProduct(updated.id, updated);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Product Management</h1>
      </div>

      <div className="products-grid">
        {/* —————————————————————— ADD FORM —————————————————————— */}
        <form onSubmit={handleAddProduct} className="add-product-form">
          <h2>Add new product</h2>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <select
              id="productCategory"
              value={selectedCategory?._id || ""}
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

          {/* Name */}
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              placeholder="Product Name"
              value={newProduct.name || ""}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              placeholder="Description"
              value={newProduct.description || ""}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* Pet-specific */}
          {productType === "pet" && (
            <>
              <div className="form-group">
                <label htmlFor="productBirthday">Birthday</label>
                <input
                  id="productBirthday"
                  type="date"
                  value={newProduct.birthday || ""}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      birthday: e.target.value,
                    }))
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
                    setNewProduct((prev) => ({
                      ...prev,
                      gender: e.target.value as "male" | "female",
                    }))
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
                    setNewProduct((prev) => ({
                      ...prev,
                      vaccinated: e.target.value === "true",
                    }))
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

          {/* Tool-specific */}
          {productType === "tool" && (
            <>
              <div className="form-group">
                <label htmlFor="productBrand">Brand</label>
                <input
                  id="productBrand"
                  type="text"
                  value={newProduct.brand || ""}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      brand: e.target.value,
                    }))
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
                  value={newProduct.stock ?? ""}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      stock: Number(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </>
          )}

          {/* Price */}
          <div className="form-group">
            <label htmlFor="productPrice">Price (VND)</label>
            <input
              id="productPrice"
              type="number"
              min="0"
              step="1000"
              value={newProduct.price ?? ""}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  price: parseInt(e.target.value, 10),
                }))
              }
              required
            />
          </div>

          {/* Image */}
          <div className="form-group">
            <label htmlFor="productImage">Product Image</label>
            <input
              ref={fileInputRef}
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

        {/* —————————————————————— LIST PRODUCTS —————————————————————— */}
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
                  className={`status-btn ${product.isActive ? "active" : "inactive"
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

      {/* EDIT MODAL */}
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
