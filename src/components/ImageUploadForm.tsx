"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface ImageFormData {
  title: string;
  description: string;
  photographer: string;
  email: string;
  tags: string[];
  imageUrl: string;
  publicId: string;
}
import { Upload } from 'lucide-react';


const ImageUploadForm: React.FC = () => {
  const [formData, setFormData] = useState<ImageFormData>({
    title: '',
    description: '',
    photographer: '',
    email: '',
    tags: [],
    imageUrl: '',
    publicId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleUploadSuccess = (result: CloudinaryUploadResult) => {
  //   if (result.info && 'secure_url' in result.info && 'public_id' in result.info) {
  //     setFormData(prev => ({
  //       ...prev,
  //       imageUrl: result.info.secure_url,
  //       publicId: result.info.public_id
  //     }));
  //     toast.success('Bild uppladdad!');
  //   } else {
  //     toast.error('Uppladdningen misslyckades');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save image');
      }

      toast.success('Bilden har sparats!');
      setFormData({
        title: '',
        description: '',
        photographer: '',
        email: '',
        tags: [],
        imageUrl: '',
        publicId: ''
      });
    } catch (error) {
      toast.error('Något gick fel vid sparande av bilden');
      console.error('Error saving image:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md">
        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="photographer">Fotograf</Label>
            <Input
              id="photographer"
              value={formData.photographer}
              onChange={(e) => setFormData({...formData, photographer: e.target.value})}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">E-postadress</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="namn@epost.se"
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label>Bild</Label>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting || !formData.imageUrl}>
            {isSubmitting ? 'Sparar...' : 'Spara bild'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ImageUploadForm;