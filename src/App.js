import { useState, useEffect } from 'react';
import { Search, Percent, Save, Plus, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function CoffeePriceList() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('coffee-products');
    return savedProducts ? JSON.parse(savedProducts) : [
      { id: 1, name: 'Ethiopian Yirgacheffe', price: 14.99, category: 'Arabica' },
      { id: 2, name: 'Colombian Supremo', price: 12.99, category: 'Arabica' },
      { id: 3, name: 'Brazilian Santos', price: 10.50, category: 'Arabica' },
      { id: 4, name: 'Vietnamese Robusta', price: 8.75, category: 'Robusta' },
      { id: 5, name: 'Indian Robusta', price: 7.99, category: 'Robusta' }
    ];
  });
  
  const [categories] = useState(['Arabica', 'Robusta']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bulkPercent, setBulkPercent] = useState(0);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Arabica' });
  const [isUpdatePositive, setIsUpdatePositive] = useState(true);
  
  useEffect(() => {
    localStorage.setItem('coffee-products', JSON.stringify(products));
  }, [products]);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedCategory === 'All' || product.category === selectedCategory)
  );
  
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
  };
  
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
    }
  };
  
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };
  
  const handlePriceChange = (id, newPrice) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, price: parseFloat(newPrice) || 0 } : product
    ));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-amber-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-brown-800 text-center">Coffee Price Manager</h1>
      
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
        <div className="flex items-center border border-amber-300 rounded p-2 mb-2 bg-white">
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
      
      {/* Bulk Update */}
      <div className="flex flex-col mb-6 border border-amber-300 rounded p-3 bg-white">
        <h2 className="font-medium mb-2 text-amber-900">Bulk Price Update</h2>
        <div className="flex items-center gap-2 mb-2">
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
            className="border p-2 w-20 rounded"
            value={bulkPercent}
            onChange={(e) => setBulkPercent(parseFloat(e.target.value) || 0)}
          />
          <Percent size={16} className="text-gray-400" />
          <button 
            className={`text-white px-4 py-2 rounded flex items-center ${isUpdatePositive ? 'bg-green-600' : 'bg-red-600'}`}
            onClick={handleBulkUpdate}
          >
            <span className="mr-1">
              {isUpdatePositive ? 'Increase' : 'Decrease'} 
              {selectedCategory !== 'All' ? ` ${selectedCategory}` : ''} Prices
            </span>
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Will {isUpdatePositive ? 'increase' : 'decrease'} prices by {bulkPercent}% for {selectedCategory === 'All' ? 'all coffees' : `only ${selectedCategory} coffees`}
        </div>
      </div>
      
      {/* Add New Product */}
      <div className="flex flex-col mb-6 border border-amber-300 rounded p-3 bg-white">
        <h2 className="font-medium mb-2 text-amber-900">Add New Coffee</h2>
        <div className="flex flex-col gap-2">
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
            className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded mt-1"
            onClick={handleAddProduct}
          >
            Add Coffee Product
          </button>
        </div>
      </div>
      
      {/* Products List */}
      <div className="border border-amber-300 rounded overflow-hidden bg-white">
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
      
      {/* Save Indicator */}
      <div className="mt-4 text-right text-sm text-amber-700 flex items-center justify-end">
        <Save size={16} className="mr-1" />
        <span>All changes saved automatically to your device</span>
      </div>
    </div>
  );
}