import React from 'react';
import './css/footer.css'; // Adjust the path to your CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <p className="text-center mb-0">
          © {new Date().getFullYear()} Leave Application System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
