import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, CheckCircle, AlertCircle } from 'lucide-react';

// API Integration Points - Replace these with your actual API calls
const API_ENDPOINTS = {
  login: 'http://34.93.64.103:3000/adminlogin',
  signup: 'http://34.93.64.103:3000/adminsignup',
  forgotPassword: 'http://34.93.64.103:3000/adminforgot-password'
};

// API service with actual backend integration
const apiService = {
  login: async (email: string, password: string) => {
    try {
      // For demo purposes, simulate API call
      console.log('Login attempt:', { email, password });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      if (email && password) {
        return { 
          success: true, 
          data: { id: 1, email, name: 'User' },
          message: 'Login successful' 
        };
      } else {
        return { 
          success: false, 
          message: 'Invalid credentials' 
        };
      }
    } catch (error) {
      console.error('Login API error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  },
  
  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    dob: string;
  }) => {
    try {
      // For demo purposes, simulate API call
      console.log('Signup attempt:', userData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      return { 
        success: true, 
        message: 'Account created successfully! Please check your email for verification.' 
      };
    } catch (error) {
      console.error('Signup API error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  },
  
  forgotPassword: async (email: string, newPassword: string, token?: string) => {
    try {
      console.log('Forgot password attempt:', { email, newPassword });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: 'Password reset link sent to your email',
        token: 'demo-token-123'
      };
    } catch (error) {
      console.error('Forgot Password API error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  },
  
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      console.log('Reset password attempt:', { email, otp, newPassword });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: 'Password reset successful'
      };
    } catch (error) {
      console.error('Reset Password API error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  },
  
  sendOTP: async (email: string, type: 'signup' | 'reset') => {
    console.log('Mock OTP send for:', { email, type });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, otp };
  },
  
  verifyOTP: async (email: string, otp: string) => {
    console.log('Mock OTP verification for:', { email, otp });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  }
};

interface AuthSystemProps {
  onAuthSuccess?: (user: any) => void;
  onAuthError?: (error: string) => void;
  initialMode?: 'login' | 'signup';
}

interface LoginPageProps {
  onLogin: () => void;
}

// const AuthSystem: React.FC<AuthSystemProps> = ({ 
//   onAuthSuccess, 
//   onAuthError, 
//   initialMode = 'login' 
// }) => {
const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    pronoun: ''
  });
  const [resetData, setResetData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');
  
  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Enhanced styles with premium design
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: '1.6',
      color: '#1a202c',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'transparent',
      pointerEvents: 'none' as const
    },
    authBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(25px)',
      borderRadius: '24px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 8px 32px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(255, 255, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.9)
      `,
      width: '100%',
      maxWidth: '440px',
      padding: '48px 40px',
      textAlign: 'center' as const,
      position: 'relative' as const,
      zIndex: 10,
      border: '1px solid rgba(255, 255, 255, 0.4)',
      animation: 'slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      transformOrigin: 'center bottom'
    },
    modal: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(25px)',
      borderRadius: '24px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.9)
      `,
      width: '100%',
      maxWidth: '440px',
      padding: '48px 40px',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.4)',
      animation: 'modalSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    },
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(12px)',
      zIndex: 999,
      animation: 'fadeIn 0.3s ease'
    },
    titleContainer: {
      position: 'relative' as const,
      marginBottom: '32px'
    },
    title: {
      fontSize: '3rem',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #4a6bff 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: '800',
      letterSpacing: '-1px',
      position: 'relative' as const,
      display: 'inline-block'
    },
    titleGlow: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #4a6bff 0%, #764ba2 100%)',
      filter: 'blur(20px)',
      opacity: 0.3,
      zIndex: -1
    },
    subtitle: {
      fontSize: '1.5rem',
      marginBottom: '32px',
      color: '#4a6bff',
      fontWeight: '600',
      position: 'relative' as const
    },
    modeToggle: {
      display: 'flex',
      backgroundColor: '#f7fafc',
      borderRadius: '16px',
      padding: '4px',
      marginBottom: '32px',
      border: '1px solid #e2e8f0',
      position: 'relative' as const
    },
    modeButton: {
      flex: 1,
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      zIndex: 2,
      backgroundColor: 'transparent',
      color: '#718096'
    },
    modeButtonActive: {
      backgroundColor: '#4a6bff',
      color: 'white',
      boxShadow: '0 4px 12px rgba(74, 107, 255, 0.3)',
      transform: 'translateY(-1px)'
    },
    inputGroup: {
      position: 'relative' as const,
      marginBottom: '24px',
      textAlign: 'left' as const
    },
    inputLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#4a5568',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '0.025em'
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#2d3748',
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#4a6bff',
      boxShadow: '0 0 0 4px rgba(74, 107, 255, 0.1), 0 4px 12px rgba(74, 107, 255, 0.15)',
      transform: 'translateY(-2px)'
    },
    inputWithIcon: {
      paddingLeft: '52px'
    },
    inputWithButton: {
      paddingRight: '120px'
    },
    icon: {
      position: 'absolute' as const,
      left: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#718096',
      pointerEvents: 'none' as const,
      zIndex: 2
    },
    toggleIcon: {
      position: 'absolute' as const,
      right: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#718096',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      zIndex: 2,
      background: 'none',
      border: 'none'
    },
    button: {
      width: '100%',
      padding: '16px 24px',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      marginTop: '8px',
      background: 'linear-gradient(135deg, #4a6bff 0%, #667eea 100%)',
      color: 'white',
      position: 'relative' as const,
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(74, 107, 255, 0.3)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 32px rgba(74, 107, 255, 0.4)'
    },
    buttonDisabled: {
      background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    buttonRipple: {
      position: 'absolute' as const,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.6)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none' as const
    },
    otpButton: {
      position: 'absolute' as const,
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'auto',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #4a6bff 0%, #667eea 100%)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(74, 107, 255, 0.3)',
      zIndex: 3
    },
    link: {
      color: '#4a6bff',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '600',
      margin: '20px 0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-block',
      position: 'relative' as const
    },
    error: {
      color: '#e53e3e',
      fontSize: '14px',
      marginTop: '8px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      animation: 'slideInError 0.3s ease'
    },
    success: {
      color: '#38a169',
      fontSize: '14px',
      marginTop: '8px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      animation: 'slideInSuccess 0.3s ease',
      backgroundColor: '#f0fff4',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #9ae6b4',
      marginBottom: '20px'
    },
    otpContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '20px'
    },
    otpInput: {
      flex: 1,
      height: '60px',
      textAlign: 'center' as const,
      fontSize: '24px',
      fontWeight: '700',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#2d3748',
      outline: 'none'
    },
    otpInputFocus: {
      borderColor: '#4a6bff',
      boxShadow: '0 0 0 4px rgba(74, 107, 255, 0.1)',
      transform: 'scale(1.05)'
    },
    closeButton: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      background: 'rgba(113, 128, 150, 0.1)',
      border: 'none',
      borderRadius: '12px',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#718096',
      transition: 'all 0.2s ease'
    },
    divider: {
      height: '1px',
      background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
      margin: '32px 0',
      border: 'none'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    },
    select: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#2d3748',
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as const,
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 16px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '48px'
    },
    formSection: {
      animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      animationFillMode: 'both'
    }
  };

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInError {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInSuccess {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
    setSuccessMessage('');
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(255, 255, 255, 0.6)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 0.6s linear';
    circle.style.pointerEvents = 'none';
    
    const ripple = button.querySelector('.ripple');
    if (ripple) {
      ripple.remove();
    }
    
    circle.classList.add('ripple');
    button.appendChild(circle);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearAllErrors();
    setSuccessMessage('');
    
    // Validation
    if (!loginData.email) {
      setError('email', 'Email is required');
      setIsLoading(false);
      return;
    }
    if (!validateEmail(loginData.email)) {
      setError('email', 'Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    if (!loginData.password) {
      setError('password', 'Password is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.login(loginData.email, loginData.password);
      if (response.success) {
        // setSuccessMessage('Login successful! Welcome back.');
        // setTimeout(() => {
        //   onAuthSuccess?.(response.data);
        // }, 1500);
        onLogin();
      } else {
        setError('general', response.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('general', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (email: string, type: 'signup' | 'reset') => {
    if (!validateEmail(email)) {
      setError('email', 'Please enter a valid email address');
      return;
    }

    try {
      const response = await apiService.sendOTP(email, type);
      if (response.success) {
        setOtpSent(true);
        setGeneratedOtp(response.otp || '');
        alert(`OTP sent to ${email}. For demo: ${response.otp}`);
      }
    } catch (error) {
      setError('email', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (email: string, otp: string) => {
    try {
      const response = await apiService.verifyOTP(email, otp);
      if (response.success) {
        setOtpVerified(true);
        clearError('otp');
        return true;
      } else {
        setError('otp', 'Invalid OTP. Please try again.');
        return false;
      }
    } catch (error) {
      setError('otp', 'OTP verification failed. Please try again.');
      return false;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearAllErrors();
    setSuccessMessage('');

    // Validation
    if (!signupData.firstName.trim()) {
      setError('firstName', 'First name is required');
      setIsLoading(false);
      return;
    }
    if (!signupData.lastName.trim()) {
      setError('lastName', 'Last name is required');
      setIsLoading(false);
      return;
    }
    if (!signupData.email.trim()) {
      setError('email', 'Email is required');
      setIsLoading(false);
      return;
    }
    if (!validateEmail(signupData.email)) {
      setError('email', 'Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    if (!signupData.password || signupData.password.length < 8) {
      setError('password', 'Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('confirmPassword', 'Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (!signupData.dob) {
      setError('dob', 'Date of birth is required');
      setIsLoading(false);
      return;
    }
    if (!signupData.gender) {
      setError('gender', 'Gender is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.signup(signupData);
      if (response.success) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        
        // Reset form
        setSignupData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          dob: '',
          gender: '',
          pronoun: ''
        });
        
        // Navigate to login after 3 seconds
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 3000);
      } else {
        setError('general', response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('general', 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetStep === 'email') {
      if (!resetData.email || !validateEmail(resetData.email)) {
        setError('email', 'Please enter a valid email address');
        return;
      }
      await handleSendOTP(resetData.email, 'reset');
      setResetStep('otp');
    } else if (resetStep === 'otp') {
      if (!resetData.otp || resetData.otp.length !== 6) {
        setError('otp', 'Please enter a valid 6-digit OTP');
        return;
      }
      const verified = await handleVerifyOTP(resetData.email, resetData.otp);
      if (verified) {
        setResetStep('password');
      }
    } else if (resetStep === 'password') {
      if (!resetData.newPassword || resetData.newPassword.length < 8) {
        setError('newPassword', 'Password must be at least 8 characters');
        return;
      }
      if (resetData.newPassword !== resetData.confirmPassword) {
        setError('confirmPassword', 'Passwords do not match');
        return;
      }
      
      try {
        const response = await apiService.resetPassword(resetData.email, resetData.otp, resetData.newPassword);
        if (response.success) {
          alert('Password reset successfully!');
          setShowResetModal(false);
          setResetStep('email');
          setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
          clearAllErrors();
        } else {
          setError('general', response.message || 'Failed to reset password. Please try again.');
        }
      } catch (error) {
        setError('general', 'Failed to reset password. Please try again.');
      }
    }
  };

  const Button = ({ children, onClick, disabled, loading, type = 'button', variant = 'primary' }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        type={type}
        style={{
          ...styles.button,
          ...(isHovered && !disabled ? styles.buttonHover : {}),
          ...(disabled ? styles.buttonDisabled : {})
        }}
        onClick={(e) => {
          if (!disabled) {
            createRipple(e);
            onClick?.(e);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled || loading}
      >
        {loading && <div style={styles.loadingSpinner} />}
        {children}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      
      <div style={styles.authBox}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>
            <div style={styles.titleGlow} />
            Famiory
          </h1>
          <Sparkles 
            size={24} 
            style={{ 
              position: 'absolute', 
              top: '-10px', 
              right: '20px', 
              color: '#4a6bff',
              animation: 'pulse 2s infinite'
            }} 
          />
        </div>

        {successMessage && (
          <div style={styles.success}>
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div style={styles.error}>
            <AlertCircle size={16} />
            {errors.general}
          </div>
        )}

        <div style={styles.modeToggle}>
          <button
            style={{
              ...styles.modeButton,
              ...(mode === 'login' ? styles.modeButtonActive : {})
            }}
            onClick={() => {
              setMode('login');
              clearAllErrors();
              setSuccessMessage('');
            }}
          >
            Log In
          </button>
          <button
            style={{
              ...styles.modeButton,
              ...(mode === 'signup' ? styles.modeButtonActive : {})
            }}
            onClick={() => {
              setMode('signup');
              clearAllErrors();
              setSuccessMessage('');
            }}
          >
            Sign Up
          </button>
        </div>
        
        {mode === 'login' ? (
          <div style={styles.formSection}>
            <form onSubmit={handleLogin}>
              <div style={styles.inputGroup}>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={styles.icon} />
                  <input
                    type="email"
                    placeholder="yours@example.com"
                    style={{
                      ...styles.input,
                      ...styles.inputWithIcon,
                      ...(errors.email ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                    }}
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData(prev => ({ ...prev, email: e.target.value }));
                      clearError('email');
                    }}
                    required
                  />
                </div>
                {errors.email && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={styles.icon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="your password"
                    style={{
                      ...styles.input,
                      ...styles.inputWithIcon,
                      paddingRight: '52px',
                      ...(errors.password ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                    }}
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData(prev => ({ ...prev, password: e.target.value }));
                      clearError('password');
                    }}
                    required
                  />
                  <button
                    type="button"
                    style={styles.toggleIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.password}
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
              
              <div 
                style={styles.link} 
                onClick={() => setShowResetModal(true)}
              >
                Forgot Password?
              </div>
            </form>
          </div>
        ) : (
          <div style={styles.formSection}>
            <form onSubmit={handleSignup}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="First Name"
                  style={{
                    ...styles.input,
                    ...(errors.firstName ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                  }}
                  value={signupData.firstName}
                  onChange={(e) => {
                    setSignupData(prev => ({ ...prev, firstName: e.target.value }));
                    clearError('firstName');
                  }}
                  required
                />
                {errors.firstName && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.firstName}
                  </div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Last Name"
                  style={{
                    ...styles.input,
                    ...(errors.lastName ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                  }}
                  value={signupData.lastName}
                  onChange={(e) => {
                    setSignupData(prev => ({ ...prev, lastName: e.target.value }));
                    clearError('lastName');
                  }}
                  required
                />
                {errors.lastName && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.lastName}
                  </div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={styles.icon} />
                  <input
                    type="email"
                    placeholder="your@example.com"
                    style={{
                      ...styles.input,
                      ...styles.inputWithIcon,
                      ...(errors.email ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                    }}
                    value={signupData.email}
                    onChange={(e) => {
                      setSignupData(prev => ({ ...prev, email: e.target.value }));
                      clearError('email');
                    }}
                    required
                  />
                </div>
                {errors.email && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type="date"
                  style={{
                    ...styles.input,
                    ...(errors.dob ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                  }}
                  value={signupData.dob}
                  onChange={(e) => {
                    setSignupData(prev => ({ ...prev, dob: e.target.value }));
                    clearError('dob');
                  }}
                  required
                />
                {errors.dob && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.dob}
                  </div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <select
                  style={{
                    ...styles.select,
                    ...(errors.gender ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                  }}
                  value={signupData.gender}
                  onChange={(e) => {
                    setSignupData(prev => ({ ...prev, gender: e.target.value }));
                    clearError('gender');
                  }}
                  required
                >
                  <option value="">Select Your Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="custom">Custom</option>
                </select>
                {errors.gender && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.gender}
                  </div>
                )}
              </div>
              
              {signupData.gender === 'custom' && (
                <div style={styles.inputGroup}>
                  <select
                    style={styles.select}
                    value={signupData.pronoun}
                    onChange={(e) => setSignupData(prev => ({ ...prev, pronoun: e.target.value }))}
                    required
                  >
                    <option value="">Select your Pronoun</option>
                    <option value="she">She: "Wish her a happy birthday!"</option>
                    <option value="he">He: "Wish him a happy birthday!"</option>
                    <option value="they">They: "Wish them a happy birthday!"</option>
                  </select>
                </div>
              )}
              
              <div style={styles.inputGroup}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  style={{
                    ...styles.input,
                    paddingRight: '52px',
                    ...(errors.password ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                  }}
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData(prev => ({ ...prev, password: e.target.value }));
                    clearError('password');
                  }}
                  required
                />
                <button
                  type="button"
                  style={styles.toggleIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.password}
                  </div>
                )}
              </div>
              
              <div style={styles.inputGroup}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter Password"
                  style={{
                    ...styles.input,
                    paddingRight: '52px',
                    ...(errors.confirmPassword ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                  }}
                  value={signupData.confirmPassword}
                  onChange={(e) => {
                    setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    clearError('confirmPassword');
                  }}
                  required
                />
                <button
                  type="button"
                  style={styles.toggleIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.confirmPassword && (
                  <div style={styles.error}>
                    <AlertCircle size={16} />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </div>
        )}
      </div>
      
      {/* Reset Password Modal */}
      {showResetModal && (
        <>
          <div style={styles.overlay} onClick={() => setShowResetModal(false)} />
          <div style={styles.modal}>
            <button
              style={styles.closeButton}
              onClick={() => {
                setShowResetModal(false);
                setResetStep('email');
                setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
                clearAllErrors();
              }}
            >
              ×
            </button>
            <div style={styles.titleContainer}>
              <h2 style={{ ...styles.subtitle, marginBottom: '32px' }}>
                <Shield size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Reset Password
              </h2>
            </div>
            
            {errors.general && (
              <div style={styles.error}>
                <AlertCircle size={16} />
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleResetPassword}>
              {resetStep === 'email' && (
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Registered Email ID</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={styles.icon} />
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      style={{
                        ...styles.input,
                        ...styles.inputWithIcon,
                        ...(errors.email ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                      }}
                      value={resetData.email}
                      onChange={(e) => {
                        setResetData(prev => ({ ...prev, email: e.target.value }));
                        clearError('email');
                      }}
                      required
                    />
                  </div>
                  {errors.email && (
                    <div style={styles.error}>
                      <AlertCircle size={16} />
                      {errors.email}
                    </div>
                  )}
                </div>
              )}
              
              {resetStep === 'otp' && (
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Enter OTP sent to your email</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    style={{
                      ...styles.input,
                      ...(errors.otp ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                    }}
                    value={resetData.otp}
                    onChange={(e) => {
                      setResetData(prev => ({ ...prev, otp: e.target.value }));
                      clearError('otp');
                    }}
                  />
                  {errors.otp && (
                    <div style={styles.error}>
                      <AlertCircle size={16} />
                      {errors.otp}
                    </div>
                  )}
                </div>
              )}
              
              {resetStep === 'password' && (
                <>
                  <div style={styles.inputGroup}>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={styles.icon} />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        style={{
                          ...styles.input,
                          ...styles.inputWithIcon,
                          ...(errors.newPassword ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                        }}
                        value={resetData.newPassword}
                        onChange={(e) => {
                          setResetData(prev => ({ ...prev, newPassword: e.target.value }));
                          clearError('newPassword');
                        }}
                        required
                      />
                    </div>
                    {errors.newPassword && (
                      <div style={styles.error}>
                        <AlertCircle size={16} />
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={styles.icon} />
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        style={{
                          ...styles.input,
                          ...styles.inputWithIcon,
                          ...(errors.confirmPassword ? { borderColor: '#e53e3e', boxShadow: '0 0 0 4px rgba(229, 62, 62, 0.1)' } : {})
                        }}
                        value={resetData.confirmPassword}
                        onChange={(e) => {
                          setResetData(prev => ({ ...prev, confirmPassword: e.target.value }));
                          clearError('confirmPassword');
                        }}
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div style={styles.error}>
                        <AlertCircle size={16} />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <Button 
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 
                (resetStep === 'email' ? 'Send OTP' : 
                 resetStep === 'otp' ? 'Verify OTP' : 
                 'Change Password')}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;