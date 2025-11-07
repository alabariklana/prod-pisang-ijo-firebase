'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: 'Resep',
    tags: [],
    status: 'draft',
    author: 'Admin',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      canonicalUrl: '',
      robotsTag: 'index, follow',
      robotsMeta: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      author: 'Pisang Ijo Evi',
      publisher: 'Pisang Ijo Evi'
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSEOChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;

    // Split by comma and process each keyword
    const newKeywords = keywordInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k && !formData.seo.keywords.includes(k));

    if (newKeywords.length > 0) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, ...newKeywords]
        }
      }));
      setKeywordInput('');
    }
  };

  const handleKeywordInputChange = (value) => {
    // Auto-add when comma is detected
    if (value.includes(',')) {
      const parts = value.split(',');
      const toAdd = parts.slice(0, -1).map(k => k.trim()).filter(k => k && !formData.seo.keywords.includes(k));
      
      if (toAdd.length > 0) {
        setFormData(prev => ({
          ...prev,
          seo: {
            ...prev.seo,
            keywords: [...prev.seo.keywords, ...toAdd]
          }
        }));
      }
      
      // Keep the last part (after last comma) in input
      setKeywordInput(parts[parts.length - 1].trim());
    } else {
      setKeywordInput(value);
    }
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(k => k !== keyword)
      }
    }));
  };

  const handleImageUpload = async (e, type = 'featured') => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'blog'); // Specify this is a blog image

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        const imageUrl = data.url;
        if (type === 'featured') {
          setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
        } else if (type === 'og') {
          handleSEOChange('ogImage', imageUrl);
        } else if (type === 'twitter') {
          handleSEOChange('twitterImage', imageUrl);
        }
        toast.success('Gambar berhasil diupload');
      } else {
        toast.error(data.error || 'Gagal upload gambar');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal upload gambar');
    }
  };

  const handleSubmit = async (status) => {
    if (!formData.title.trim()) {
      toast.error('Judul artikel wajib diisi');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Konten artikel wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        status,
        seo: {
          ...formData.seo,
          metaTitle: formData.seo.metaTitle || formData.title,
          metaDescription: formData.seo.metaDescription || formData.excerpt || formData.content.substring(0, 160),
          ogTitle: formData.seo.ogTitle || formData.title,
          ogDescription: formData.seo.ogDescription || formData.excerpt,
          ogImage: formData.seo.ogImage || formData.featuredImage,
          twitterTitle: formData.seo.twitterTitle || formData.title,
          twitterDescription: formData.seo.twitterDescription || formData.excerpt,
          twitterImage: formData.seo.twitterImage || formData.featuredImage
        }
      };

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Artikel berhasil ${status === 'published' ? 'dipublish' : 'disimpan sebagai draft'}`);
        router.push('/dashboard/blog');
      } else {
        toast.error(data.error || 'Gagal menyimpan artikel');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Gagal menyimpan artikel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-poppins)' }}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            style={{ borderColor: '#214929', color: '#214929' }}
          >
            <Home size={16} className="mr-2" />
            Dashboard
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            style={{ borderColor: '#214929', color: '#214929' }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
              Buat Artikel Baru
            </h1>
            <p className="text-gray-600">Tulis dan publikasikan artikel blog</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            variant="outline"
            style={{ borderColor: '#214929', color: '#214929' }}
          >
            <Save size={16} className="mr-2" />
            Simpan Draft
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            style={{ backgroundColor: '#214929', color: 'white' }}
          >
            <Eye size={16} className="mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'content'
                ? 'border-b-2 text-[#214929]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'content' ? { borderColor: '#214929' } : {}}
          >
            📝 Konten
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'seo'
                ? 'border-b-2 text-[#214929]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'seo' ? { borderColor: '#214929' } : {}}
          >
            🔍 SEO & Meta
          </button>
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
              Judul Artikel *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Masukkan judul artikel..."
              className="text-lg"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">/blog/</span>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="url-artikel"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">URL-friendly (huruf kecil, tanpa spasi)</p>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
              Featured Image
            </label>
            {formData.featuredImage ? (
              <div className="relative inline-block">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-64 h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleChange('featuredImage', '')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Gambar</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'featured')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Resep">Resep</option>
                <option value="Tips & Trik">Tips & Trik</option>
                <option value="Cerita">Cerita</option>
                <option value="Kuliner">Kuliner</option>
                <option value="Promo">Promo</option>
                <option value="Berita">Berita</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Tambah tag..."
                />
                <Button
                  onClick={addTag}
                  type="button"
                  style={{ backgroundColor: '#214929', color: 'white' }}
                >
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#FCD900', color: '#214929' }}
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
              Excerpt (Ringkasan)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Ringkasan singkat artikel (akan muncul di preview)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/160 karakter</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
              Konten Artikel *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Tulis konten artikel di sini..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={20}
            />
            <p className="text-xs text-gray-500 mt-1">Gunakan Markdown untuk formatting</p>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
              Author
            </label>
            <Input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Nama penulis"
            />
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Basic SEO */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#214929' }}>
              🎯 Basic SEO
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Meta Title
                </label>
                <Input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                  placeholder={formData.title || "Judul untuk mesin pencari"}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seo.metaTitle.length}/60 karakter (optimal: 50-60)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Meta Description
                </label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                  placeholder="Deskripsi singkat untuk mesin pencari..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seo.metaDescription.length}/160 karakter (optimal: 150-160)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Keywords (SEO)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => handleKeywordInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Tambah keyword (pisahkan dengan koma)..."
                  />
                  <Button
                    onClick={addKeyword}
                    type="button"
                    style={{ backgroundColor: '#214929', color: 'white' }}
                  >
                    Tambah
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mb-2">💡 Ketik beberapa keyword sekaligus, pisahkan dengan koma. Contoh: resep pisang ijo, kuliner makassar, dessert indonesia</p>
                <div className="flex flex-wrap gap-2">
                  {formData.seo.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-white rounded-full text-sm flex items-center gap-2"
                      style={{ color: '#214929' }}
                    >
                      {keyword}
                      <button onClick={() => removeKeyword(keyword)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Canonical URL
                </label>
                <Input
                  type="url"
                  value={formData.seo.canonicalUrl}
                  onChange={(e) => handleSEOChange('canonicalUrl', e.target.value)}
                  placeholder="https://pisangijo.com/blog/artikel-ini"
                />
                <p className="text-xs text-gray-500 mt-1">Kosongkan jika sama dengan URL artikel ini</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                    Robots Tag
                  </label>
                  <select
                    value={formData.seo.robotsTag}
                    onChange={(e) => handleSEOChange('robotsTag', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="index, follow">index, follow (Default)</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                    Robots Meta
                  </label>
                  <select
                    value={formData.seo.robotsMeta}
                    onChange={(e) => handleSEOChange('robotsMeta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="index, follow">index, follow (Default)</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Open Graph (Facebook) */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#214929' }}>
              📱 Open Graph (Facebook)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  OG Title
                </label>
                <Input
                  type="text"
                  value={formData.seo.ogTitle}
                  onChange={(e) => handleSEOChange('ogTitle', e.target.value)}
                  placeholder={formData.title || "Judul untuk Facebook"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  OG Description
                </label>
                <textarea
                  value={formData.seo.ogDescription}
                  onChange={(e) => handleSEOChange('ogDescription', e.target.value)}
                  placeholder="Deskripsi untuk Facebook..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  OG Image
                </label>
                {formData.seo.ogImage ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.seo.ogImage}
                      alt="OG"
                      className="w-64 h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleSEOChange('ogImage', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                    <div className="text-center">
                      <Upload size={20} className="mx-auto mb-1 text-gray-400" />
                      <span className="text-xs text-gray-500">Upload OG Image</span>
                      <p className="text-xs text-gray-400">1200x630px</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'og')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  OG Type
                </label>
                <select
                  value={formData.seo.ogType}
                  onChange={(e) => handleSEOChange('ogType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="article">Article</option>
                  <option value="website">Website</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#214929' }}>
              🐦 Twitter Card
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Twitter Card Type
                </label>
                <select
                  value={formData.seo.twitterCard}
                  onChange={(e) => handleSEOChange('twitterCard', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Twitter Title
                </label>
                <Input
                  type="text"
                  value={formData.seo.twitterTitle}
                  onChange={(e) => handleSEOChange('twitterTitle', e.target.value)}
                  placeholder={formData.title || "Judul untuk Twitter"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Twitter Description
                </label>
                <textarea
                  value={formData.seo.twitterDescription}
                  onChange={(e) => handleSEOChange('twitterDescription', e.target.value)}
                  placeholder="Deskripsi untuk Twitter..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Twitter Image
                </label>
                {formData.seo.twitterImage ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.seo.twitterImage}
                      alt="Twitter"
                      className="w-64 h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleSEOChange('twitterImage', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                    <div className="text-center">
                      <Upload size={20} className="mx-auto mb-1 text-gray-400" />
                      <span className="text-xs text-gray-500">Upload Twitter Image</span>
                      <p className="text-xs text-gray-400">1200x628px</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'twitter')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Author & Publisher */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#214929' }}>
              ✍️ Author & Publisher
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Author
                </label>
                <Input
                  type="text"
                  value={formData.seo.author}
                  onChange={(e) => handleSEOChange('author', e.target.value)}
                  placeholder="Nama penulis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#214929' }}>
                  Publisher
                </label>
                <Input
                  type="text"
                  value={formData.seo.publisher}
                  onChange={(e) => handleSEOChange('publisher', e.target.value)}
                  placeholder="Nama penerbit"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
