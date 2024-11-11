"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type FeedbackType = 'suggestion' | 'bug';

interface FeedbackData {
  title: string;
  description: string;
  type: FeedbackType;
  name: string;
  email: string;
}

const FeedbackForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FeedbackData>({
    title: '',
    description: '',
    type: 'suggestion',
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z]+\.initcia@gmail\.com$/;
    return emailRegex.test(email);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'suggestion',
      name: '',
      email: ''
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!validateEmail(formData.email)) {
      setError('E-postadressen måste vara i formatet namn.initcia@gmail.com');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast.success('Tack för din feedback!');
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Något gick fel, försök igen senare');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Feedback
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Skicka feedback</DialogTitle>
            <DialogDescription>
              Dela dina förslag eller rapportera problem
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Namn</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  pattern="^[a-zA-Z]+\.initcia@gmail\.com$"
                  placeholder="namn.initcia@gmail.com"
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="type">Typ</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value as FeedbackType})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">Förslag</SelectItem>
                    <SelectItem value="bug">Problem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Skickar...' : 'Skicka feedback'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackForm;