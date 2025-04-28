import React from 'react';
import { ChevronRight, Trash2, Power } from 'lucide-react';
import { Category } from '../../../types/admin';
import './SidebarPreview.css';

interface SidebarPreviewProps {
  categories: Category[];
  activeMenus: string[];
  onToggleMenu: (categoryId: string) => void;
  onSelectCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onToggleStatus: (id: string) => void;
  selectedCategory: Category | null;
}

const STATIC_TABS = [
  {
    _id: 'pets',
    name: 'Thú cưng',
    type: 'pet',
    isActive: true,
    children: []
  },
  {
    _id: 'accessories', 
    name: 'Vật dụng',
    type: 'tool',
    isActive: true,
    children: []
  }
];

const SidebarPreview: React.FC<SidebarPreviewProps> = ({
  categories,
  activeMenus,
  onToggleMenu,
  onSelectCategory,
  onDeleteCategory,
  onToggleStatus,
  selectedCategory
}) => {
  // Group categories by type
  const petCategories = categories.filter(cat => cat.type === 'pet');
  const toolCategories = categories.filter(cat => cat.type === 'tool');

  // Add categories as children to static tabs
  const staticTabsWithChildren = STATIC_TABS.map(tab => {
    if (tab.type === 'pet') {
      return { ...tab, children: petCategories };
    }
    if (tab.type === 'tool') {
      return { ...tab, children: toolCategories };
    }
    return tab;
  });

  const renderMenuItems = (items: Category[], level: number = 0) => {
    // Sort items by order before rendering
    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <ul className={`preview-menu-list ${level > 0 ? 'preview-submenu' : ''}`}>
        {sortedItems.map((item) => {
          const hasChildren = (item.children?.length ?? 0) > 0;
          
          return (
          <li 
            key={item._id} 
            className={`preview-menu-item ${selectedCategory?._id === item._id ? 'selected' : ''}`}
            style={{ paddingLeft: `${level * 16}px` }}
          >
            <div className="preview-menu-button-container">
              <span 
                className={`preview-menu-text ${!item.isActive ? 'inactive' : ''}`}
                onClick={() => onSelectCategory(item)}
                title={`${item.name}${!item.isActive ? ' (Inactive)' : ''}`}
              >
                {item.name}
                {!item.isActive && <span className="inactive-badge">Inactive</span>}
                {level > 0 && <span className="order-badge" title="Display Order">
                  {item.order || 0}
                </span>}
              </span>
              <div className="preview-actions">
                {level > 0 && (
                  <>
                    <button
                      className="preview-action-btn"
                      onClick={() => onToggleStatus(item._id)}
                      title={item.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power size={16} className={item.isActive ? 'active' : ''} />
                    </button>
                    <button
                      className="preview-action-btn delete"
                      onClick={() => onDeleteCategory(item._id)}
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                {hasChildren && (
                  <button
                    className="preview-chevron-button"
                    onClick={() => onToggleMenu(item._id)}
                    title={activeMenus.includes(item._id) ? 'Collapse' : 'Expand'}
                  >
                    <ChevronRight 
                      className={`preview-menu-arrow ${activeMenus.includes(item._id) ? 'rotated' : ''}`}
                      size={18}
                    />
                  </button>
                )}
              </div>
            </div>
            {hasChildren && activeMenus.includes(item._id) && (
              <div className={`preview-submenu-container ${activeMenus.includes(item._id) ? 'open' : ''}`}>
                {renderMenuItems(item.children!, level + 1)}
              </div>
            )}
          </li>
        )})}
      </ul>
    );
  };

  return (
    <div className="sidebar-preview">
      <div className="preview-header">
        <h2>Category Tree</h2>
        <p>Click on a category to edit it. Categories are displayed in order.</p>
      </div>
      <div className="preview-sidebar">
        {renderMenuItems(staticTabsWithChildren)}
      </div>
    </div>
  );
};

export default SidebarPreview;