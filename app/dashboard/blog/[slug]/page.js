'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, X, Trash2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
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

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();

      if (response.ok) {
        setFormData({
          ...data.post,
          seo: data.post.seo || formData.seo
        });
      } else {
        toast.error('Artikel tidak ditemukan');
        router.push('/dashboard/blog');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('type', 'blog'); // Specify this is a blog image

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: uploadData
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

  const openPreview = () => {
    const targetSlug = formData.slug || slug;
    window.open(`/blog/${targetSlug}?preview=1`, '_blank');
  };

  const handleUpdate = async (status) => {
    if (!formData.title.trim()) {
      toast.error('Judul artikel wajib diisi');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Konten artikel wajib diisi');
      return;
    }

    setSaving(true);

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

      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Artikel berhasil ${status === 'published' ? 'dipublish' : 'diupdate'}`);
        if (formData.slug !== slug) {
          router.push(`/dashboard/blog/${formData.slug}`);
        } else {
          fetchPost();
        }
      } else {
        toast.error(data.error || 'Gagal mengupdate artikel');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Gagal mengupdate artikel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus artikel "${formData.title}"?`)) return;

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Artikel berhasil dihapus');
        router.push('/dashboard/blog');
      } else {
        toast.error('Gagal menghapus artikel');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Gagal menghapus artikel');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent" style={{ color: '#214929' }}></div>
          <p className="mt-4 text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-poppins)' }}>
      {/* Header - same as new page but with delete button */}
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
              Edit Artikel
            </h1>
            <p className="text-gray-600">{formData.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={openPreview}
            variant="outline"
            title="Preview Draft"
            style={{ borderColor: '#214929', color: '#214929' }}
          >
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Hapus
          </Button>
          <Button
            onClick={() => handleUpdate('draft')}
            disabled={saving}
            variant="outline"
            style={{ borderColor: '#214929', color: '#214929' }}
          >
            <Save size={16} className="mr-2" />
            Simpan Draft
          </Button>
          <Button
            onClick={() => handleUpdate('published')}
            disabled={saving}
            style={{ backgroundColor: '#214929', color: 'white' }}
          >
            <Eye size={16} className="mr-2" />
            {formData.status === 'published' ? 'Update' : 'Publish'}
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

      {/* Form content - EXACT SAME as new/page.js */}
      {activeTab === 'content' && (
        <div className="space-y-6">
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

      {/* SEO Tab - EXACT SAME as new/page.js SEO tab content */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
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

          {/* OG and Twitter sections same as new page... */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#214929' }}>
              📱 Open Graph & 🐦 Twitter Card
            </h3>
            <p className="text-sm text-gray-600">Sudah auto-fill dari data konten utama. Edit jika diperlukan.</p>
          </div>

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
