import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PublicLayout = () => (
  <div className="min-h-screen bg-hero-radial">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);