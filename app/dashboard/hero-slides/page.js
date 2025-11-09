'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Palette
} from 'lucide-react';

export default function HeroSlidesManagement() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'color',
    background: 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data.slides || []);
      } else {
        toast.error('Failed to fetch slides');
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Error loading slides');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Capture editing slide at the moment of submission to avoid race conditions
    const currentEditingSlide = editingSlide;
    
    try {
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form data being submitted:', formData);
      console.log('Form data type:', formData.type);
      console.log('Form data imageUrl:', formData.imageUrl);
      console.log('Form data background:', formData.background);
      console.log('Current editing slide at submission:', currentEditingSlide);
      console.log('editingSlide state value:', editingSlide);
      
      if (currentEditingSlide) {
        console.log('=== SLIDE ID VALIDATION ===');
        console.log('Full currentEditingSlide object:', JSON.stringify(currentEditingSlide, null, 2));
        console.log('Slide ID raw:', currentEditingSlide._id);
        console.log('Slide ID type:', typeof currentEditingSlide._id);
        console.log('Slide ID length:', currentEditingSlide._id?.length);
        
        // Check if _id exists
        if (!currentEditingSlide._id) {
          console.error('CRITICAL ERROR: Slide ID is completely missing!');
          console.error('CurrentEditingSlide keys:', Object.keys(currentEditingSlide));
          toast.error('Critical Error: Slide ID is missing');
          setLoading(false);
          return;
        }
        
        // Convert to string and validate
        const slideId = String(currentEditingSlide._id).trim();
        console.log('Processed slide ID:', slideId);
        console.log('Processed ID length:', slideId.length);
        console.log('ID validation regex test:', /^[0-9a-fA-F]{24}$/.test(slideId));
        
        if (slideId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(slideId)) {
          console.error('ERROR: Invalid slide ID format');
          console.error('Expected: 24 character hex string');
          console.error('Got:', slideId, 'Length:', slideId.length);
          toast.error('Error: Invalid slide ID format');
          setLoading(false);
          return;
        }
        console.log('✅ Slide ID validation passed');
      }
      
      // Use different approach for update vs create
      let url, method, requestBody;
      
      if (currentEditingSlide) {
        // For updates, use the update endpoint with ID in body
        url = '/api/hero-slides/update';
        method = 'PUT';
        requestBody = {
          ...formData,
          id: String(currentEditingSlide._id).trim()
        };
        console.log('=== UPDATE REQUEST ===');
        console.log('Using update endpoint with ID in body');
      } else {
        // For creates, use the main endpoint
        url = '/api/hero-slides';
        method = 'POST';
        requestBody = formData;
        console.log('=== CREATE REQUEST ===');
        console.log('Using create endpoint');
      }
      
      console.log('Final request URL:', url);
      console.log('Request method:', method);
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        toast.success(currentEditingSlide ? 'Slide updated successfully!' : 'Slide created successfully!');
        await fetchSlides();
        resetForm();
      } else {
        // More detailed error logging
        console.log('Error response status:', response.status);
        console.log('Error response statusText:', response.statusText);
        
        let errorData;
        const contentType = response.headers.get('content-type');
        console.log('Response content-type:', contentType);
        
        try {
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          console.log('Response text length:', responseText.length);
          
          if (responseText.length === 0) {
            errorData = { error: `Empty response with status ${response.status}: ${response.statusText}` };
          } else if (contentType && contentType.includes('application/json')) {
            try {
              errorData = JSON.parse(responseText);
            } catch (jsonError) {
              console.error('JSON parse failed:', jsonError);
              errorData = { error: `Invalid JSON response: ${responseText}` };
            }
          } else {
            errorData = { error: responseText || `HTTP ${response.status}: ${response.statusText}` };
          }
        } catch (parseError) {
          console.error('Failed to read response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText} - Failed to read response` };
        }
        
        console.error('Parsed error response:', errorData);
        toast.error(errorData.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Error saving slide');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slideId) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/hero-slides/${slideId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Slide deleted successfully!');
        await fetchSlides();
      } else {
        toast.error('Failed to delete slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Error deleting slide');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'hero-slides');

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image upload successful, URL:', data.url);
        console.log('Current editingSlide before setFormData:', editingSlide);
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        console.log('Updated formData with imageUrl');
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const toggleSlideActive = async (slide) => {
    try {
      console.log('Toggle slide active:', slide);
      console.log('Slide ID for toggle:', slide._id, 'Type:', typeof slide._id, 'Length:', slide._id?.length);
      
      const payload = {
        ...slide,
        isActive: !slide.isActive,
      };
      console.log('Toggle payload:', payload);
      
      const response = await fetch('/api/hero-slides/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          id: slide._id
        }),
      });
      
      console.log('Toggle response status:', response.status);

      if (response.ok) {
        toast.success(`Slide ${!slide.isActive ? 'activated' : 'deactivated'}`);
        await fetchSlides();
      } else {
        toast.error('Failed to update slide status');
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Error updating slide');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      type: 'color',
      background: 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)',
      imageUrl: '',
      isActive: true
    });
    setEditingSlide(null);
    setShowForm(false);
  };

  const startEdit = (slide) => {
    console.log('=== START EDIT FUNCTION ===');
    console.log('Start edit - slide object:', slide);
    console.log('Slide _id:', slide._id, 'Type:', typeof slide._id);
    console.log('Slide keys:', Object.keys(slide));
    
    // Validate slide has required _id
    if (!slide._id) {
      console.error('ERROR: Slide object missing _id!', slide);
      toast.error('Error: Invalid slide data');
      return;
    }
    
    const slideToEdit = {
      ...slide,
      _id: slide._id // Ensure _id is preserved
    };
    
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      type: slide.type || 'color',
      background: slide.background || 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)',
      imageUrl: slide.imageUrl || '',
      isActive: slide.isActive !== false
    });
    
    console.log('Setting editingSlide to:', slideToEdit);
    setEditingSlide(slideToEdit);
    setShowForm(true);
    
    // Verify state was set correctly
    setTimeout(() => {
      console.log('Verification - editingSlide after state update should contain:', slideToEdit);
    }, 100);
  };

  if (loading && slides.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Link href="/dashboard" className="hover:text-green-600 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-green-800 font-medium">Hero Slides</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Hero Slides</h1>
          <p className="text-gray-600">Manage homepage hero section slides</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              ← Back to Dashboard
            </Button>
          </Link>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Slide
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Create or edit hero slide content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter slide title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Background Type</Label>
                  <Select value={formData.type} onValueChange={(value) => {
                    console.log('Type changing from', formData.type, 'to', value);
                    console.log('Current editingSlide before type change:', editingSlide);
                    setFormData(prev => ({ ...prev, type: value }));
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">
                        <div className="flex items-center">
                          <Palette className="w-4 h-4 mr-2" />
                          Solid Color/Gradient
                        </div>
                      </SelectItem>
                      <SelectItem value="image">
                        <div className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Background Image
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Enter slide subtitle"
                  rows={3}
                  required
                />
              </div>

              {formData.type === 'color' && (
                <div className="space-y-2">
                  <Label htmlFor="background">Background (CSS)</Label>
                  <Input
                    id="background"
                    value={formData.background}
                    onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                    placeholder="e.g., #214929 or linear-gradient(...)"
                  />
                  <div 
                    className="h-20 rounded-lg border-2 border-gray-200"
                    style={{ background: formData.background }}
                  />
                </div>
              )}

              {formData.type === 'image' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <div className="flex gap-4">
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Image URL or upload below"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload').click()}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {formData.imageUrl && (
                    <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active (visible on website)</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading || uploading} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Slide'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Slides</h2>
        {slides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No slides yet. Create your first slide!</p>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide) => (
            <Card key={slide._id} className={`${slide.isActive ? 'border-green-200' : 'border-gray-200 opacity-60'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{slide.title}</h3>
                      <div className="flex items-center gap-2">
                        {slide.isActive ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {slide.type === 'image' ? <ImageIcon className="w-3 h-3 mr-1" /> : <Palette className="w-3 h-3 mr-1" />}
                          {slide.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600">{slide.subtitle}</p>
                    {slide.type === 'image' && slide.imageUrl && (
                      <div className="mt-3 h-24 w-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={slide.imageUrl}
                          alt="Slide background"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {slide.type === 'color' && slide.background && (
                      <div 
                        className="mt-3 h-12 w-48 rounded-lg border"
                        style={{ background: slide.background }}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSlideActive(slide)}
                    >
                      {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(slide)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(slide._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}