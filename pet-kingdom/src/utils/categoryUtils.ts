export interface CategoryNode {
    _id: string;
    name: string;
    parent: string | null;
    type: 'pet' | 'tool';
    children?: CategoryNode[];
  }
  
  /**
   * Đệ quy flatten tất cả các node trong cây thành mảng phẳng
   */
  export function flattenCategories(nodes: CategoryNode[]): CategoryNode[] {
    const result: CategoryNode[] = [];
    nodes.forEach(node => {
      result.push(node);
      if (node.children) {
        result.push(...flattenCategories(node.children));
      }
    });
    return result;
  }
  