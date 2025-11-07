'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, Plus, Search, Filter, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function BlogManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0
  });

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        ...(searchTerm && { search: searchTerm }),
        limit: '100'
      });

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        calculateStats(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allPosts) => {
    setStats({
      total: allPosts.length,
      published: allPosts.filter(p => p.status === 'published').length,
      draft: allPosts.filter(p => p.status === 'draft').length
    });
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Artikel berhasil dihapus');
        fetchPosts();
      } else {
        toast.error('Gagal menghapus artikel');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Gagal menghapus artikel');
    }
  };

  const exportToCSV = () => {
    const csvData = posts.map(post => ({
      Title: post.title,
      Slug: post.slug,
      Category: post.category,
      Status: post.status,
      Views: post.views || 0,
      Author: post.author,
      Created: new Date(post.createdAt).toLocaleDateString('id-ID'),
      Published: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID') : '-'
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-articles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data berhasil di-export');
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-poppins)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#214929', fontFamily: 'var(--font-playfair)' }}>
          Blog Management
        </h1>
        <p className="text-gray-600">Kelola artikel blog website Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Artikel</p>
              <p className="text-3xl font-bold" style={{ color: '#214929' }}>{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#214929' }}>
              <span className="text-white text-xl">📝</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-bold" style={{ color: '#214929' }}>{stats.published}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#214929' }}>
              <span className="text-white text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: '#EBDEC5' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-3xl font-bold" style={{ color: '#214929' }}>{stats.draft}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#214929' }}>
              <span className="text-white text-xl">📄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <option value="all">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <Button
          onClick={exportToCSV}
          variant="outline"
          disabled={posts.length === 0}
          style={{ borderColor: '#214929', color: '#214929' }}
        >
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>

        <Button
          onClick={() => router.push('/dashboard/blog/new')}
          style={{ backgroundColor: '#214929', color: 'white' }}
        >
          <Plus size={16} className="mr-2" />
          Buat Artikel Baru
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent" style={{ color: '#214929' }}></div>
          <p className="mt-4 text-gray-600">Memuat artikel...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12" style={{ backgroundColor: '#EBDEC5', borderRadius: '8px' }}>
          <p className="text-xl mb-2" style={{ color: '#214929' }}>Belum ada artikel</p>
          <p className="text-gray-600 mb-4">Mulai buat artikel pertama Anda</p>
          <Button
            onClick={() => router.push('/dashboard/blog/new')}
            style={{ backgroundColor: '#214929', color: 'white' }}
          >
            <Plus size={16} className="mr-2" />
            Buat Artikel
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: '#EBDEC5' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#214929' }}>
                  Artikel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#214929' }}>
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#214929' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#214929' }}>
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#214929' }}>
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#214929' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium" style={{ color: '#214929' }}>
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#FCD900', color: '#214929' }}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'published' ? '✅ Published' : '📄 Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    👁️ {post.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDate(post.publishedAt || post.createdAt)}</div>
                    <div className="text-xs text-gray-400">{post.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => window.open(`/blog/${post.slug}${post.status === 'published' ? '' : '?preview=1'}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                        title={post.status === 'published' ? 'Lihat' : 'Preview Draft'}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/blog/${post.slug}`)}
                        className="hover:text-green-900"
                        style={{ color: '#214929' }}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
