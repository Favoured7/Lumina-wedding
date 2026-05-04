import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ServicesPage.css';

const ServicesPage = () => {
  const { category } = useParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ priceRange: '', location: '' });

  useEffect(() => {
    setTimeout(() => {
      const allVendorData = {
        makeup: [
          { id: 1, name: "Glow by Clarisse", rating: 4.8, reviews: 89, priceRange: "$$", location: "Kigali", category: "makeup", startingPrice: 150, image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop", specialty: "Bridal Makeup", isFree: false },
          { id: 2, name: "Beauty by Lisa", rating: 4.9, reviews: 124, priceRange: "$$$", location: "Kigali", category: "makeup", startingPrice: 250, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop", specialty: "Luxury Bridal", isFree: false },
          { id: 3, name: "Elegant Faces", rating: 4.7, reviews: 56, priceRange: "$$", location: "Musanze", category: "makeup", startingPrice: 120, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop", specialty: "Natural Looks", isFree: false }
        ],
        photography: [
          { id: 1, name: "Umucyo Photography", rating: 4.9, reviews: 124, priceRange: "$$$", location: "Kigali", category: "photography", startingPrice: 1500, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop", specialty: "Wedding Photography", isFree: false },
          { id: 2, name: "Elite Photos", rating: 4.8, reviews: 98, priceRange: "$$$", location: "Kigali", category: "photography", startingPrice: 1200, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop", specialty: "Luxury Portraits", isFree: false }
        ],
        catering: [
          { id: 1, name: "Africana Catering", rating: 4.8, reviews: 203, priceRange: "$$$", location: "Kigali", category: "catering", startingPrice: 2500, image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop", specialty: "Rwandan Cuisine", isFree: false },
          { id: 2, name: "Tasty Catering", rating: 4.7, reviews: 156, priceRange: "$$", location: "Kigali", category: "catering", startingPrice: 1800, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", specialty: "International Fusion", isFree: false }
        ],
        venues: [
          { id: 1, name: "Kigali Heights Venue", rating: 4.8, reviews: 156, priceRange: "$$$$", location: "Kigali", category: "venues", startingPrice: 5000, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop", specialty: "Luxury Venue", isFree: false },
          { id: 2, name: "Grand Palace", rating: 4.7, reviews: 89, priceRange: "$$$$", location: "Kigali", category: "venues", startingPrice: 4500, image: "https://images.unsplash.com/photo-1464366400600-7168b5af6536?w=400&h=300&fit=crop", specialty: "Elegant Hall", isFree: false }
        ],
        honeymoon: [
          { id: 1, name: "Zanzibar Beach Paradise", rating: 4.9, reviews: 234, location: "Zanzibar, Tanzania", category: "honeymoon", image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&h=300&fit=crop", specialty: "Beach & Relaxation", isFree: true, description: "White sandy beaches, crystal clear waters, and stunning sunsets" },
          { id: 2, name: "Kenyan Safari Adventure", rating: 4.8, reviews: 189, location: "Maasai Mara, Kenya", category: "honeymoon", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop", specialty: "Safari & Wildlife", isFree: true, description: "Experience the wild side of Africa with luxury safari lodges" },
          { id: 3, name: "Seychelles Luxury Escape", rating: 4.9, reviews: 312, location: "Seychelles", category: "honeymoon", image: "https://images.unsplash.com/photo-1540202404-af58c6bd198b?w=400&h=300&fit=crop", specialty: "Luxury Island", isFree: true, description: "Private villas and turquoise waters in paradise" },
          { id: 4, name: "Moroccan Desert Romance", rating: 4.7, reviews: 156, location: "Marrakech, Morocco", category: "honeymoon", image: "https://images.unsplash.com/photo-1517824707154-9043025a9f2f?w=400&h=300&fit=crop", specialty: "Desert & Culture", isFree: true, description: "Exotic markets, desert camps, and luxurious riads" },
          { id: 5, name: "Paris City of Love", rating: 4.8, reviews: 278, location: "Paris, France", category: "honeymoon", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", specialty: "City Romance", isFree: true, description: "Eiffel Tower views, fine dining, and romantic walks" },
          { id: 6, name: "Maldives Overwater Villa", rating: 5.0, reviews: 456, location: "Maldives", category: "honeymoon", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop", specialty: "Overwater Bungalows", isFree: true, description: "Ultimate luxury honeymoon destination" }
        ],
        musician: [
          { id: 1, name: "Kigali Entertainment", rating: 4.7, reviews: 203, priceRange: "$$", location: "Kigali", category: "musician", startingPrice: 800, image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&h=300&fit=crop", specialty: "DJ & MC", isFree: false },
          { id: 2, name: "Melody Strings", rating: 4.8, reviews: 134, priceRange: "$$$", location: "Kigali", category: "musician", startingPrice: 1200, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop", specialty: "Live Band", isFree: false }
        ],
        planner: [
          { id: 1, name: "Elegant Weddings", rating: 4.9, reviews: 156, priceRange: "$$$", location: "Kigali", category: "planner", startingPrice: 2000, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop", specialty: "Full Planning", isFree: false },
          { id: 2, name: "Perfect Day Planners", rating: 4.8, reviews: 234, priceRange: "$$$", location: "Kigali", category: "planner", startingPrice: 1800, image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop", specialty: "Coordination", isFree: false }
        ],
        resources: [
          { id: 1, name: "The 5 Love Languages", author: "Gary Chapman", rating: 4.9, reviews: 1245, category: "resources", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", specialty: "Communication", isFree: true, description: "Discover the secret to lasting love by understanding your partner's love language. This book has transformed millions of relationships worldwide.", summary: "The 5 Love Languages shows how different people give and receive love in different ways: Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, and Physical Touch. Learning your partner's primary love language can revolutionize your relationship.", readLink: "https://www.5lovelanguages.com/book", pages: 208 },
          { id: 2, name: "Hold Me Tight", author: "Dr. Sue Johnson", rating: 4.8, reviews: 892, category: "resources", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop", specialty: "Emotional Connection", isFree: true, description: "Seven conversations for a lifetime of love based on Emotionally Focused Therapy.", summary: "Dr. Sue Johnson presents seven transformative conversations that help couples understand and reshape their emotional bonds. Learn to recognize negative patterns and create a secure, lasting relationship.", readLink: "https://drsuejohnson.com/hold-me-tight/", pages: 320 },
          { id: 3, name: "The Seven Principles for Making Marriage Work", author: "John Gottman", rating: 4.9, reviews: 2103, category: "resources", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop", specialty: "Marital Success", isFree: true, description: "Based on 40+ years of research on what makes marriages succeed or fail.", summary: "Dr. John Gottman's research reveals the seven principles that guide couples on the path to a harmonious and long-lasting relationship. Includes practical exercises and techniques to strengthen your marriage.", readLink: "https://www.gottman.com/product/seven-principles-making-marriage-work/", pages: 304 },
          { id: 4, name: "Attached", author: "Amir Levine", rating: 4.7, reviews: 756, category: "resources", image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=300&fit=crop", specialty: "Attachment Theory", isFree: true, description: "The new science of adult attachment and how it can help you find and keep love.", summary: "Attached guides you through understanding your attachment style—secure, anxious, or avoidant—and how it affects your relationships. Learn to find compatible partners and build healthier connections.", readLink: "https://www.attachedthebook.com/", pages: 304 },
          { id: 5, name: "The Meaning of Marriage", author: "Timothy Keller", rating: 4.8, reviews: 567, category: "resources", image: "https://images.unsplash.com/photo-1493345691303-9e3d3db6ddb9?w=400&h=300&fit=crop", specialty: "Spiritual Growth", isFree: true, description: "A profound exploration of what marriage is and can be from a faith perspective.", summary: "Timothy Keller offers a unique perspective on marriage, exploring its spiritual significance and practical applications. Discover how marriage can be a journey of grace, love, and personal growth.", readLink: "https://timothykeller.com/books/the-meaning-of-marriage", pages: 288 }
        ]
      };
      
      setVendors(allVendorData[category] || []);
      setLoading(false);
    }, 500);
  }, [category]);

  const getTitle = () => {
    const titles = {
      makeup: "Makeup Artists",
      photography: "Wedding Photographers", 
      catering: "Catering Services",
      venues: "Wedding Venues",
      honeymoon: "Dream Honeymoon Destinations ✨",
      musician: "Musicians & DJs",
      planner: "Wedding Planners",
      resources: "Relationship Resources Library 📚"
    };
    return titles[category] || "Services";
  };

  const getDescription = () => {
    const descriptions = {
      makeup: "Find the perfect makeup artist to make you look and feel beautiful on your special day",
      photography: "Capture every precious moment with our talented wedding photographers",
      catering: "Delicious catering options to delight your guests",
      venues: "Stunning venues for your dream wedding ceremony and reception",
      honeymoon: "Discover amazing honeymoon destinations around the world - Free inspiration and travel guides",
      musician: "Live music and DJs to keep your guests dancing",
      planner: "Expert wedding planners to bring your vision to life",
      resources: "Free book summaries and relationship wisdom to help you build a lasting marriage"
    };
    return descriptions[category] || "Find the perfect vendor for your special day";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    while (stars.length < 5) {
      stars.push(<i key={`empty-${stars.length}`} className="far fa-star"></i>);
    }
    return stars;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>{getTitle()}</h1>
        <p>{getDescription()}</p>
        {category === 'resources' && (
          <div className="free-badge-header">
            <i className="fas fa-graduation-cap"></i> Free Educational Resources
          </div>
        )}
        {category === 'honeymoon' && (
          <div className="free-badge-header">
            <i className="fas fa-umbrella-beach"></i> Free Destination Inspiration
          </div>
        )}
      </div>

      <div className="services-container">
        {(category !== 'resources' && category !== 'honeymoon') && (
          <div className="filters-sidebar">
            <h3>Filter By</h3>
            <div className="filter-group">
              <label>Price Range</label>
              <select onChange={(e) => setFilters({...filters, priceRange: e.target.value})}>
                <option value="">All</option>
                <option value="$">$ - Budget</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Premium</option>
                <option value="$$$$">$$$$ - Luxury</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Location</label>
              <select onChange={(e) => setFilters({...filters, location: e.target.value})}>
                <option value="">All</option>
                <option value="Kigali">Kigali</option>
                <option value="Musanze">Musanze</option>
                <option value="Rubavu">Rubavu</option>
              </select>
            </div>
          </div>
        )}

        <div className={`${(category === 'resources' || category === 'honeymoon') ? 'full-width-list' : 'vendors-list'}`}>
          {vendors.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h3>No items found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            vendors.map(vendor => (
              <div key={vendor.id} className={`${category === 'resources' ? 'resource-card' : category === 'honeymoon' ? 'destination-card' : 'vendor-card'}`}>
                <div className="card-image">
                  <img src={vendor.image} alt={vendor.name} />
                  {vendor.isFree && (
                    <div className="free-badge">
                      <i className="fas fa-gift"></i> Free
                    </div>
                  )}
                </div>
                <div className="card-details">
                  <h2>{vendor.name}</h2>
                  {category === 'resources' && (
                    <>
                      <div className="resource-author">by {vendor.author}</div>
                      <div className="resource-specialty">{vendor.specialty}</div>
                      <p className="resource-description">{vendor.description}</p>
                      <div className="resource-summary">
                        <i className="fas fa-book-open"></i> {vendor.summary}
                      </div>
                      <div className="resource-meta">
                        <span><i className="fas fa-file-alt"></i> {vendor.pages} pages</span>
                        <div className="resource-rating">
                          {renderStars(vendor.rating)} ({vendor.reviews} reviews)
                        </div>
                      </div>
                      <a href={vendor.readLink} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                        <i className="fas fa-external-link-alt"></i> Read Full Book
                      </a>
                    </>
                  )}
                  
                  {category === 'honeymoon' && (
                    <>
                      <div className="destination-specialty">{vendor.specialty}</div>
                      <div className="destination-location">
                        <i className="fas fa-map-marker-alt"></i> {vendor.location}
                      </div>
                      <p className="destination-description">{vendor.description}</p>
                      <div className="destination-rating">
                        {renderStars(vendor.rating)}
                        <span>({vendor.reviews} reviews from couples)</span>
                      </div>
                      <button className="explore-btn" onClick={() => alert(`Explore ${vendor.name}\n\nThis is a free destination guide. Check back soon for detailed itineraries and travel tips!`)}>
                        <i className="fas fa-compass"></i> Explore Destination
                      </button>
                    </>
                  )}
                  
                  {(category !== 'resources' && category !== 'honeymoon') && (
                    <>
                      <div className="vendor-specialty">{vendor.specialty}</div>
                      <div className="vendor-rating">
                        {renderStars(vendor.rating)}
                        <span>({vendor.reviews} reviews)</span>
                      </div>
                      <div className="vendor-info">
                        <span className="price">{vendor.priceRange}</span>
                        <span className="location">
                          <i className="fas fa-map-marker-alt"></i> {vendor.location}
                        </span>
                      </div>
                      <p className="starting-price">Starting from ${vendor.startingPrice}</p>
                      <Link to={`/services/${category}/${vendor.id}`} className="view-details-btn">
                        View Details <i className="fas fa-arrow-right"></i>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;