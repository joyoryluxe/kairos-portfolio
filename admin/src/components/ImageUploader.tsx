'use client';

import { useRef, useState } from 'react';
import { API_URL } from '@/lib/api';

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5173';

function resolvePreviewUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${FRONTEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

const compressImage = (file: File, maxWidth = 2048, quality = 0.8): Promise<Blob> => {
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
      // 1. Initial compression: Max width 2048px, 80% quality WebP
      let compressedBlob = await compressImage(file, 2048, 0.8);

      // Fallback: If the compressed WebP is larger than the original image,
      // and the original image is under Cloudinary's 10MB limit, keep the original image instead.
      if (file.size < compressedBlob.size && file.size <= 10 * 1024 * 1024) {
        compressedBlob = file;
      }

      // 2. Second pass: If still larger than Cloudinary's 10MB limit, compress more aggressively (1600px, 75% quality)
      if (compressedBlob.size > 10 * 1024 * 1024 && file.type !== 'image/gif') {
        compressedBlob = await compressImage(file, 1600, 0.75);
      }

      // 3. Third pass: If STILL larger than 10MB, reduce resolution further (1200px, 70% quality)
      if (compressedBlob.size > 10 * 1024 * 1024 && file.type !== 'image/gif') {
        compressedBlob = await compressImage(file, 1200, 0.7);
      }

      // 4. Hard safety check: If the final blob size is still above 10MB (or if it's a GIF that can't be compressed),
      // reject it early so we don't hit the Cloudinary limit error.
      if (compressedBlob.size > 10 * 1024 * 1024) {
        const sizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);
        throw new Error(
          `Image is too large (${sizeInMB} MB). Cloudinary's free plan limit is 10 MB. Please upload a smaller image.`
        );
      }

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
