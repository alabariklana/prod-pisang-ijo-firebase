'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ProfilePhotoUpload({ currentPhotoURL, userEmail, userName, onPhotoUpdated }) {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('email', userEmail);

      const response = await fetch('/api/member/upload-photo', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Foto profil berhasil diupload!');
        onPhotoUpdated(data.photoURL);
        handleClose();
      } else {
        toast.error(data.error || 'Gagal upload foto');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal upload foto profil');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderProfileImage = () => {
    if (currentPhotoURL) {
      return (
        <Image
          src={currentPhotoURL}
          alt={userName || 'Profile'}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover"
        />
      );
    }

    return (
      <div 
        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundColor: '#214929' }}
      >
        {userName?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase()}
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        {renderProfileImage()}
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
          style={{ backgroundColor: '#214929' }}
          title="Ubah foto profil"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold" style={{ color: '#214929' }}>
                Upload Foto Profil
              </h3>
              <button onClick={handleClose} className="hover:bg-gray-100 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Preview */}
              <div className="flex justify-center">
                {preview ? (
                  <div className="relative w-40 h-40">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-full object-cover border-4"
                      style={{ borderColor: '#214929' }}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-40 h-40 rounded-full border-4 border-dashed flex items-center justify-center"
                    style={{ borderColor: '#214929' }}
                  >
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    style={{ borderColor: '#214929', color: '#214929' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </Button>
                </label>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Format: JPEG, PNG, WebP • Maksimal 5MB
                </p>
              </div>

              {/* Action Buttons */}
              {selectedFile && (
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={uploading}
                    className="flex-1"
                    style={{ borderColor: '#214929', color: '#214929' }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                    style={{ backgroundColor: '#214929' }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Foto'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
