import React, { useEffect, useState } from 'react';
import './ProductEditModal.css';
import { Product as AdminProduct } from '../../../types/admin';

interface Product extends AdminProduct {
  [key: string]: string | number | boolean | undefined;
}

interface Category {
  _id: string;
  name: string;
  type: "pet" | "tool";
  isActive: boolean;
}

interface ProductEditModalProps {
  product: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [productType, setProductType] = useState<'pet' | 'tool'>('tool');

  useEffect(() => {
    setEditedProduct(product);
    if (product) {
      const category = categories.find(c => c._id === product.categoryId);
      setSelectedCategory(category);
      setProductType(category?.type || 'tool');
    }
  }, [product, categories]);

  if (!isOpen || !editedProduct) return null;

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    setSelectedCategory(category);
    const type = category?.type || 'tool';
    setProductType(type);
    
    setEditedProduct({
      ...editedProduct,
      categoryId,
      // Reset type-specific fields
      birthday: undefined,
      gender: undefined,
      vaccinated: undefined,
      brand: undefined,
      // Set appropriate stock
      stock: type === 'pet' ? 1 : 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      // Validate based on product type
      if (productType === 'pet') {
        if (!editedProduct.birthday || !editedProduct.gender || editedProduct.vaccinated === undefined) {
          alert('Please fill in all required fields for pets (Birthday, Gender, Vaccination Status)');
          return;
        }
        // Force stock to be 1 for pets
        editedProduct.stock = 1;
      } else {
        if (!editedProduct.brand || !editedProduct.stock || editedProduct.stock < 0) {
          alert('Please fill in all required fields for tools (Brand, Stock)');
          return;
        }
      }
      
      onSave({
        ...editedProduct,
        type: productType,
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-product-form">
          <div className="form-group">
            <label htmlFor="editName">Product Name</label>
            <input
              id="editName"
              type="text"
              value={editedProduct.name}
              onChange={e => setEditedProduct({ ...editedProduct, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editCategory">Category</label>
            <select
              id="editCategory"
              value={editedProduct.categoryId}
              onChange={e => handleCategoryChange(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editDescription">Description</label>
            <textarea
              id="editDescription"
              value={editedProduct.description}
              onChange={e => setEditedProduct({ ...editedProduct, description: e.target.value })}
              required
            />
          </div>

          {/* Pet-specific fields */}
          {productType === 'pet' && (
            <>
              <div className="form-group">
                <label htmlFor="editBirthday">Birthday</label>
                <input
                  id="editBirthday"
                  type="date"
                  value={editedProduct.birthday || ''}
                  onChange={e => setEditedProduct({ ...editedProduct, birthday: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editGender">Gender</label>
                <select
                  id="editGender"
                  value={editedProduct.gender || ''}
                  onChange={e => setEditedProduct({ ...editedProduct, gender: e.target.value as 'male' | 'female' })}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editVaccinated">Vaccination Status</label>
                <select
                  id="editVaccinated"
                  value={String(editedProduct.vaccinated)}
                  onChange={e => setEditedProduct({ ...editedProduct, vaccinated: e.target.value === 'true' })}
                  required
                >
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
          {productType === 'tool' && (
            <>
              <div className="form-group">
                <label htmlFor="editBrand">Brand</label>
                <input
                  id="editBrand"
                  type="text"
                  value={typeof editedProduct.brand === "string" ? editedProduct.brand : (typeof editedProduct.brand === "number" ? String(editedProduct.brand) : "")}
                  onChange={e => setEditedProduct({ ...editedProduct, brand: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editStock">Stock</label>
                <input
                  id="editStock"
                  type="number"
                  min="0"
                  value={typeof editedProduct.stock === "number" ? editedProduct.stock : (typeof editedProduct.stock === "string" ? editedProduct.stock : "")}
                  onChange={e => setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="editPrice">Price (VND)</label>
            <input
              id="editPrice"
              type="number"
              min="0"
              step="1000"
              value={editedProduct.price}
              onChange={e => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editImage">Product Image</label>
            <input
              id="editImage"
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files?.[0]) {
                  // TODO: Implement image upload and get URL
                  setEditedProduct({
                    ...editedProduct,
                    imageUrl: URL.createObjectURL(e.target.files[0]),
                  });
                }
              }}
            />
            {editedProduct.imageUrl && (
              <img
                src={editedProduct.imageUrl}
                alt="Product preview"
                className="image-preview"
              />
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;