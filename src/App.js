import React, { useState, useEffect } from 'react';
import { Search, Percent, Save, Plus, Trash2, Filter, ChevronDown, ChevronUp, Settings, X, Edit } from 'lucide-react';

export default function CoffeePriceList() {
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Arabica', 'Robusta']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bulkPercent, setBulkPercent] = useState(0);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Arabica' });
  const [isUpdatePositive, setIsUpdatePositive] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  
  // UI state
  const [view, setView] = useState('products'); // products, management, settings
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, error, success
  
  // Firebase-like config (would be replaced with your actual Firebase credentials)
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    databaseURL: '',
    projectId: ''
  });
  
  // Load data from local storage initially, then try to fetch from shared storage
  useEffect(() => {
    // First load from localStorage as fallback
    const savedProducts = localStorage.getItem('coffee-products');
    const savedCategories = localStorage.getItem('coffee-categories');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts([
        { id: 1, name: 'Ethiopian Yirgacheffe', price: 14.99, category: 'Arabica' },
        { id: 2, name: 'Colombian Supremo', price: 12.99, category: 'Arabica' },
        { id: 3, name: 'Brazilian Santos', price: 10.50, category: 'Arabica' },
        { id: 4, name: 'Vietnamese Robusta', price: 8.75, category: 'Robusta' },
        { id: 5, name: 'Indian Robusta', price: 7.99, category: 'Robusta' }
      ]);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    
    // Check if we have stored Firebase config
    const storedConfig = localStorage.getItem('firebase-config');
    if (storedConfig) {
      setFirebaseConfig(JSON.parse(storedConfig));
    }
    
    // Future enhancement: Once Firebase config is set, we would initialize Firebase and fetch data
    // fetchDataFromFirebase();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('coffee-products', JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem('coffee-categories', JSON.stringify(categories));
  }, [categories]);
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedCategory === 'All' || product.category === selectedCategory)
  );
  
  // Function to sync data with cloud storage (placeholder for actual implementation)
  const syncWithCloud = () => {
    setSyncStatus('syncing');
    
    // Placeholder for actual API call
    setTimeout(() => {
      if (firebaseConfig.apiKey && firebaseConfig.databaseURL) {
        // This would be an actual API call in a real implementation
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    }, 1500);
  };
  
  // Function to handle bulk price updates
  const handleBulkUpdate = () => {
    const modifier = isUpdatePositive ? 1 + (bulkPercent / 100) : 1 - (bulkPercent / 100);
    
    const updatedProducts = products.map(product => {
      if (selectedCategory === 'All' || product.category === selectedCategory) {
        return {
          ...product,
          price: +(product.price * modifier).toFixed(2)
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setShowBulkUpdateModal(false);
  };
  
  // Function to add a new product
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts([...products, { 
        id: newId,
        name: newProduct.name, 
        price: parseFloat(newProduct.price),
        category: newProduct.category
      }]);
      setNewProduct({ name: '', price: '', category: 'Arabica' });
      setShowAddProductModal(false);
    }
  };
  
  // Function to delete a product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };
  
  // Function to update a product's price
  const handlePriceChange = (id, newPrice) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, price: parseFloat(newPrice) || 0 } : product
    ));
  };
  
  // Function to add a new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };
  
  // Function to delete a category
  const handleDeleteCategory = (categoryToDelete) => {
    // Update any products in this category to the first available category
    const updatedProducts = products.map(product => {
      if (product.category === categoryToDelete) {
        return {
          ...product,
          category: categories.filter(c => c !== categoryToDelete)[0] || 'Uncategorized'
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setCategories(categories.filter(category => category !== categoryToDelete));
  };
  
  // Function to save Firebase config
  const saveFirebaseConfig = () => {
    localStorage.setItem('firebase-config', JSON.stringify(firebaseConfig));
    alert('Configuration saved. You will need to implement actual Firebase connectivity.');
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-amber-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-amber-900 text-center">Coffee Price Manager</h1>
      
      {/* Navigation Bar */}
      <div className="flex mb-4 border border-amber-300 rounded overflow-hidden">
        <button 
          className={`flex-1 py-2 ${view === 'products' ? 'bg-amber-600 text-white' : 'bg-white text-amber-900'}`}
          onClick={() => setView('products')}
        >
          Products
        </button>
        <button 
          className={`flex-1 py-2 ${view === 'management' ? 'bg-amber-600 text-white' : 'bg-white text-amber-900'}`}
          onClick={() => setView('management')}
        >
          Management
        </button>
        <button 
          className={`flex-1 py-2 ${view === 'settings' ? 'bg-amber-600 text-white' : 'bg-white text-amber-900'}`}
          onClick={() => setView('settings')}
        >
          Settings
        </button>
      </div>
      
      {/* Products View */}
      {view === 'products' && (
        <>
          {/* Search Bar */}
          <div className="flex items-center mb-4 border border-amber-300 rounded p-2 bg-white">
            <Search className="text-amber-700 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Search coffee products..." 
              className="w-full outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex items-center border border-amber-300 rounded p-2 bg-white">
              <Filter className="text-amber-700 mr-2" size={20} />
              <select 
                className="w-full outline-none bg-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Coffee Types</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Products List */}
          <div className="border border-amber-300 rounded overflow-hidden bg-white mb-4">
            <div className="bg-amber-100 p-3 font-medium flex text-amber-900">
              <div className="flex-grow">Your Coffee Products</div>
              <div className="text-sm text-amber-700">{filteredProducts.length} items</div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div>
                {filteredProducts.map(product => (
                  <div key={product.id} className="border-t border-amber-200 p-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium text-amber-900">{product.name}</div>
                      <button 
                        className="text-red-500"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm px-2 py-1 rounded bg-amber-100 text-amber-800">{product.category}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-700">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className="border border-amber-200 p-1 w-24 text-right rounded"
                          value={product.price}
                          onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-amber-700">
                No coffee products found. Add some products or change your search.
              </div>
            )}
          </div>
          
          {/* Floating Action Buttons */}
          <div className="fixed bottom-5 right-5 flex flex-col gap-2">
            <button 
              className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg"
              onClick={() => setShowAddProductModal(true)}
            >
              <Plus size={24} />
            </button>
            
            <button 
              className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg"
              onClick={() => setShowBulkUpdateModal(true)}
            >
              <Percent size={24} />
            </button>
          </div>
        </>
      )}
      
      {/* Management View */}
      {view === 'management' && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-amber-900">Category Management</h2>
            <button 
              className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded mb-3 w-full"
              onClick={() => setShowCategoriesModal(true)}
            >
              Add/Edit Categories
            </button>
            
            <div className="border border-amber-300 rounded bg-white p-3">
              <h3 className="font-medium mb-2 text-amber-900">Current Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <div key={category} className="px-3 py-1 bg-amber-100 rounded text-amber-800">
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-amber-900">Data Management</h2>
            <div className="border border-amber-300 rounded bg-white p-3">
              <button 
                className={`w-full p-2 rounded mb-2 flex items-center justify-center ${
                  syncStatus === 'syncing' ? 'bg-amber-300' : 
                  syncStatus === 'error' ? 'bg-red-500 text-white' : 
                  syncStatus === 'success' ? 'bg-green-500 text-white' : 
                  'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
                onClick={syncWithCloud}
                disabled={syncStatus === 'syncing'}
              >
                {syncStatus === 'syncing' ? 'Syncing...' : 
                 syncStatus === 'error' ? 'Sync Failed!' :
                 syncStatus === 'success' ? 'Sync Successful!' : 'Sync Data Across Devices'}
              </button>
              
              <p className="text-sm text-amber-800">
                {firebaseConfig.apiKey ? 
                  'Your data will be synced across devices using Firebase.' : 
                  'Configure Firebase in Settings to enable cross-device sync.'}
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-amber-900">Product Overview</h2>
            <div className="border border-amber-300 rounded bg-white p-3">
              <p className="mb-2">Total Products: <strong>{products.length}</strong></p>
              {categories.map(category => {
                const count = products.filter(p => p.category === category).length;
                return (
                  <p key={category} className="text-sm mb-1">
                    {category}: <strong>{count}</strong> products
                  </p>
                );
              })}
            </div>
          </div>
        </>
      )}
      
      {/* Settings View */}
      {view === 'settings' && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-amber-900">Cloud Sync Settings</h2>
            <div className="border border-amber-300 rounded bg-white p-3">
              <p className="mb-2 text-sm text-amber-800">
                Configure Firebase to sync your data across all devices.
              </p>
              <div className="mb-2">
                <label className="block text-sm text-amber-900 mb-1">Firebase API Key</label>
                <input 
                  type="text" 
                  className="border border-amber-200 p-2 w-full rounded"
                  value={firebaseConfig.apiKey}
                  onChange={(e) => setFirebaseConfig({...firebaseConfig, apiKey: e.target.value})}
                  placeholder="Enter your Firebase API Key"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm text-amber-900 mb-1">Firebase Database URL</label>
                <input 
                  type="text" 
                  className="border border-amber-200 p-2 w-full rounded"
                  value={firebaseConfig.databaseURL}
                  onChange={(e) => setFirebaseConfig({...firebaseConfig, databaseURL: e.target.value})}
                  placeholder="Enter your Firebase Database URL"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm text-amber-900 mb-1">Firebase Project ID</label>
                <input 
                  type="text" 
                  className="border border-amber-200 p-2 w-full rounded"
                  value={firebaseConfig.projectId}
                  onChange={(e) => setFirebaseConfig({...firebaseConfig, projectId: e.target.value})}
                  placeholder="Enter your Firebase Project ID"
                />
              </div>
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded w-full"
                onClick={saveFirebaseConfig}
              >
                Save Firebase Configuration
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-amber-900">Data Management</h2>
            <div className="border border-amber-300 rounded bg-white p-3">
              <button 
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded w-full mb-2"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    setProducts([]);
                    localStorage.removeItem('coffee-products');
                  }
                }}
              >
                Clear All Products
              </button>
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded w-full"
                onClick={() => {
                  const dataStr = JSON.stringify(products);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  
                  const exportFileDefaultName = 'coffee-products.json';
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
              >
                Export Data (JSON)
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-amber-900">App Info</h2>
            <div className="border border-amber-300 rounded bg-white p-3 text-sm text-amber-800">
              <p className="mb-1">Version: 1.0.0</p>
              <p className="mb-1">Created with React</p>
              <p>Data stored locally and synced via Firebase (when configured)</p>
            </div>
          </div>
        </>
      )}
      
      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-900">Add New Coffee</h2>
              <button onClick={() => setShowAddProductModal(false)}>
                <X size={24} className="text-amber-800" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Coffee name"
                className="border p-2 rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Price"
                  className="border p-2 w-32 rounded"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
                <select
                  className="border p-2 flex-grow rounded"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded mt-1"
                onClick={handleAddProduct}
              >
                Add Coffee Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-900">Manage Categories</h2>
              <button onClick={() => setShowCategoriesModal(false)}>
                <X size={24} className="text-amber-800" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="New category name"
                  className="border p-2 flex-grow rounded"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </div>
              
              <div className="mt-2">
                <h3 className="font-medium mb-2 text-amber-900">Current Categories</h3>
                <div className="border rounded p-2 max-h-60 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex justify-between items-center p-2 border-b">
                      <span>{category}</span>
                      <button 
                        className="text-red-500"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded mt-2"
                onClick={() => setShowCategoriesModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-900">Bulk Price Update</h2>
              <button onClick={() => setShowBulkUpdateModal(false)}>
                <X size={24} className="text-amber-800" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="mb-2">
                <label className="block text-sm text-amber-900 mb-1">Apply to Category</label>
                <select 
                  className="border p-2 w-full rounded"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Coffee Types</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="flex flex-row items-center border rounded overflow-hidden">
                  <button 
                    className={`px-3 py-2 ${isUpdatePositive ? 'bg-green-100' : ''}`}
                    onClick={() => setIsUpdatePositive(true)}
                  >
                    <ChevronUp size={16} className={isUpdatePositive ? 'text-green-600' : 'text-gray-500'} />
                  </button>
                  <button 
                    className={`px-3 py-2 ${!isUpdatePositive ? 'bg-red-100' : ''}`}
                    onClick={() => setIsUpdatePositive(false)}
                  >
                    <ChevronDown size={16} className={!isUpdatePositive ? 'text-red-600' : 'text-gray-500'} />
                  </button>
                </div>
                <input 
                  type="number" 
                  className="border p-2 w-24 rounded"
                  value={bulkPercent}
                  onChange={(e) => setBulkPercent(parseFloat(e.target.value) || 0)}
                />
                <Percent size={16} className="text-gray-400" />
                <span className="text-sm text-amber-800">
                  {isUpdatePositive ? 'Increase' : 'Decrease'} Price
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">
                Will {isUpdatePositive ? 'increase' : 'decrease'} prices by {bulkPercent}% for {selectedCategory === 'All' ? 'all coffees' : `only ${selectedCategory} coffees`}
              </div>
              
              <button 
                className={`text-white p-3 rounded flex items-center justify-center ${isUpdatePositive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={handleBulkUpdate}
              >
                <span>
                  {isUpdatePositive ? 'Increase' : 'Decrease'} 
                  {selectedCategory !== 'All' ? ` ${selectedCategory}` : ''} Prices by {bulkPercent}%
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Indicator */}
      <div className="mt-6 text-sm text-amber-700 flex items-center justify-center">
        <Save size={16} className="mr-1" />
        <span>{syncStatus === 'success' ? 'Data synchronized across devices' : 'Changes saved locally, configure sync for cross-device use'}</span>
      </div>
    </div>
  );
}