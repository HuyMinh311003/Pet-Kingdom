import React, { useState, useEffect } from 'react';
import { Category } from '../../../types/admin';
import SidebarPreview from '../../../components/admin/categories/SidebarPreview';
import CategoryForm from '../../../components/admin/categories/CategoryForm';
import { categoryApi } from '../../../services/admin-api/categoryApi';
import './CategoriesPage.css';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    type: 'pet',
    isActive: true,
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories(true);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleToggleMenu = (categoryId: string) => {
    setActiveMenus(current =>
      current.includes(categoryId)
        ? current.filter(id => id !== categoryId)
        : [...current, categoryId]
    );
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsAddingCategory(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await categoryApi.createCategory(newCategory);
      if (res.success) {
        await fetchCategories();
        setIsAddingCategory(false);
        setNewCategory({ type: 'pet', isActive: true});
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory?._id) return;

    try {
      const res = await categoryApi.updateCategory(selectedCategory._id, selectedCategory);
      if (res.success) {
        await fetchCategories();
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this category? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const res = await categoryApi.deleteCategory(id);
      if (res.success) {
        await fetchCategories();
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Could not delete category. It may have subcategories or products.');
    }
  };

  const handleStatusToggle = async (id: string) => {
    try {
      const res = await categoryApi.toggleCategoryStatus(id);
      if (res.success) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Could not toggle category status. It may have active subcategories.');
    }
  };

  // Get all categories except the current one being edited (to avoid circular references)
  const availableParents = categories.filter(
    cat => cat._id !== selectedCategory?._id
  );

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Categories Management</h1>
        <button
          className="add-category-btn"
          onClick={() => {
            setIsAddingCategory(true);
            setSelectedCategory(null);
          }}
        >
          Add New Category
        </button>
      </div>

      <div className="categories-container">
        <div className="preview-container">
          <SidebarPreview
            categories={categories}
            activeMenus={activeMenus}
            onToggleMenu={handleToggleMenu}
            onSelectCategory={handleSelectCategory}
            onDeleteCategory={handleDeleteCategory}
            onToggleStatus={handleStatusToggle}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="form-container">
          {isAddingCategory ? (
            <CategoryForm
              category={newCategory}
              availableParents={availableParents}
              onSubmit={handleAddCategory}
              onChange={updates =>
                setNewCategory(current => ({ ...current, ...updates }))
              }
              onCancel={() => setIsAddingCategory(false)}
              submitText="Add Category"
              isNew={true}
            />
          ) : selectedCategory ? (
            <CategoryForm
              category={selectedCategory}
              availableParents={availableParents}
              onSubmit={handleUpdateCategory}
              onChange={updates =>
                setSelectedCategory(current =>
                  current ? { ...current, ...updates } : null
                )
              }
              onCancel={() => setSelectedCategory(null)}
              submitText="Update Category"
            />
          ) : (
            <div className="no-selection">
              <h2>No Category Selected</h2>
              <p>
                Select a category from the preview to edit it, or click "Add New
                Category" to create one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
