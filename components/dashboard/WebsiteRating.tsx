'use client';

import { useState } from 'react';
import { createContact } from '@/lib/contact/contact.api';
import { useToastContext } from '@/providers/ToastProvider';

export function WebsiteRating() {
  const toast = useToastContext();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters in your comment');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const subject = `Website Rating: ${rating} Star${rating > 1 ? 's' : ''}`;
      const message = `Rating: ${rating}/5 stars\n\nComment:\n${comment}`;

      await createContact({
        subject,
        message,
        category: 'General',
      });

      setIsSubmitted(true);
      toast.success('Thank you for your feedback!');
      
      // Reset form after a delay
      setTimeout(() => {
        setRating(0);
        setComment('');
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] border border-[#69E6A6]/50 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-white text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-white/70">Your feedback has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] border border-white/10 p-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Rate Your Experience
        </h2>
        <p className="text-white/70 text-lg">
          Help us improve by sharing your thoughts about our website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-white font-semibold mb-3">
            How would you rate your experience? <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/50 rounded-lg p-1"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <svg
                  className={`w-10 h-10 transition-colors duration-200 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-white/30 fill-white/10'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-4 text-white/70 text-sm">
                {rating} star{rating > 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label htmlFor="comment" className="block text-white font-semibold mb-3">
            Share your thoughts <span className="text-red-400">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you think about the website, what you liked, or what we can improve..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-[#0A2640] border border-white/10 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all resize-none"
            required
            minLength={10}
            maxLength={5000}
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-white/50 text-xs">
              Minimum 10 characters required
            </p>
            <p className="text-white/50 text-xs">
              {comment.length}/5000 characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="px-8 py-3 bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] disabled:from-white/20 disabled:to-white/10 disabled:cursor-not-allowed text-[#0A2640] font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

