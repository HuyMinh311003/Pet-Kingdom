import React from 'react';
import { Category } from '../../../types/admin';
import './CategoryForm.css';
import { Checkbox, FormControlLabel } from '@mui/material';

interface CategoryFormProps {
  category: Partial<Category>;
  availableParents: Category[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<Category>) => void;
  onCancel: () => void;
  submitText: string;
  isNew?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  availableParents,
  onSubmit,
  onChange,
  onCancel,
  submitText,
  isNew = false
}) => {
  // Lọc danh sách parent hợp lệ để tránh circular reference
  const validParents = availableParents.filter(p => p._id !== category._id);

  return (
    <form onSubmit={onSubmit} className="category-form">
      <div className="form-header">
        <h2>{isNew ? 'Add New Category' : 'Edit Category'}</h2>
        <p>Configure the category settings below</p>
      </div>

      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name *</label>
          <input
            id="categoryName"
            type="text"
            required
            value={category.name || ''}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Enter category name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryType">Category Type *</label>
          <select
            id="categoryType"
            required
            value={category.type}
            onChange={e => onChange({ type: e.target.value as 'pet' | 'tool' })}
          >
            <option value="pet">Pet</option>
            <option value="tool">Tool</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="categoryParent">Parent Category</label>
          <select
            id="categoryParent"
            value={category.parent || ''}
            onChange={e => onChange({ parent: e.target.value || null })}
          >
            <option value="">No Parent (Top Level)</option>
            {validParents.map(parent => (
              <option key={parent._id} value={parent._id}>
                {parent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <div className="c-form-group">
          <FormControlLabel
            control={
              <Checkbox
                checked={category.isActive}
                onChange={e => onChange({ isActive: e.target.checked })}
                color="primary"
              />
            }
            label="Active"
          />
          <small>Inactive categories will not be visible to customers</small>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;