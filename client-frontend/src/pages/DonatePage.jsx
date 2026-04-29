import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './DonatePage.css';

const DonatePage = () => {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    amount: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const presetAmounts = [10, 25, 50, 100];
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString()}));
    setCustomAmount('');
  };

  const handleCustomAmountSelect = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setFormData(prev => ({...prev, amount: value}));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) < 1) {
      newErrors.amount = 'Please select or enter a donation amount';
    }

    if(!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }else if(!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const processDonation = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const donationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        amount: formData.amount,
      };

      const saveResponse = await fetch(`${API_BASE_URL}/donators/add-donor`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(donationData),
      });

      if (!saveResponse.ok) {
        let errorMessage = `HTTP error! status: ${saveResponse.status}`;
        try {
          const errorData = await saveResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          const errorText = await saveResponse.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const saveDonor = await saveResponse.json();

      navigate('/checkout', {
        state: {
          donorData: donationData,
          donorId: saveDonor.id,
        }
      });

      }catch(err) {
      console.error("Error: ", err);
      setErrors({submit: err.message });
    }finally {
      setLoading(false);
    }
  };



  return (
    <div className="donate-page">
      <motion.section
        className="page-header donate-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <motion.div className="heart-icon" variants={fadeInUp}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
          </motion.div>
          <h1 className="page-title">{t('donate.title')}</h1>
          <p className="page-subtitle">{t('donate.subtitle')}</p>
        </div>
      </motion.section>

      <section className="donate-section section">
        <div className="container">
          <motion.div
            className="donate-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="donation_form_card" variants={fadeInUp}>
              {/*<div className="card-icon-wrapper">*/}
              {/*  <svg*/}
              {/*    xmlns="http://www.w3.org/2000/svg"*/}
              {/*    width="64"*/}
              {/*    height="64"*/}
              {/*    viewBox="0 0 24 24"*/}
              {/*    fill="none"*/}
              {/*    stroke="currentColor"*/}
              {/*    strokeWidth="2"*/}
              {/*    strokeLinecap="round"*/}
              {/*    strokeLinejoin="round"*/}
              {/*  >*/}
              {/*    <circle cx="12" cy="12" r="10"></circle>*/}
              {/*    <polyline points="12 6 12 12 16 14"></polyline>*/}
              {/*  </svg>*/}
              {/*</div>*/}
              <h2 className="card-title">{t('donate.resolved')}</h2>
              <p className="card-description">{t('donate.description')}</p>

              {errors.submit && (
                  <div className="error-message">
                    {errors.submit}
                  </div>
              )}

              {/*Amount Selection*/}
              <form onSubmit={processDonation} className="donate-form">
                <div className="form-group">
                    <label> Select Amount *</label>
                  <div className="amount-buttons">
                    {presetAmounts.map(amount => (
                        <button
                          key={amount}
                          type="button"
                          className={`amount-btn ${formData.amount === amount.toString() ? 'active' : ''}`}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          <span className="amount-value">{amount}</span>
                          <span className="amount-currency">RON</span>
                        </button>
                    ))}
                  </div>
                  <div className="custom-amount-container">
                    <input
                        type="number"
                        className="custom-amount"
                        placeholder="Alta suma"
                        value={customAmount}
                        onChange={handleCustomAmountSelect}
                        min="1"
                        step="0.01"
                    />
                    <span className="currency-symbol">RON</span>
                </div>
                  {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>

                {/*Donor information*/}
                <div className="name-fields">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}/>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/*Submit button*/}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Submit'}
                </button>
              </form>
            </motion.div>



            <motion.div className="donation-methods" variants={fadeInUp}>
              <h3 className="methods-title">{t('donate.alternative')}</h3>

              <div className="method-card">
                <div className="method-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div className="method-content">
                  <h4 className="method-title">{t('donate.bank')}</h4>
                  <div className="bank-details">
                    <div className="bank-detail">
                      <strong>IBAN:</strong>
                      <span>RO49 AAAA 1B31 0075 9384 0000</span>
                    </div>
                    <div className="bank-detail">
                      <strong>Banca:</strong>
                      <span>Banca Transilvania</span>
                    </div>
                    <div className="bank-detail">
                      <strong>Beneficiar:</strong>
                      <span>Asociația Acces spre Succes</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="contact-info" variants={fadeInUp}>
              <div className="info-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <p className="contact-text">{t('donate.contact')}</p>
              <a href="mailto:admin@acces-spre-succes.ro" className="contact-email">
                {t('donate.email')}
              </a>
            </motion.div>

            <motion.div className="impact-section" variants={fadeInUp}>
              <h3 className="impact-title">Impactul Donației Tale</h3>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <h4>Educație</h4>
                  <p>Susții programe educaționale pentru copii defavorizați</p>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h4>Mentorare</h4>
                  <p>Permiti mentorii să ghideze copiii către succes</p>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <h4>Viitor</h4>
                  <p>Construiești un viitor mai bun pentru comunitate</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
