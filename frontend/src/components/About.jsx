import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// Import your image from assets folder - CHANGE THIS TO MATCH YOUR IMAGE FILENAME
import happyImage from '../assets/happy.jpeg';
import { getApiBaseUrl } from '../config/api';

const About = () => {
  const [stats, setStats] = useState({
    happy_couples: 0,
    trusted_vendors: 0,
    successful_events: 0,
    cities_served: 0,
  });
  const fallbackStats = {
    happy_couples: 3,
    trusted_vendors: 6,
    successful_events: 3,
    cities_served: 3,
  };
  const API = getApiBaseUrl();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${API}/api/stats`);
        if (!response.ok) return;
        const data = await response.json();
        setStats(data);
      } catch {
        // Keep defaults
      }
    };
    loadStats();
  }, [API]);

  const displayStat = (key, value) =>
    `${Math.max(fallbackStats[key], Number(value) || 0)}+`;

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Lumina Weddings</h1>
          <p>Creating magical moments for your special day with inspiration from a love for love itself.</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>

              <p>
                Lumina Weddings was born from a simple yet powerful belief: every love story deserves a beautiful, joyful, and stress-free beginning.
              </p>

              <p>
                Founded in 2026 in Rwanda, we are building the wedding planning platform we always wished existed — one that makes planning effortless so couples can focus on what truly matters: celebrating their unique love.
              </p>

              <p>
                We understand how overwhelming wedding planning can feel — searching for the perfect venue, finding trusted vendors, managing budgets, and keeping every detail organized. That is why we are creating intuitive tools, a beautiful experience, and meaningful connections between couples and the best local and international vendors.
              </p>

              <p>
                Our name <strong>Lumina</strong> comes from the Latin word for "light." We believe every couple's love should shine brightly on their special day — and we are here to help it glow.
              </p>

              <p>
                This is just the beginning of our journey, and we can not wait to grow with you.
              </p>
            </div>
            <div className="story-image">
              <img 
                src={happyImage} 
                alt="Happy wedding couple celebrating their special day" 
                className="story-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-card">
            <h3>Our Mission</h3>
            <p>To make wedding planning effortless, enjoyable, and truly memorable by connecting couples with the best trusted vendors and providing powerful, intuitive planning tools.</p>
          </div>
          <div className="vision-card">
            <h3>Our Vision</h3>
            <p>To become the world's most trusted wedding planning platform, celebrating love in all its beautiful forms across every culture and continent.</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Love First</h3>
              <p>Everything we do is driven by love and respect for every couple's unique journey.</p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We strive for excellence in every vendor we partner with and every service we provide.</p>
            </div>
            <div className="value-card">
              <h3>Trust</h3>
              <p>Building trust through transparency, reliability, and honest recommendations.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Constantly improving our platform to make wedding planning easier and more enjoyable.</p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>Supporting local vendors and building a community that celebrates love.</p>
            </div>
            <div className="value-card">
              <h3>Empathy</h3>
              <p>Understanding that every couple's journey is unique and special.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="what-we-offer">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="offer-grid">
            <div className="offer-card">
              <h3>Planning Tools</h3>
              <p>Budget trackers, wedding checklists, and timeline management to keep you organized.</p>
            </div>
            <div className="offer-card">
              <h3>Curated Vendors</h3>
              <p>Hand-picked, verified vendors who meet our quality and service standards.</p>
            </div>
            <div className="offer-card">
              <h3>Marriage Resources</h3>
              <p>Book summaries and relationship wisdom for a strong, lasting marriage.</p>
            </div>
            <div className="offer-card">
              <h3>Honeymoon Planning</h3>
              <p>Dream destination planning for the perfect romantic getaway.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{displayStat("happy_couples", stats.happy_couples)}</div>
              <div className="stat-label">Happy Couples</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{displayStat("trusted_vendors", stats.trusted_vendors)}</div>
              <div className="stat-label">Trusted Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{displayStat("successful_events", stats.successful_events)}</div>
              <div className="stat-label">Successful Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{displayStat("cities_served", stats.cities_served)}</div>
              <div className="stat-label">Cities Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Planning?</h2>
          <p>Join couples across Rwanda who are planning their dream wedding with Lumina.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">Create Free Account</Link>
            <Link to="/contact" className="cta-btn secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
