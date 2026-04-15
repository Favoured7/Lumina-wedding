import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// Import images
import weddingImage from "./assets/wedding.jpeg";
import makeup from "./assets/makeup.jpeg";
import photographer from "./assets/photographer.jpeg";
import catering from "./assets/catering.jpeg";
import ceremony from "./assets/ceremony.jpeg";
import honeymoon from "./assets/honeymoon.jpeg";
import books from "./assets/Books.jpeg";
import logo from "./assets/logo.jpg";

// Import components
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Registration";

import AdminLogin from "./components/AdminLogin";
import CoupleRegister from "./components/CoupleRegister";
import MakeupRegister from "./components/MakeupRegister";
import PhotographerRegister from "./components/PhotographerRegister";
import VenueRegister from "./components/VenueRegister";
import CateringRegister from "./components/CateringRegister";
import AdminRegister from "./components/AdminRegister";

import PhotographerLogin from "./components/PhotoGrapherLogin";
import MakeupLogin from "./components/MakeupLogin";
import VenueLogin from "./components/VenueLogin";
import CateringLogin from "./components/CateringLogin";

function App() {
  const location = useLocation();

  // Hide navbar and main content on authentication pages
  const hideLayout =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <div className="container">
      {/* NAVBAR */}
      {!hideLayout && (
        <nav className="navbar">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <img src={logo} alt="Lumina Logo" className="logo-image" />
              <span className="logo-text">Lumina</span>
            </Link>
          </div>

          <ul className="menu">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            <li className="dropdown">
              <span>Login</span>
              <ul className="submenu">
                <li><Link to="/login">Couple</Link></li>
                <li><Link to="/login/admin">Admin</Link></li>
                <li><Link to="/login/photographer">Photographer</Link></li>
                <li><Link to="/login/makeup">Makeup Artist</Link></li>
                <li><Link to="/login/venue">Venues</Link></li>
                <li><Link to="/login/catering">Catering</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <span>Register</span>
              <ul className="submenu">
                <li><Link to="/register/couple">Couple</Link></li>
                <li><Link to="/register/admin">Admin</Link></li>
                <li><Link to="/register/photographer">Photographer</Link></li>
                <li><Link to="/register/makeup">Makeup Artist</Link></li>
                <li><Link to="/register/venue">Venues</Link></li>
                <li><Link to="/register/catering">Catering</Link></li>
              </ul>
            </li>
          </ul>
        </nav>
      )}

      {/* ROUTES */}
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/photographer" element={<PhotographerLogin />} />
        <Route path="/login/makeup" element={<MakeupLogin />} />
        <Route path="/login/venue" element={<VenueLogin />} />
        <Route path="/login/catering" element={<CateringLogin />} />

        {/* Register Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/register/photographer" element={<PhotographerRegister />} />
        <Route path="/register/makeup" element={<MakeupRegister />} />
        <Route path="/register/venue" element={<VenueRegister />} />
        <Route path="/register/catering" element={<CateringRegister />} />
        <Route path="/register/couple" element={<CoupleRegister />} />
      </Routes>

      {/* MAIN PUBLIC CONTENT - Only shown when not on login/register pages */}
      {!hideLayout && (
        <>
          {/* HERO SECTION */}
          <section
            className="hero"
            style={{ backgroundImage: `url(${weddingImage})` }}
          >
            <h1>Lumina Weddings</h1>
            <p>Turning your love story into an unforgettable celebration</p>
          </section>

          {/* SERVICES SECTION */}
          <section className="cards-section">
            <h2 className="section-title">Our Services</h2>
            <div className="cards">
              <div className="card">
                <div className="card-image">
                  <img src={books} alt="Relationship Resources" />
                </div>
                <div className="card-header">
                  <h3>Relationship Resources</h3>
                </div>
                <div className="card-text">
                  <p>Your relationship library: Marriage &amp; Family Wisdom. Learn, grow, and rise together.</p>
                  <button className="card-btn">Learn More</button>
                </div>
              </div>

              <div className="card">
                <div className="card-image">
                  <img src={makeup} alt="Makeup Artist" />
                </div>
                <div className="card-header">
                  <h3>Makeup Artist</h3>
                </div>
                <div className="card-text">
                  <p>Expert makeup artistry for weddings, events &amp; everyday glam.</p>
                  <button className="card-btn">Book Now</button>
                </div>
              </div>

              <div className="card">
                <div className="card-image">
                  <img src={photographer} alt="Photography" />
                </div>
                <div className="card-header">
                  <h3>Photography</h3>
                </div>
                <div className="card-text">
                  <p>Professional wedding, portrait &amp; event photography you'll treasure forever.</p>
                  <button className="card-btn">View Portfolio</button>
                </div>
              </div>

              <div className="card">
                <div className="card-image">
                  <img src={catering} alt="Catering" />
                </div>
                <div className="card-header">
                  <h3>Catering</h3>
                </div>
                <div className="card-text">
                  <p>Delicious high-quality catering with fresh ingredients and beautiful presentation.</p>
                  <button className="card-btn">View Menu</button>
                </div>
              </div>

              <div className="card">
                <div className="card-image">
                  <img src={ceremony} alt="Ceremony Venues" />
                </div>
                <div className="card-header">
                  <h3>Ceremony Venues</h3>
                </div>
                <div className="card-text">
                  <p>Stunning venues for weddings, vow renewals &amp; civil ceremonies.</p>
                  <button className="card-btn">Explore Venues</button>
                </div>
              </div>

              <div className="card">
                <div className="card-image">
                  <img src={honeymoon} alt="Honeymoon Destinations" />
                </div>
                <div className="card-header">
                  <h3>Honeymoon Destinations</h3>
                </div>
                <div className="card-text">
                  <p>Handpicked honeymoon destinations for every couple — relaxation, adventure, or both.</p>
                  <button className="card-btn">Plan Your Trip</button>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS SECTION */}
          <section className="testimonials-section">
            <h2 className="section-title">What Our Couples Say</h2>
            <div className="testimonials">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                  Absolutely amazing service! They made our wedding day perfect and unforgettable.
                </div>
                <div className="testimonial-name">Tianah &amp; Bruce</div>
                <div className="testimonial-role">Married january 2026</div>
              </div>

              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                  Professional, caring, and incredibly talented. The photography was breathtaking!
                </div>
                <div className="testimonial-name">Faye &amp; David</div>
                <div className="testimonial-role">Married Feb 2026</div>
              </div>

              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                  Every moment captured perfectly. The makeup artist made me look like a princess!
                </div>
                <div className="testimonial-name">Ivy &amp; Willy</div>
                <div className="testimonial-role">Married April 2026</div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
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
                <h4>Services</h4>
                <ul>
                  <li>Makeup Artists</li>
                  <li>Wedding Photography</li>
                  <li>Catering</li>
                  <li>Ceremony Venues</li>
                  <li>Honeymoon Planning</li>
                  <li>Relationship Resources</li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>Contact Us</h4>
                <div className="footer-contact">
                  <p><a href="mailto:info@lumina.com">luminalove.com</a></p>
                  <p><a href="tel:+250796599651">+250 796 599 651</a></p>
              
                </div>
              </div>

              <div className="footer-section">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="https://instagram.com/lumina" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://facebook.com/lumina" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://wa.me/+250796599651" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Lumina Weddings • Made with love for love by Claudette Umutoni</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;