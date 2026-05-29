'use client';

import { useRef, useState } from 'react';
import { API_URL } from '@/lib/api';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5173';

function resolvePreviewUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${FRONTEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

const compressImage = (file: File, maxWidth = 2560, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/gif') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({ value, onChange, folder = 'kairos', label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      // Compress the image on the client-side to high-quality WebP first
      const compressedBlob = await compressImage(file);
      const fileExtension = file.type === 'image/gif' ? '.gif' : '.webp';
      const newFileName = file.name.replace(/\.[^/.]+$/, "") + fileExtension;
      const fileToUpload = new File([compressedBlob], newFileName, {
        type: file.type === 'image/gif' ? 'image/gif' : 'image/webp'
      });

      const form = new FormData();
      form.append('file', fileToUpload);
      form.append('folder', folder);

      const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: form });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      onChange(json.url);
    } catch (e) {
      setError((e as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isCloudinary = value?.includes('cloudinary.com');
  const isLocal = value && !isCloudinary;

  return (
    <div className="img-uploader">
      {label && <label className="img-uploader-label">{label}</label>}

      {value && (
        <div className="img-preview-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolvePreviewUrl(value)} alt="preview" className="img-preview" />
          {/* <div className="img-preview-badges">
            {isCloudinary && <span className="badge badge-cloud">☁ Cloudinary</span>}
            {isLocal && <span className="badge badge-local">📁 Local path</span>}
          </div> */}
        </div>
      )}

      <div
        className={`drop-zone ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
        ) : (
          <>
            <span className="dz-icon">✨</span>
            <span className="dz-text">Upload new asset</span>
            <span className="dz-sub">Drag & drop or click to browse</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <div className="url-row">
        <input
          className="url-input"
          type="text"
          placeholder="Paste external image URL here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <div className="upload-error">⚠️ {error}</div>}
    </div>
  );
}
