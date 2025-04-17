import React, { useEffect, useState } from 'react';
import './ProductEditModal.css';
import { Product, Category } from '../../../types/admin';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  if (!isOpen || !editedProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      onSave(editedProduct);
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
      // TODO: Implement image upload and get URL
      setEditedProduct({
        ...editedProduct,
        imageUrl: URL.createObjectURL(e.target.files[0]),
      });
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
              onChange={e => setEditedProduct({ ...editedProduct, categoryId: e.target.value })}
              required
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
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

          <div className="form-row">
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
              <label htmlFor="editStock">Stock</label>
              <input
                id="editStock"
                type="number"
                min="0"
                value={editedProduct.stock}
                onChange={e => setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="editImage">Product Image</label>
            <input
              id="editImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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