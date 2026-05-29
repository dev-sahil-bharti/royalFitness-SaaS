import React, { useState, useEffect } from 'react';
import { 
  Upload, Trash2, Loader2, CheckCircle2, AlertCircle, 
  RefreshCw, X, ShieldCheck, Ban, Image as ImageIcon, Plus, Eye, Maximize2
} from 'lucide-react';

const CATEGORIES = ["All", "Gym Area", "Equipment", "Transformation", "Events", "Trainers"];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Action feedback & Modals
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Full screen Lightbox Preview State
  const [selectedLightboxImg, setSelectedLightboxImg] = useState(null);

  // Form State
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("Gym Area");

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('adminToken');
    const url = activeCategory === "All" 
      ? 'http://localhost:5000/api/admin/gallery' 
      : `http://localhost:5000/api/admin/gallery?category=${encodeURIComponent(activeCategory)}`;
      
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setImages(result.data);
      } else {
        setError(result.message || 'Failed to retrieve images.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your node backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeCategory]);

  const triggerToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 3500);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setFilePreview(objectUrl);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setUploadCategory("Gym Area");
  };

  // --- Actions Handlers ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      triggerToast('error', 'Please select an image file first.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', uploadCategory);

    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await response.json();

      if (response.ok && result.success) {
        triggerToast('success', result.message);
        if (activeCategory === "All" || activeCategory === uploadCategory) {
          fetchImages(); 
        }
        setShowModal(false);
        resetForm();
      } else {
        triggerToast('error', result.message || 'Upload failed.');
      }
    } catch (err) {
      triggerToast('error', 'Network failure during upload.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete this image from the gallery and cloud storage?`)) return;
    
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setImages(images.filter(img => img._id !== id));
        triggerToast('success', 'Image deleted successfully.');
        if (selectedLightboxImg?._id === id) {
          setSelectedLightboxImg(null);
        }
      } else {
        triggerToast('error', result.message || 'Failed to delete.');
      }
    } catch (err) {
      triggerToast('error', 'Network disconnect. Delete failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleStatus = async (id, currentIsActive) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setImages(images.map(img => img._id === id ? { ...img, isActive: !currentIsActive } : img));
        triggerToast('success', result.message);
        if (selectedLightboxImg?._id === id) {
          setSelectedLightboxImg({ ...selectedLightboxImg, isActive: !currentIsActive });
        }
      } else {
        triggerToast('error', result.message || 'Update failed.');
      }
    } catch (err) {
      triggerToast('error', 'Network error.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-16 relative">
      
      {/* Header Row & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gallery Management</h1>
          <p className="text-slate-400 text-sm mt-1">Upload and categorize gym showcase photos.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchImages}
            className="p-2.5 bg-[#131b2c] hover:bg-card-dark border border-card-dark text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg"
            title="Refresh gallery"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-yellow' : ''}`} />
          </button>
          
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 font-extrabold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-4 gap-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeCategory === category 
                ? 'bg-brand-yellow text-slate-950 shadow-lg shadow-brand-yellow/20'
                : 'bg-[#131b2c] border border-card-dark text-slate-400 hover:text-white hover:bg-card-dark'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Live Banner Alerts */}
      {actionMessage.text && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border shadow-2xl animate-fadeInRight ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-semibold">{actionMessage.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      {loading && images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 bg-[#131b2c] rounded-3xl border border-card-dark">
          <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
          <p className="text-sm font-medium tracking-wider">Loading Gallery...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6 bg-[#131b2c] rounded-3xl border border-card-dark">
          <AlertCircle className="w-12 h-12 text-rose-500 opacity-80" />
          <h3 className="text-lg font-bold text-slate-200">Data Retrieval Mismatch</h3>
          <p className="text-slate-500 text-sm max-w-sm">{error}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-center bg-[#131b2c] rounded-3xl border border-card-dark">
          <ImageIcon className="w-12 h-12 opacity-30 mb-2 text-slate-500" />
          <p className="text-slate-300 font-bold text-base">No images found for {activeCategory}.</p>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="text-brand-yellow font-bold text-sm hover:underline cursor-pointer"
          >
            Upload your first photo
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {images.map((img) => {
            const isProcessed = processingId === img._id;
            
            return (
              <div 
                key={img._id} 
                onClick={() => setSelectedLightboxImg(img)}
                className={`group relative break-inside-avoid bg-[#131b2c] border rounded-3xl overflow-hidden transition-all shadow-xl hover:shadow-brand-yellow/5 border-card-dark cursor-pointer ${!img.isActive && 'opacity-60 grayscale-[50%]'}`}
              >
                {/* Image */}
                <div className="relative aspect-auto">
                  <img 
                    src={img.imageUrl} 
                    alt={img.category} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    
                    {/* Top row actions */}
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 bg-brand-yellow/90 text-slate-900 text-xs font-black uppercase rounded-lg shadow-lg">
                        {img.category}
                      </span>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(img._id); }}
                        disabled={isProcessed}
                        title="Delete Image"
                        className="p-2 bg-rose-500/80 hover:bg-rose-500 text-white rounded-xl transition-colors cursor-pointer backdrop-blur-sm z-10"
                      >
                        {isProcessed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Centered click invitation prompt */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="p-3 bg-brand-yellow/90 text-slate-950 rounded-full transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                      <span className="text-white text-xs font-bold tracking-widest uppercase mt-2 opacity-0 group-hover:opacity-80 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        View Preview
                      </span>
                    </div>

                    {/* Bottom row actions */}
                    <div className="mt-auto pt-4 z-10">
                       <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(img._id, img.isActive); }}
                          disabled={isProcessed}
                          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer ${
                            img.isActive ? 'bg-emerald-500/80 hover:bg-emerald-500 text-white' : 'bg-slate-700/80 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {img.isActive ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />} 
                          {img.isActive ? 'Active on Website' : 'Hidden from Website'}
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= UPLOAD MODAL WITH REAL-TIME PREVIEW ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-fadeInUp">
            
            <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-brand-yellow/10 to-transparent">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-brand-yellow" />
                Upload New Image
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-bg-dark border border-card-dark text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              
              {/* Form Controls Left */}
              <form onSubmit={handleUpload} className="space-y-6">
                
                {/* Image Upload Input Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Select Image Asset</label>
                  <label className="w-full relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-card-dark hover:border-brand-yellow/50 rounded-2xl bg-bg-dark transition-colors cursor-pointer overflow-hidden group">
                    {filePreview ? (
                      <>
                        <img src={filePreview} alt="Selected" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-black/70 text-white px-4 py-2 rounded-xl text-xs font-bold">Replace File</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 text-center px-4">
                        <ImageIcon className="w-10 h-10 mb-3 text-slate-500 group-hover:text-brand-yellow transition-colors" />
                        <p className="text-sm font-medium">Click to select image file</p>
                        <p className="text-xs mt-1 opacity-60">JPG, PNG, WEBP and GIF supported</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Choose Category</label>
                  <select 
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-brand-yellow/20"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-bg-dark border border-card-dark text-slate-300 font-bold rounded-xl hover:bg-card-dark transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting || !file}
                    className={`flex items-center justify-center gap-2 px-6 py-2.5 font-extrabold rounded-xl shadow-lg transition-all text-sm min-w-[140px] ${
                      submitting || !file
                        ? 'bg-brand-yellow/50 text-slate-900/50 cursor-not-allowed'
                        : 'bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                    }`}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Now'}
                  </button>
                </div>

              </form>

              {/* LIVE CARD PREVIEW SECTION RIGHT */}
              <div className="border-t lg:border-t-0 lg:border-l border-card-dark/40 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-center">
                <span className="block text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">Live Card Preview Guide</span>
                
                {filePreview ? (
                  <div className="w-full max-w-[280px] mx-auto bg-[#131b2c] border border-card-dark rounded-3xl overflow-hidden shadow-2xl relative animate-fadeIn">
                    <img src={filePreview} alt="Live Card Preview" className="w-full h-auto object-cover max-h-[320px]" />
                    
                    {/* Live overlay decoration mockup */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
                      <div>
                        <span className="px-2.5 py-1 bg-brand-yellow text-slate-900 text-[10px] font-black uppercase rounded-lg shadow-lg">
                          {uploadCategory}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <span className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-500/80 text-white rounded-xl text-[10px] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Mock Active on Site
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[280px] mx-auto h-[240px] border border-dashed border-card-dark rounded-3xl flex flex-col items-center justify-center text-slate-600 text-xs bg-bg-dark/40">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span>Select an image to view mockup</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= FULL-SCREEN IMAGE LIGHTBOX OVERLAY ================= */}
      {selectedLightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-fadeIn">
          
          {/* Close lightbox trigger */}
          <button 
            onClick={() => setSelectedLightboxImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-700/50 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center gap-6">
            
            {/* Visual Screen Container */}
            <div className="relative max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-card-dark/30">
              <img 
                src={selectedLightboxImg.imageUrl} 
                alt="Full preview" 
                className="max-w-full max-h-[70vh] object-contain rounded-2xl"
              />
              
              {/* Category Badge overlay */}
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-yellow text-slate-950 text-xs font-black uppercase rounded-lg shadow-lg">
                {selectedLightboxImg.category}
              </span>
            </div>

            {/* Information Controls Drawer */}
            <div className="bg-[#131b2c] border border-card-dark/50 rounded-2xl p-5 w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <h4 className="text-white font-bold text-base flex items-center gap-2">
                  Category: {selectedLightboxImg.category}
                </h4>
                <p className="text-xs text-slate-400 mt-1">Uploaded {new Date(selectedLightboxImg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleToggleStatus(selectedLightboxImg._id, selectedLightboxImg.isActive)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLightboxImg.isActive ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-slate-700/30 border border-slate-600/30 text-slate-300'
                  }`}
                >
                  {selectedLightboxImg.isActive ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />} 
                  {selectedLightboxImg.isActive ? 'Active on Web' : 'Hidden from Web'}
                </button>

                <button 
                  onClick={() => handleDelete(selectedLightboxImg._id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Asset
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Gallery;
