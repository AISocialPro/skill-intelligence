// app/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaRocket, FaVideo, FaUsers, FaCode, FaShareAlt,
  FaHeartbeat, FaSeedling, FaCity, FaUserGraduate, 
  FaChartLine, FaRoad, FaMedal, FaBolt, FaUserTie,
  FaTwitter, FaLinkedin, FaGithub, FaYoutube, FaDiscord,
  FaChevronUp, FaCheckCircle, FaHeart, FaArrowRight,
  FaCheck, FaInfoCircle, FaGraduationCap, FaSignInAlt,
  FaUserPlus, FaPlayCircle, FaEye
} from 'react-icons/fa';
export default function LandingPage() {
  const [count, setCount] = useState(10);
  const [userCount, setUserCount] = useState(12000);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const router = useRouter();

  const bgElementsRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<any>(null);

  // Create animated background elements
  useEffect(() => {
    const bgContainer = bgElementsRef.current;
    if (!bgContainer) return;

    const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#4cc9f0', '#f72585'];
    const elementCount = 20;

    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      const size = Math.random() * 60 + 20;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 15 + 20;
      const type = Math.random() > 0.7 ? 'square' : Math.random() > 0.5 ? 'triangle' : 'circle';
      const color = colors[Math.floor(Math.random() * colors.length)];

      element.className = 'bg-element';
      if (type === 'square') element.classList.add('square');
      if (type === 'triangle') element.classList.add('triangle');

      element.style.cssText = `
        position: absolute;
        border-radius: ${type === 'square' ? '20%' : '50%'};
        opacity: ${Math.random() * 0.05 + 0.02};
        animation: floatElement ${duration}s infinite linear;
        animation-delay: -${delay}s;
        left: ${posX}%;
        top: ${posY}%;
      `;

      if (type !== 'triangle') {
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.background = color;
      } else {
        element.style.width = '0';
        element.style.height = '0';
        element.style.background = 'transparent';
        element.style.borderLeft = '25px solid transparent';
        element.style.borderRight = '25px solid transparent';
        element.style.borderBottom = `43px solid ${color}`;
        element.style.borderRadius = '0';
      }

      bgContainer.appendChild(element);
    }

    return () => {
      if (bgContainer) {
        bgContainer.innerHTML = '';
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Animate user count
  useEffect(() => {
    const targetCount = 12847;
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = (targetCount - 12000) / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setUserCount(prev => {
        const newValue = prev + increment;
        if (step >= steps) {
          clearInterval(timer);
          return targetCount;
        }
        return Math.floor(newValue);
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.domain-card, .step, .achievement-badge').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Notification timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Helper functions
  const showNotification = (message: string, type: 'info' | 'success' = 'info') => {
    setNotification({ message, type });
  };

  const handleRegister = () => {
    setIsLoading(true);
    router.push('/auth/register');
  };

  const handleLogin = () => {
    setIsLoading(true);
    router.push('/auth/login');
  };

  const handleDemo = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CSS as string for inline styles
  const styles = `
    @keyframes floatElement {
      0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
      25% { transform: translateY(-40px) rotate(90deg) scale(1.1); }
      50% { transform: translateY(20px) rotate(180deg) scale(0.9); }
      75% { transform: translateY(-20px) rotate(270deg) scale(1.05); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(60px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes pulseSoft {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(67, 97, 238, 0.2); }
      50% { box-shadow: 0 0 30px rgba(67, 97, 238, 0.4); }
    }

    @keyframes bounceSoft {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes rotateSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes progressFill {
      from { width: 0; }
      to { width: var(--progress-width, 75%); }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out forwards;
    }
  `;

  return (
    <>
      <style jsx global>{styles}</style>
      
      {/* CSS Variables and Global Styles */}
      <style jsx global>{`
        :root {
          --primary-color: #4361ee;
          --primary-light: #4895ef;
          --secondary-color: #3a0ca3;
          --accent-color: #7209b7;
          --success-color: #4cc9f0;
          --warning-color: #f72585;
          
          --light-bg: #f8f9fa;
          --card-bg: #ffffff;
          --text-primary: #2b2d42;
          --text-secondary: #6c757d;
          --border-color: #e9ecef;
          
          --gradient-primary: linear-gradient(135deg, #4361ee, #3a0ca3);
          --gradient-secondary: linear-gradient(135deg, #4cc9f0, #4361ee);
          --gradient-accent: linear-gradient(135deg, #7209b7, #f72585);
          
          --card-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          --card-shadow-hover: 0 15px 40px rgba(67, 97, 238, 0.15);
          --transition-smooth: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          --border-radius: 16px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: var(--light-bg);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }

        .bg-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        header {
          padding: 25px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid var(--border-color);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.8em;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .logo:hover {
          transform: translateY(-2px);
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          font-size: 1.4em;
          box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
          animation: bounceSoft 3s infinite;
          position: relative;
          overflow: hidden;
        }

        .logo-icon::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent 20%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 80%
          );
          animation: shimmer 3s infinite;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-main {
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.5px;
        }

        .logo-sub {
          font-size: 0.6em;
          color: var(--text-secondary);
          font-weight: 500;
          letter-spacing: 1px;
        }

        .nav-buttons {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .nav-button {
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
          border: none;
          font-size: 0.95em;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
        }

        .login-btn {
          background: transparent;
          color: black;
          border: 2px solid var(--primary-color);
        }

        .login-btn:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
        }

        .register-btn {
          background: var(--gradient-primary);
          color: black;
          border: none;
          animation: glow 3s infinite;
          position: relative;
          overflow: hidden;
        }

        .register-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.5s;
        }

        .register-btn:hover::before {
          left: 100%;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(67, 97, 238, 0.4);
          animation: pulseSoft 0.5s ease;
        }

        /* Hero Section */
        .hero {
          text-align: center;
          padding: 100px 0;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .countdown {
          display: inline-block;
          background: var(--card-bg);
          padding: 12px 30px;
          border-radius: 50px;
          margin-bottom: 40px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          animation: slideInRight 0.8s ease-out 0.6s both;
        }

        .countdown-number {
          font-size: 2.2em;
          font-weight: 800;
          color: black;
          animation: pulseSoft 2s infinite;
          display: inline-block;
        }

        .hero h1 {
          font-size: 3.2em;
          margin-bottom: 25px;
          line-height: 1.2;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary), var(--primary-color));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          position: relative;
        }

        .hero h1::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: var(--gradient-primary);
          border-radius: 2px;
        }

        .hero-subtitle {
          font-size: 1.25em;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto 50px;
          line-height: 1.7;
        }

        .progress-container {
          max-width: 600px;
          margin: 40px auto;
          background: var(--card-bg);
          padding: 25px;
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: var(--border-color);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 6px;
          width: 0;
          animation: progressFill 2s ease-out 1s forwards;
          --progress-width: 75%;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 50px;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 1s both;
        }

        .cta-button {
          padding: 18px 40px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1em;
          cursor: pointer;
          transition: var(--transition-smooth);
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .demo-btn {
          background: var(--card-bg);
          color: black;
          border: 2px solid var(--primary-color);
        }

        .demo-btn:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 30px rgba(67, 97, 238, 0.2);
        }

        .achievement-badges {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 50px;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 1.2s both;
        }

        .achievement-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--card-bg);
          padding: 15px 25px;
          border-radius: 50px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          transition: var(--transition-smooth);
        }

        .achievement-badge:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: var(--card-shadow-hover);
          border-color: var(--primary-light);
        }

        .badge-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          font-size: 1.2em;
        }

        /* Domain Cards */
        .domains-section {
          padding: 100px 0;
        }

        .section-title {
          text-align: center;
          font-size: 2.5em;
          margin-bottom: 70px;
          font-weight: 800;
          color: var(--text-primary);
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: var(--gradient-primary);
          border-radius: 2px;
        }

        .domain-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .domain-card {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 40px;
          transition: var(--transition-smooth);
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
        }

        .domain-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.4s ease;
          transform-origin: left;
        }

        .domain-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: var(--card-shadow-hover);
        }

        .domain-card:hover::before {
          transform: scaleX(1);
        }

        .domain-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5em;
          color: white;
          margin-bottom: 25px;
          transition: var(--transition-smooth);
        }

        .domain-card:hover .domain-icon {
          transform: rotate(10deg) scale(1.1);
        }

        .domain-card h3 {
          font-size: 1.6em;
          margin-bottom: 15px;
          color: var(--text-primary);
          font-weight: 700;
        }

        .domain-card p {
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .domain-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid var(--border-color);
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 1.8em;
          font-weight: 800;
          display: block;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.9em;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* How It Works */
        .how-it-works {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: var(--border-radius);
          margin: 40px 0;
          position: relative;
          overflow: hidden;
        }

        .steps-container {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 40px;
          margin-top: 60px;
          position: relative;
          z-index: 1;
        }

        .steps-container::before {
          content: '';
          position: absolute;
          top: 80px;
          left: 10%;
          right: 10%;
          height: 3px;
          background: linear-gradient(90deg, 
            var(--primary-color) 0%, 
            var(--primary-light) 50%, 
            var(--primary-color) 100%);
          z-index: 0;
          animation: progressFill 2s ease-out;
          --progress-width: 80%;
        }

        .step {
          flex: 1;
          text-align: center;
          position: relative;
          z-index: 1;
          background: var(--card-bg);
          padding: 40px 30px;
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          transition: var(--transition-smooth);
        }

        .step:hover {
          transform: translateY(-8px);
          box-shadow: var(--card-shadow-hover);
        }

        .step-number {
          width: 70px;
          height: 70px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8em;
          font-weight: 800;
          margin: 0 auto 30px;
          color: black;
          box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
          position: relative;
          overflow: hidden;
        }

        .step-number::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: rotateSlow 10s linear infinite;
        }

        .step-icon {
          font-size: 2.5em;
          margin-bottom: 20px;
          display: block;
          color: var(--primary-color);
          transition: var(--transition-smooth);
        }

        .step:hover .step-icon {
          transform: scale(1.2);
        }

        .step h3 {
          font-size: 1.4em;
          margin-bottom: 15px;
          color: var(--text-primary);
          font-weight: 700;
        }

        .step p {
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .step-connector {
          position: absolute;
          top: 35px;
          right: -20px;
          font-size: 2em;
          color: var(--primary-light);
          z-index: 2;
          background: var(--card-bg);
          padding: 10px;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          animation: bounceSoft 2s infinite;
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          padding: 100px 0;
          position: relative;
        }

        .cta-card {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 70px 50px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(67, 97, 238, 0.03) 50%,
            transparent 70%
          );
          animation: shimmer 3s infinite;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-size: 2.5em;
          margin-bottom: 25px;
          font-weight: 800;
          color: var(--text-primary);
          position: relative;
          display: inline-block;
        }

        .cta-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: var(--gradient-primary);
          border-radius: 2px;
        }

        .cta-subtitle {
          font-size: 1.2em;
          color: var(--text-secondary);
          margin-bottom: 40px;
          line-height: 1.7;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .user-count {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: var(--card-bg);
          padding: 15px 30px;
          border-radius: 50px;
          margin-bottom: 40px;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--border-color);
          animation: pulseSoft 3s infinite;
        }

        /* Footer */
        footer {
          padding: 80px 0 30px;
          background: linear-gradient(135deg, #2b2d42, #1a1c2e);
          color: white;
          margin-top: 60px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 50px;
          margin-bottom: 50px;
        }

        .footer-section h3 {
          font-size: 1.3em;
          margin-bottom: 25px;
          color: white;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }

        .footer-section h3::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: var(--primary-color);
          border-radius: 2px;
        }

        .team-members {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .team-member {
          display: flex;
          align-items: center;
          gap: 15px;
          color: rgba(255, 255, 255, 0.8);
          transition: var(--transition-smooth);
          padding: 10px;
          border-radius: 8px;
        }

        .team-member:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .member-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: black;
          font-size: 1.1em;
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tech-badge {
          background: rgba(255, 255, 255, 0.9);
          padding: 10px 18px;
          border-radius: 25px;
          font-size: 0.9em;
          transition: var(--transition-smooth);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: black;
        }

        .tech-badge:hover {
          background: var(--primary-color);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }

        .social-link {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
          color: black;
          text-decoration: none;
          font-size: 1.1em;
        }

        .social-link:hover {
          background: var(--primary-color);
          transform: translateY(-5px) rotate(5deg);
          box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
        }

        .copyright {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95em;
          line-height: 1.6;
        }

        /* Demo Modal */
        .demo-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 50px;
          max-width: 500px;
          width: 90%;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          animation: slideInRight 0.4s ease-out;
        }

        .close-modal {
          position: absolute;
          top: 25px;
          right: 25px;
          background: var(--border-color);
          border: none;
          color: var(--text-secondary);
          font-size: 1.8em;
          cursor: pointer;
          transition: var(--transition-smooth);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-modal:hover {
          background: var(--primary-color);
          color: white;
          transform: rotate(90deg);
        }

        .demo-dashboard-preview {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 15px;
          padding: 35px;
          margin: 30px 0;
          text-align: center;
          border: 1px solid var(--border-color);
        }

        .dashboard-mockup {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 25px 0;
        }

        .mockup-item {
          height: 70px;
          background: var(--card-bg);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9em;
          font-weight: 600;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          transition: var(--transition-smooth);
        }

        .mockup-item:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-3px);
        }

        /* Scroll to top button */
        .scroll-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: var(--gradient-primary);
          color: black;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          box-shadow: 0 8px 25px rgba(67, 97, 238, 0.3);
          transition: var(--transition-smooth);
          z-index: 1000;
          animation: bounceSoft 2s infinite;
        }

        .scroll-top:hover {
          transform: translateY(-5px) scale(1.1);
          animation: none;
        }

        /* Notification Toast */
        .notification-toast {
          position: fixed;
          top: 30px;
          right: 30px;
          background: var(--gradient-primary);
          color: white;
          padding: 18px 30px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(67, 97, 238, 0.3);
          z-index: 2000;
          animation: slideInRight 0.3s ease-out;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 400px;
        }

        /* Loading Animation */
        .loading {
          display: inline-block;
          width: 22px;
          height: 22px;
          border: 3px solid rgba(67, 97, 238, 0.3);
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: rotateSlow 1s linear infinite;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .steps-container {
            flex-direction: column;
            gap: 50px;
          }
          
          .steps-container::before {
            display: none;
          }
          
          .step-connector {
            display: none;
          }
          
          .hero h1 {
            font-size: 2.8em;
          }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.3em;
          }
          
          .domain-cards {
            grid-template-columns: 1fr;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-button {
            width: 100%;
            max-width: 300px;
          }
          
          .nav-buttons {
            flex-direction: column;
            gap: 12px;
          }
          
          header {
            flex-direction: column;
            gap: 25px;
            padding: 20px 0;
          }
          
          .section-title {
            font-size: 2em;
          }
          
          .cta-title {
            font-size: 2em;
          }
          
          .modal-content {
            padding: 30px;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 1.9em;
          }
          
          .hero-subtitle {
            font-size: 1.1em;
          }
          
          .section-title {
            font-size: 1.7em;
          }
          
          .step {
            padding: 30px 20px;
          }
          
          .cta-card {
            padding: 40px 25px;
          }
          
          .logo {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .logo-text {
            align-items: center;
          }
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="bg-elements" ref={bgElementsRef} />

      {/* Scroll to top button */}
      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <FaChevronUp />
        </button>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="notification-toast">
          {notification.type === 'success' ? (
            <FaCheckCircle style={{ color: '#2ecc71', fontSize: '1.2em' }} />
          ) : (
            <FaInfoCircle style={{ color: '#4361ee', fontSize: '1.2em' }} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Demo Modal */}
      {showModal && (
        <div className="demo-modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>
              <FaGraduationCap style={{ marginRight: '10px' }} />
              Interactive Demo Preview
            </h2>
            
            <div className="demo-dashboard-preview">
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                <FaUserTie style={{ marginRight: '10px' }} />
                Sample Learning Dashboard
              </h3>
              
              <div className="dashboard-mockup">
                <div className="mockup-item">Profile</div>
                <div className="mockup-item">Skills</div>
                <div className="mockup-item">Level: 15</div>
                <div className="mockup-item">XP: 2450</div>
                <div className="mockup-item">Courses</div>
                <div className="mockup-item">Projects</div>
              </div>
              
              <div style={{ margin: '30px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Learning Progress</span>
                  <span style={{ color: 'var(--primary-color)' }}>75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ '--progress-width': '75%' } as React.CSSProperties} />
                </div>
              </div>
              
              <div style={{ color: 'var(--text-secondary)', marginBottom: '30px', textAlign: 'left', padding: '0 10px' }}>
                <p><FaCheckCircle style={{ color: 'var(--success-color)', marginRight: '10px' }} /> Personalized skill tracking</p>
                <p><FaCheckCircle style={{ color: 'var(--success-color)', marginRight: '10px' }} /> Interactive learning paths</p>
                <p><FaCheckCircle style={{ color: 'var(--success-color)', marginRight: '10px' }} /> Real-time progress analytics</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                className="cta-button register-btn" 
                style={{ width: '100%', marginBottom: '15px' }}
                onClick={() => {
                  closeModal();
                  handleRegister();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading" />
                ) : (
                  <FaUserPlus />
                )}
                {isLoading ? 'Creating Account...' : 'Start Free Account'}
              </button>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95em' }}>
                Experience the full interactive learning platform
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="container">
        <a href="#" className="logo">
          <div className="logo-icon">
            <FaGraduationCap />
          </div>
          <div className="logo-text">
            <span className="logo-main">SkillQuest</span>
            <span className="logo-sub">AI LEARNING PLATFORM</span>
          </div>
        </a>
        <div className="nav-buttons">
          <button 
            className="nav-button login-btn" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FaSignInAlt />
            )}
            {isLoading ? 'Connecting...' : 'Login'}
          </button>
          <button 
            className="nav-button register-btn" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FaUserPlus />
            )}
            {isLoading ? 'Creating...' : 'Get Started'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content">
          <div
  className="countdown"
  style={{
    color: "var(--primary-color)",
    fontWeight: 700,
    marginBottom: "15px",
  }}
>

            Master your career in <span className="countdown-number">{count}</span> seconds
          </div>
          <h1>Skill Intelligence System for<br />Healthcare, AgriTech & Smart Cities</h1>
          <p className="hero-subtitle">
            Transform your career with our AI-powered learning ecosystem. Track progress, complete challenges, 
            and achieve mastery through personalized, gamified learning experiences designed for modern professionals.
          </p>
          
          <div className="progress-container">
            <div className="progress-label" >
              <span>Average Skill Improvement</span>
              <span>75%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
          
          <div className="hero-buttons">
            <button 
            className="nav-button login-btn" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FaSignInAlt />
            )}
            {isLoading ? 'Connecting...' : 'Login'}
          </button>
          <button 
            className="nav-button register-btn" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FaUserPlus />
            )}
            {isLoading ? 'Creating...' : 'Get Started'}
          </button>
          </div>
          
          {/* Achievement Badges */}
          <div className="achievement-badges">
            <div className="achievement-badge">
              <div className="badge-icon">
                <FaMedal />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Pathfinder</div>
                <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>First Achievement</div>
              </div>
            </div>
            <div className="achievement-badge">
              <div className="badge-icon">
                <FaBolt />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Fast Learner</div>
                <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>Complete 5 courses</div>
              </div>
            </div>
            <div className="achievement-badge">
              <div className="badge-icon">
                <FaUsers />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Collaborator</div>
                <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>Community Contributor</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Cards Section */}
      <section className="domains-section container">
        <h2 className="section-title">Specialized Learning Domains</h2>
        <div className="domain-cards">
          {/* Healthcare Card */}
          <div className="domain-card">
            <div className="domain-icon">
              <FaHeartbeat />
            </div>
            <h3>Healthcare Informatics</h3>
            <p>Master digital health solutions, EHR systems, and medical data analytics. Learn cutting-edge healthcare technology and patient data management.</p>
            <div className="domain-stats">
              <div className="stat">
                <span className="stat-number">2.4K+</span>
                <span className="stat-label">Active Learners</span>
              </div>
              <div className="stat">
                <span className="stat-number">85%</span>
                <span className="stat-label">Job Success</span>
              </div>
            </div>
          </div>
          
          {/* Agriculture Card */}
          <div className="domain-card">
            <div className="domain-icon">
              <FaSeedling />
            </div>
            <h3>AgriTech Systems</h3>
            <p>Revolutionize agriculture with precision farming, IoT sensors, and sustainable practices. Learn smart farming technology and crop analytics.</p>
            <div className="domain-stats">
              <div className="stat">
                <span className="stat-number">1.8K+</span>
                <span className="stat-label">Active Learners</span>
              </div>
              <div className="stat">
                <span className="stat-number">92%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>
          
          {/* Urban Card */}
          <div className="domain-card">
            <div className="domain-icon">
              <FaCity />
            </div>
            <h3>Smart City Systems</h3>
            <p>Build future cities with urban planning, IoT networks, and sustainable infrastructure. Master traffic management and smart grid systems.</p>
            <div className="domain-stats">
              <div className="stat">
                <span className="stat-number">3.1K+</span>
                <span className="stat-label">Active Learners</span>
              </div>
              <div className="stat">
                <span className="stat-number">88%</span>
                <span className="stat-label">Career Growth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works container">
        <h2 className="section-title">Learning Journey Path</h2>
        <div className="steps-container">
          {/* Step 1 */}
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon"><FaUserGraduate /></div>
            <h3>Build Profile</h3>
            <p>Create your personalized skill profile with AI-powered analysis of your current expertise and career goals.</p>
          </div>
          
          <div className="step-connector">
            <FaArrowRight />
          </div>
          
          {/* Step 2 */}
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon"><FaChartLine /></div>
            <h3>Skill Assessment</h3>
            <p>Take interactive assessments to measure your skills with detailed analytics and personalized feedback.</p>
          </div>
          
          <div className="step-connector">
            <FaArrowRight />
          </div>
          
          {/* Step 3 */}
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon"><FaRoad /></div>
            <h3>Get Roadmap</h3>
            <p>Receive a personalized learning path with courses, projects, and milestones tailored to your goals.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container">
        <div className="cta-card">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Career?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals who have accelerated their careers with SkillQuest. 
              Start your personalized learning journey today and unlock your full potential.
            </p>
            
            <div className="user-count" style={{
    color: "var(--primary-color)",
    fontWeight: 700,
    marginBottom: "15px",
  }}>
              <FaUsers />
              <span>{userCount.toLocaleString()}</span> professionals already learning
            </div>
            
            <div className="hero-buttons">
              <button 
            className="nav-button login-btn" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FaSignInAlt />
            )}
            {isLoading ? 'Connecting...' : 'Login'}
          </button>
          <button 
            className="nav-button register-btn" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading" />
            ) : (
              <FaUserPlus />
            )}
            {isLoading ? 'Creating...' : 'Get Started'}
          </button>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}