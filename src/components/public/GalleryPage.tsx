import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useKV } from '@github/spark/hooks';
import { Event } from '../../lib/types';
import { Images, Eye, Calendar, MapPin, X } from '@phosphor-icons/react';

interface GalleryPageProps {
  onNavigate: (view: string, eventId?: string) => void;
}

interface GalleryItem {
  id: string;
  eventId: string;
  title: string;
  images: string[];
}

export function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [events] = useKV<Event[]>('events', []);
  const [gallery] = useKV<GalleryItem[]>('gallery', []);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; eventTitle: string } | null>(null);

  const getEventDetails = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  // Featured images from recent events
  const featuredImages = [
    {
      src: '/api/placeholder/800/600',
      title: 'Tech Conference 2024 Keynote',
      event: 'Tech Conference 2024',
      category: 'Technology'
    },
    {
      src: '/api/placeholder/800/600',
      title: 'Music Festival Main Stage',
      event: 'Summer Music Festival',
      category: 'Music'
    },
    {
      src: '/api/placeholder/800/600',
      title: 'Business Leadership Panel',
      event: 'Leadership Summit',
      category: 'Business'
    },
    {
      src: '/api/placeholder/800/600',
      title: 'Food Expo Tasting Session',
      event: 'Food & Wine Expo',
      category: 'Food & Drink'
    }
  ];

  const openImageModal = (src: string, title: string, eventTitle: string) => {
    setSelectedImage({ src, title, eventTitle });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/20 via-primary/10 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-accent/20 rounded-full px-4 py-2 mb-4">
              <Images className="w-5 h-5 text-accent mr-2" />
              <span className="text-accent font-semibold">Event Gallery</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Moments That Matter
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Relive the excitement and discover the magic of our past events through these captivating moments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Images */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Featured Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredImages.map((image, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => openImageModal(image.src, image.title, image.event)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-3">
                      <Eye className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{image.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{image.title}</h3>
                  <p className="text-sm text-muted-foreground">{image.event}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Event Galleries */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Event Collections</h2>
          
          {gallery.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Images className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">More galleries coming soon</h3>
              <p className="text-muted-foreground mb-4">
                We're continuously adding photos from our amazing events. Check back for updates!
              </p>
              <Button onClick={() => onNavigate('events')}>
                Browse Upcoming Events
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {gallery.map((galleryItem) => {
                const event = getEventDetails(galleryItem.eventId);
                if (!event) return null;

                return (
                  <div key={galleryItem.id} className="border-b border-border pb-12 last:border-b-0">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {galleryItem.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => onNavigate('event-details', event.id)}
                      >
                        View Event
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryItem.images.map((image, imageIndex) => (
                        <div 
                          key={imageIndex}
                          className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
                          onClick={() => openImageModal(image, `${galleryItem.title} - Photo ${imageIndex + 1}`, event.title)}
                        >
                          <div className="relative w-full h-full">
                            <img 
                              src={image} 
                              alt={`${galleryItem.title} - Photo ${imageIndex + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="bg-white/90 rounded-full p-2">
                                <Eye className="w-4 h-4 text-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Be Part of Our Next Gallery
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join us at upcoming events and become part of our growing collection of memorable moments. 
            Every event is an opportunity to create new stories and connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('events')} size="lg">
              Browse Upcoming Events
            </Button>
            <Button variant="outline" onClick={() => onNavigate('packages')} size="lg">
              Join Membership for Exclusive Access
            </Button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 border-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-6 bg-background">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {selectedImage.title}
                </h3>
                <p className="text-muted-foreground">{selectedImage.eventTitle}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}