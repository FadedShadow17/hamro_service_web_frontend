'use client';

import { useState, useMemo } from 'react';
import { services } from '@/lib/data/services';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { ServicesFilters } from '@/components/services/ServicesFilters';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.shortDescription.toLowerCase().includes(query) ||
          service.longDescription.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#0A2640] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h1>
            <p className="text-xl text-white/80">
              Choose from a wide range of professional home services. All our service providers are
              verified, skilled, and ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ServicesFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />

        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredServices.length}</span> service
            {filteredServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ServicesGrid services={filteredServices} />
      </section>
    </div>
  );
}

