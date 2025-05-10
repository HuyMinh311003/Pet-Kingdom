// SidebarFilter.tsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './SidebarFilter.css';

export interface Category {
  _id: string;
  name: string;
  type: 'pet' | 'tool';
  children?: Category[];
}

interface Props {
  categories: Category[];   // nested tree from API
  selected: string[];       // chỉ chứa các id bạn muốn filter
  onSelect: (id: string) => void;
}

const SidebarFilter: React.FC<Props> = ({
  categories,
  selected,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState<'pet' | 'tool'>('pet');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };


  const renderNode = (cat: Category, level = 0) => {
    const hasKids = !!(cat.children && cat.children.length);
    const isOpen = expanded.has(cat._id);

    return (
      <li key={cat._id} className={`filter-item ${selected.includes(cat._id) ? 'selected' : ''}`}>
        <div className="filter-item-container" style={{ paddingLeft: `${16 + level * 16}px` }}>
          {hasKids
            ? <button className="filter-expand-btn" onClick={() => toggleExpand(cat._id)}>
              <ChevronRight className={`filter-arrow ${isOpen ? 'rotated' : ''}`} size={16} />
            </button>
            : <div style={{ width: '20px' }} />}

          {/* Khi click tên: chỉ select đúng id đó */}
          <span
            className="filter-text"
            onClick={() => onSelect(cat._id)}
          >
            {cat.name}
          </span>

        </div>

        {/* con chỉ hiện khi isOpen */}
        {hasKids && isOpen && (
          <ul className="filter-sublist">
            {cat.children!.map(c => renderNode(c, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  const roots = categories.filter(c => c.type === activeTab);

  return (
    <div className="sidebar-filter">
      <div className="filter-tabs">
        <button className={`tab-btn ${activeTab === 'pet' ? 'active' : ''}`} onClick={() => setActiveTab('pet')}>Thú cưng</button>
        <button className={`tab-btn ${activeTab === 'tool' ? 'active' : ''}`} onClick={() => setActiveTab('tool')}>Vật dụng</button>
      </div>
      <div className="filter-tree">
        <ul className="filter-list">
          {roots.map(r => renderNode(r))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarFilter;
