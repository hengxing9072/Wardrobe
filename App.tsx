import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './services/firebase';
import { ClothingItem } from './types';
import { WardrobeGallery } from './components/WardrobeGallery';
import { Modal } from './components/Modal';
import { AddClothingForm } from './components/AddClothingForm';
import { Auth } from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemsLoading, setIsItemsLoading] = useState(false);

  // Check Firebase Config
  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg border-l-4 border-amber-500">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Firebase Setup Required</h2>
          <p className="text-slate-600 mb-4">
            To enable cloud storage and login, you need to configure Firebase.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg mb-4">
            <li>Open <code className="bg-slate-200 px-1 rounded">services/firebase.ts</code></li>
            <li>Replace the placeholder config with your own Firebase project configuration.</li>
            <li>Save the file.</li>
          </ol>
          <p className="text-xs text-slate-400">
            See the comments in services/firebase.ts for more details.
          </p>
        </div>
      </div>
    );
  }

  // Handle Auth State
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Items from Firestore
  useEffect(() => {
    if (!user || !db) {
      setItems([]);
      return;
    }

    setIsItemsLoading(true);
    // Path: users/{userId}/wardrobe
    const wardrobeRef = collection(db, 'users', user.uid, 'wardrobe');
    const q = query(wardrobeRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to number if needed, or handle it here
        createdAt: doc.data().createdAt?.toMillis() || Date.now()
      })) as ClothingItem[];
      
      setItems(newItems);
      setIsItemsLoading(false);
    }, (error) => {
      console.error("Error fetching wardrobe:", error);
      setIsItemsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddItem = async (newItem: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    if (!user || !db) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'wardrobe'), {
        ...newItem,
        createdAt: serverTimestamp(), // Use server timestamp for consistency
        userId: user.uid
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to save item to cloud.");
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const handleClearSearch = () => setSearchQuery('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 hidden sm:block">MyWardrobe</h1>
            </div>

            {/* Search and Action */}
            <div className="flex items-center gap-3 flex-1 md:justify-end w-full md:w-auto">
              <div className="relative flex-1 max-w-md group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600"
                  >
                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline font-medium">Add</span>
              </button>

              <div className="h-6 w-px bg-slate-300 mx-1"></div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 hidden lg:block">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
        
        {/* Active Filters Display */}
        {searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
             <div className="flex items-center text-sm text-slate-500">
                <span>Filtering by:</span>
                <span className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-100">
                  "{searchQuery}"
                </span>
             </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isItemsLoading ? (
           <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              <p>Loading your wardrobe...</p>
           </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-8 px-4 pt-8 md:pt-0">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                {searchQuery ? 'Search Results' : 'Your Collection'}
              </h2>
              <p className="text-slate-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cloud wardrobe
              </p>
            </div>
            
            <WardrobeGallery items={items} searchQuery={searchQuery} />
            
            <div className="text-center mt-8 text-slate-400 text-sm flex items-center justify-center gap-2 pb-8 md:pb-0">
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              <span>Drag horizontally to explore</span>
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Clothing"
      >
        <AddClothingForm 
          onAdd={handleAddItem}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default App;
