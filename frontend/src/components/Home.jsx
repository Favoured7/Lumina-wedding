import React from 'react';
import { Link } from 'react-router-dom';
import weddingImage from "../assets/wedding.jpeg";
import makeup from "../assets/makeup.jpeg";
import photographer from "../assets/photographer.jpeg";
import catering from "../assets/catering.jpeg";
import ceremony from "../assets/ceremony.jpeg";
import honeymoon from "../assets/honeymoon.jpeg";
import books from "../assets/Books.jpeg";
import musician from "../assets/Musician.jpg";
import weddingPlanner from "../assets/weddingplanner.jpg";
import logo from "../assets/logo.jpg";

const Home = () => {
  const services = [
    { 
      id: 'relationship-resources', 
      title: 'Relationship Resources', 
      image: books, 
      description: 'Free book summaries and relationship wisdom to help you build a lasting marriage.', 
      buttonText: 'Learn More', 
      slug: 'resources'  // This must match the category in ServicesPage
    },
    { 
      id: 'makeup-artist', 
      title: 'Makeup Artist', 
      image: makeup, 
      description: 'Expert makeup artistry for weddings, events & everyday glam.', 
      buttonText: 'Book Now', 
      slug: 'makeup'  // This must match the category in ServicesPage
    },
    { 
      id: 'photography', 
      title: 'Photography', 
      image: photographer, 
      description: 'Professional wedding, portrait & event photography you\'ll treasure forever.', 
      buttonText: 'View Portfolio', 
      slug: 'photography'  // This must match the category in ServicesPage
    },
    { 
      id: 'catering', 
      title: 'Catering', 
      image: catering, 
      description: 'Delicious high-quality catering with fresh ingredients and beautiful presentation.', 
      buttonText: 'View Menu', 
      slug: 'catering'  // This must match the category in ServicesPage
    },
    { 
      id: 'ceremony-venues', 
      title: 'Ceremony Venues', 
      image: ceremony, 
      description: 'Stunning venues for weddings, vow renewals & civil ceremonies.', 
      buttonText: 'Explore Venues', 
      slug: 'venues'  // This must match the category in ServicesPage
    },
    { 
      id: 'honeymoon-destinations', 
      title: 'Honeymoon Destinations', 
      image: honeymoon, 
      description: 'Handpicked honeymoon destinations for every couple — relaxation, adventure, or both.', 
      buttonText: 'Plan Your Trip', 
      slug: 'honeymoon'  // This must match the category in ServicesPage
    },
    { 
      id: 'musician-dj', 
      title: 'Musician & DJ', 
      image: musician, 
      description: 'Live music and professional DJ services to keep your guests dancing all night long.', 
      buttonText: 'Book Entertainment', 
      slug: 'musician'  // This must match the category in ServicesPage
    },
    { 
      id: 'wedding-planner', 
      title: 'Wedding Planner', 
      image: weddingPlanner, 
      description: 'Professional wedding planning services to coordinate every detail of your special day.', 
      buttonText: 'Hire a Planner', 
      slug: 'planner'  // This must match the category in ServicesPage
    }
  ];

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${weddingImage})` }}>
        <h1>Lumina Weddings</h1>
        <p>Turning your love story into an unforgettable celebration</p>
      </section>

      <section className="cards-section">
        <h2 className="section-title">Our Services</h2>
        <div className="cards">
          {services.map((service) => (
            <div className="card" key={service.id}>
              <div className="card-image">
                <img src={service.image} alt={service.title} />
              </div>
              <div className="card-header">
                <h3>{service.title}</h3>
              </div>
              <div className="card-text">
                <p>{service.description}</p>
                <Link to={`/services/${service.slug}`} className="card-btn">
                  {service.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">What Our Couples Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="testimonial-text">
              Absolutely amazing service! They made our wedding day perfect and unforgettable.
            </div>
            <div className="testimonial-name">Tianah & Bruce</div>
            <div className="testimonial-role">Married January 2026</div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="testimonial-text">
              Professional, caring, and incredibly talented. The photography was breathtaking!
            </div>
            <div className="testimonial-name">Faye & David</div>
            <div className="testimonial-role">Married February 2026</div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="testimonial-text">
              Every moment captured perfectly. The makeup artist made me look like a princess!
            </div>
            <div className="testimonial-name">Ivy & Willy</div>
            <div className="testimonial-role">Married April 2026</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Lumina Logo" className="footer-logo-image" />
              <h3>Lumina Weddings</h3>
            </div>
            <p>Celebrating love, Creating memories Forever.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Our Services</h4>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link to={`/services/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="footer-contact">
              <p><a href="mailto:info@lumina.com">luminalove.com</a></p>
              <p><a href="tel:+250796599651">+250 796 599 651</a></p>
              <p>Kigali, Rwanda</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Lumina Weddings • Made with love for love by Claudette Umutoni</p>
        </div>
      </footer>
    </>
  );
};

export default Home;