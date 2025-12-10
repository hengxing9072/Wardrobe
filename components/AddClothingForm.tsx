import React, { useState, useRef } from 'react';
import { generateTagsForImage } from '../services/geminiService';
import { Tag } from './Tag';
import { ClothingItem } from '../types';

interface AddClothingFormProps {
  onAdd: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const AddClothingForm: React.FC<AddClothingFormProps> = ({ onAdd, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const suggestedTags = await generateTagsForImage(base64);
      // Merge tags avoiding duplicates
      setTags(prev => Array.from(new Set([...prev, ...suggestedTags])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !name) return;
    onAdd({ image, name, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Image Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden group
          ${image ? 'border-transparent' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
        `}
      >
        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white font-medium">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-sm text-slate-600">Click to upload photo</p>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      {/* Inputs */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Favorite Denim Jacket"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-slate-700">Tags</label>
          {isAnalyzing && <span className="text-xs text-indigo-600 animate-pulse font-medium">✨ AI generating tags...</span>}
        </div>
        <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
          {tags.map(tag => (
            <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} variant="highlight" />
          ))}
        </div>
        <input
          type="text"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type tag and hit Enter..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-sm"
        />
        <p className="text-xs text-slate-400 mt-1">Tip: Upload an image to get automatic tags.</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!image || !name}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          Add to Wardrobe
        </button>
      </div>
    </form>
  );
};