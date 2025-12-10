import React, { useRef, useState, useEffect } from 'react';
import { ClothingItem } from '../types';
import { Tag } from './Tag';

interface WardrobeGalleryProps {
  items: ClothingItem[];
  searchQuery: string;
}

export const WardrobeGallery: React.FC<WardrobeGalleryProps> = ({ items, searchQuery }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Filter items based on search query (name or tags)
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesTag = item.tags.some(tag => tag.toLowerCase().includes(query));
    return matchesName || matchesTag;
  });

  // Mouse Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fastness
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl m-4 bg-slate-50/50">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg font-medium">No clothes found</p>
        <p className="text-sm">Try adding items or adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="relative group w-full h-[600px] overflow-hidden flex items-center bg-gradient-to-b from-slate-100 to-white">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-8 px-8 sm:px-16 overflow-x-auto overflow-y-hidden no-scrollbar h-full items-center cursor-grab active:cursor-grabbing pb-8 pt-4 snap-x snap-mandatory md:snap-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 relative w-[300px] sm:w-[360px] h-[500px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden snap-center select-none"
          >
            {/* Image Section */}
            <div className="h-[70%] w-full overflow-hidden relative bg-gray-50">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </div>

            {/* Info Section */}
            <div className="h-[30%] p-6 flex flex-col justify-between bg-white relative z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{item.name}</h3>
                <div className="flex flex-wrap gap-1 max-h-[60px] overflow-hidden">
                  {item.tags.slice(0, 4).map(tag => (
                    <Tag key={tag} label={tag} />
                  ))}
                  {item.tags.length > 4 && (
                     <span className="text-xs text-slate-400 py-1 px-1">+{item.tags.length - 4} more</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Added {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {/* Spacer for right padding in scroll view */}
        <div className="w-8 flex-shrink-0" /> 
      </div>
      
      {/* Scroll Hints */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-md flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:flex">
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-md flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:flex">
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
};