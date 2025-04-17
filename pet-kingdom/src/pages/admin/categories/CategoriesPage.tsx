import React, { useState, useEffect } from 'react';
import { Category } from '../../../types/admin';
import './CategoriesPage.css';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    type: 'pet',
    isActive: true,
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    // TODO: Fetch categories from API
    // Using mock data for now
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Dogs',
        type: 'pet',
        description: 'All breeds of dogs',
        isActive: true
      },
      {
        id: '2',
        name: 'Cats',
        type: 'pet',
        description: 'All breeds of cats',
        isActive: true
      },
      {
        id: '3',
        name: 'Pet Tools',
        type: 'tool',
        description: 'Essential tools for pet care',
        isActive: true
      }
    ];
    setCategories(mockCategories);
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to add category
    setCategories([...categories, {
      ...newCategory,
      id: Date.now().toString()
    } as Category]);
    setNewCategory({
      type: 'pet',
      isActive: true,
    });
    setIsAddingCategory(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    // TODO: Implement API call to update category
    setCategories(categories.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    // TODO: Implement API call to delete category
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleStatusToggle = (id: string, isActive: boolean) => {
    // TODO: Implement API call to update category status
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, isActive } : cat
    ));
  };

  const categoryForm = (
    category: Partial<Category>,
    onSubmit: (e: React.FormEvent) => void,
    onCancel: () => void,
    submitText: string
  ) => (
    <form onSubmit={onSubmit} className="category-form">
      <div className="form-group">
        <label htmlFor="categoryName">Category Name</label>
        <input
          id="categoryName"
          type="text"
          required
          value={category.name || ''}
          onChange={e => {
            if (editingCategory) {
              setEditingCategory({ ...editingCategory, name: e.target.value });
            } else {
              setNewCategory({ ...newCategory, name: e.target.value });
            }
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryType">Type</label>
        <select
          id="categoryType"
          required
          value={category.type}
          onChange={e => {
            if (editingCategory) {
              setEditingCategory({ ...editingCategory, type: e.target.value as 'pet' | 'tool' });
            } else {
              setNewCategory({ ...newCategory, type: e.target.value as 'pet' | 'tool' });
            }
          }}
        >
          <option value="pet">Pet</option>
          <option value="tool">Tool</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="categoryDescription">Description</label>
        <textarea
          id="categoryDescription"
          value={category.description || ''}
          onChange={e => {
            if (editingCategory) {
              setEditingCategory({ ...editingCategory, description: e.target.value });
            } else {
              setNewCategory({ ...newCategory, description: e.target.value });
            }
          }}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          {submitText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Categories Management</h1>
        <button
          className="add-category-btn"
          onClick={() => setIsAddingCategory(true)}
        >
          Add New Category
        </button>
      </div>

      {isAddingCategory && (
        <div className="category-form-container">
          {categoryForm(newCategory, handleAddCategory, () => setIsAddingCategory(false), 'Add Category')}
        </div>
      )}

      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            {editingCategory?.id === category.id ? (
              categoryForm(editingCategory, handleUpdateCategory, () => setEditingCategory(null), 'Update Category')
            ) : (
              <>
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className={`type-badge ${category.type}`}>
                    {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                  </span>
                </div>

                <p className="category-description">{category.description}</p>

                <div className="category-actions">
                  <button
                    className={`status-toggle-btn ${category.isActive ? 'deactivate' : 'activate'}`}
                    onClick={() => handleStatusToggle(category.id, !category.isActive)}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;