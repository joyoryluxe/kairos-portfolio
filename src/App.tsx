import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BestShots from './components/BestShots';
import WhyChooseUs from './components/WhyChooseUs';
import Connect from './components/Connect';
import BookingPage from './components/BookingPage';
import AboutPage from './components/AboutPage';
import ServiceDetail from './components/ServiceDetail';
import ServiceGallery from './components/ServiceGallery';
import PricingPage from './components/PricingPage';
import PricingDetail from './components/PricingDetail';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const goToBooking = () => {
    if (location.pathname === '/booking') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/booking');
    }
  };
  const goToHome = () => navigate('/');
  const goToAbout = () => navigate('/about');
  const goToPricing = () => navigate('/pricing');
  const goToPricingDetail = (id: string) => navigate(`/pricing/${id}`);
  const goToService = (serviceId: string) => navigate(`/services/${serviceId}`);

  return (
    <div className="App">
      <Navbar
        onBookNow={goToBooking}
        onHome={goToHome}
        onAbout={goToAbout}
        onPricing={goToPricing}
        onPricingDetailClick={goToPricingDetail}
        onServiceClick={goToService}
      />

      <Routes>
        <Route path="/" element={
          <>
            <Hero onBookNow={goToBooking} />
            <Services onServiceClick={goToService} />
            <BestShots />
            <WhyChooseUs onAboutUs={goToAbout} />
          </>
        } />

        <Route path="/about" element={<AboutPage onBookNow={goToBooking} />} />
        <Route path="/services/:serviceId" element={<ServiceDetail onGetQuote={goToPricingDetail} onBookNow={goToBooking} />} />
        <Route path="/services/:serviceId/gallery/:sectionIndex" element={<ServiceGallery />} />
        <Route path="/pricing" element={<PricingPage onPricingSelect={goToPricingDetail} onBookNow={goToBooking} />} />
        <Route path="/pricing/:id" element={<PricingDetail />} />

        <Route path="/booking" element={<BookingPage onBack={goToHome} />} />
      </Routes>

      <Connect onBookNow={goToBooking} />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
