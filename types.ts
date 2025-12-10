export interface ClothingItem {
  id: string;
  image: string; // Base64 string
  name: string;
  tags: string[];
  createdAt: number;
}

export type SortOption = 'newest' | 'oldest' | 'name';
