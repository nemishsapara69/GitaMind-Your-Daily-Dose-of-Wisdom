import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // Stores raw numeric value for backend
  const [inputPrice, setInputPrice] = useState(''); // Stores formatted string for input field
  const [stock, setStock] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([{ url: '', alt: '' }]);
  
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');


  useEffect(() => {
      if (!user || !isAdmin) {
          setError('Not authorized. Admin access required.');
          setLoading(false);
          navigate('/login');
      }
  }, [user, isAdmin, navigate]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Error fetching categories for form:', err);
        setError('Failed to load categories for selection.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditMode || !user || !isAdmin) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await api.get(`/products/${id}`, config);
        const productData = response.data.data;
        setName(productData.name);
        setDescription(productData.description);
        setPrice(productData.price); // Store raw number
        setInputPrice(formatDisplayPrice(productData.price)); // Format for input field display
        setStock(productData.stock);
        setIsFeatured(productData.isFeatured);
        setCategory(productData.category._id);
        setImages(productData.images.length > 0 ? productData.images : [{ url: '', alt: '' }]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product for edit:', err);
        setError(err.response?.data?.message || 'Failed to load product for editing.');
        setLoading(false);
      }
    };

    if (isAdmin && categories.length > 0) {
        fetchProductData();
    } else if (!isEditMode && categories.length > 0) {
        setLoading(false);
    }
  }, [id, isEditMode, user, isAdmin, navigate, categories]);

  // --- Helper for Price Display Formatting (adds commas, keeps 2 decimal places) ---
  const formatDisplayPrice = (num) => {
    if (num === '' || num === null || isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true // Ensure grouping (commas) is used
    }).format(num);
  };

  const handlePriceInputChange = (e) => {
    const rawValue = e.target.value;
    // Remove all non-digit and non-decimal point characters for internal numeric value
    const cleanNumericValue = rawValue.replace(/[^0-9.]/g, ''); 
    
    // Update the display string, allowing commas visually as typed (but not for internal number parsing)
    setInputPrice(rawValue); 

    // Convert to number for actual price state (to be sent to backend)
    const numericValue = parseFloat(cleanNumericValue);
    setPrice(isNaN(numericValue) ? '' : numericValue);
  };


  const handleImageChange = (index, e) => {
    const newImages = [...images];
    newImages[index][e.target.name] = e.target.value;
    setImages(newImages);
  };

  const handleAddImageField = () => {
    if (images.length < 40) {
      setImages([...images, { url: '', alt: '' }]);
    } else {
      alert('You can only add up to 40 images.');
    }
  };

  const handleRemoveImageField = (index) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    } else {
        alert('You must have at least one image field. Clear the URL instead if not used.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError(null);

    // Client-side validation: ensure numeric price is valid
    if (!name || !description || price === '' || isNaN(price) || price < 0 || !stock || isNaN(parseInt(stock)) || parseInt(stock) < 0 || !category) {
        setError('Please fill all required fields correctly. Price and Stock must be valid non-negative numbers.');
        setSubmitting(false);
        return;
    }

    const filteredImages = images.filter(img => img.url.trim() !== '');
    const finalImages = filteredImages.length > 0 
        ? filteredImages 
        : [{ url: 'https://via.placeholder.com/200/FFFAEC/B06500?text=No+Product+Image', alt: 'Default Product Image' }];


    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      isFeatured,
      category,
      images: finalImages
    };

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let res;
      if (isEditMode) {
        res = await api.put(`/products/${id}`, productData, config);
        setMessage('Product updated successfully!');
      } else {
        res = await api.post('/products', productData, config);
        setMessage('Product added successfully!');
      }
      console.log(res.data);
      if (!isEditMode) { // Clear form fields after adding new product
        setName('');
        setDescription('');
        setPrice('');
        setInputPrice('');
        setStock('');
        setIsFeatured(false);
        setCategory('');
        setImages([{ url: '', alt: '' }]);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Product form submission error:', err.response?.data || err);
      setMessage(err.response?.data?.message || 'Failed to submit product data.');
      setError(err.response?.data?.message || 'Failed to submit product data.');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading || (!isAdmin && user)) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#603900' }}>{isEditMode ? 'Loading Product for Edit...' : 'Loading Categories...'}</div>;
  }

  if (!user || !isAdmin) {
      return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: 'red' }}>Access Denied: You must be an administrator.</div>;
  }


  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid #FFDDBC' }}>
      <Link to="/admin/products" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#B06500', fontWeight: 'bold', fontSize: '1.1em' }}>
        &larr; Back to Manage Products
      </Link>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5em', color: '#B06500' }}>
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>
      {message && <p style={{ textAlign: 'center', marginBottom: '20px', color: message.includes('successfully') ? '#4CAF50' : '#D32F2F' }}>{message}</p>}
      {error && <p style={{ textAlign: 'center', marginBottom: '20px', color: '#D32F2F' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Product Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={{...inputStyle, minHeight: '100px'}} required></textarea>
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="price" style={labelStyle}>Price (₹):</label>
          <input
            type="text" // Keep as text to allow formatting
            id="price"
            value={inputPrice} // Bind to inputPrice for display
            onChange={handlePriceInputChange} // Custom handler for input
            onBlur={() => setInputPrice(formatDisplayPrice(price))} // Format on blur
            onFocus={() => setInputPrice(price === '' ? '' : String(price))} // Show raw number on focus
            style={inputStyle}
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="stock" style={labelStyle}>Stock Quantity:</label>
          <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} style={inputStyle} min="0" required />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="category" style={labelStyle}>Category:</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} required>
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div style={{...formGroupStyle, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
          <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{width: '20px', height: '20px'}} />
          <label htmlFor="isFeatured" style={{marginBottom: '0', cursor: 'pointer', color: '#603900'}}>Feature this product?</label>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Images (URLs):</label>
          {images.map((img, index) => (
            <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <input
                type="url"
                name="url"
                placeholder="Image URL"
                value={img.url}
                onChange={(e) => handleImageChange(index, e)}
                style={inputStyle}
              />
              <input
                type="text"
                name="alt"
                placeholder="Alt Text"
                value={img.alt}
                onChange={(e) => handleImageChange(index, e)}
                style={inputStyle}
              />
              {images.length > 1 && (
                <button type="button" onClick={() => handleRemoveImageField(index)} style={{...smallButtonStyle, backgroundColor: '#D32F2F'}}>
                  -
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddImageField} style={{...smallButtonStyle, backgroundColor: '#4CAF50', marginTop: '10px'}}>
            + Add Image
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            ...buttonStyle,
            background: submitting ? '#FFDDBC' : '#B06500',
            cursor: submitting ? 'not-allowed' : 'pointer',
            marginTop: '30px'
          }}
          onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#9A5700'; }}
          onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#B06500'; }}
        >
          {submitting ? 'Submitting...' : (isEditMode ? 'Update Product' : 'Add Product')}
        </button>
      </form>
    </div>
  );
};

const formGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#603900',
};

const inputStyle = {
  width: 'calc(100% - 20px)',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #FFDDBC',
  backgroundColor: '#FFFAEC',
  color: '#444444',
  fontSize: '1em',
  outline: 'none',
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1.1em',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease-in-out',
};

const smallButtonStyle = {
  padding: '5px 10px',
  borderRadius: '5px',
  fontSize: '0.9em',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};


export default ProductForm;