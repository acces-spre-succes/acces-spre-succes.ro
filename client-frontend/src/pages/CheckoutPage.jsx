import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css';

const STRIPE_SERVER_URL = process.env.NODE_ENV === 'production'
    ? '/api/stripe'
    : 'http://localhost:8080/api/stripe';
//change from the test public key to the live public key
const stripePromise = loadStripe("pk_test_51SWEdMFx5S2jt0DdcuTOjM8tswLgszDmkcfeLe8lAm9bJVDIrhMPQyrGx72Hslq3552PpwT26h6gtZeF7Dnfjhg300ke2bc5Ll");

const CheckoutPage = () => {
    const checkoutRef = useRef(null);
    const checkoutInstanceRef = useRef(null);
    const isInitializedRef = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { donorData, donorId } = location.state || {};

    const [checkoutError, setCheckoutError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect if no donor data
        if (!donorData || !donorData.amount) {
            navigate('/donate');
            return;
        }

        // Only initialize once
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            initializeCheckout();
        }

        // Cleanup on unmount
        return () => {
            if (checkoutInstanceRef.current) {
                try {
                    checkoutInstanceRef.current.destroy();
                    checkoutInstanceRef.current = null;
                } catch (error) {
                    console.log('Cleanup error:', error);
                }
            }
        };
    }, []);

    const fetchClientSecret = async () => {
        try {
            console.log('Fetching client secret...');
            const response = await fetch(`${STRIPE_SERVER_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    amount: donorData.amount,
                    email: donorData.email,
                    firstName: donorData.firstName,
                    lastName: donorData.lastName,
                    donorId: donorId,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Server returned an error");
            }

            if (!data.client_secret) {
                throw new Error("No client secret found in response");
            }

            console.log('Client secret received');
            return data.client_secret;
        } catch (error) {
            console.error('Error fetching client secret:', error);
            throw error;
        }
    };

    const initializeCheckout = async () => {
        try {
            console.log('Initializing checkout...');
            setIsLoading(true);
            setCheckoutError(null);

            // Make sure we don't have an existing instance
            if (checkoutInstanceRef.current) {
                console.log('Destroying existing checkout instance');
                try {
                    checkoutInstanceRef.current.destroy();
                } catch (error) {
                    console.log('Error destroying existing instance:', error);
                }
                checkoutInstanceRef.current = null;
                // Wait a bit for cleanup
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            const stripe = await stripePromise;

            if (!checkoutRef.current) {
                throw new Error("Checkout container not ready");
            }

            console.log('Creating embedded checkout...');
            const checkout = await stripe.initEmbeddedCheckout({fetchClientSecret});

            console.log('Checkout created, mounting...');
            checkoutInstanceRef.current = checkout;
            checkout.mount(checkoutRef.current);

            console.log('Checkout mounted successfully');
            setIsLoading(false);
        } catch (error) {
            console.error('Error initializing checkout:', error);
            setCheckoutError(error.message);
            setIsLoading(false);
        }
    };

    const handleBackToDonate = () => {
        if (checkoutInstanceRef.current) {
            try {
                checkoutInstanceRef.current.destroy();
                checkoutInstanceRef.current = null;
            } catch (error) {
                console.log('Error destroying checkout:', error);
            }
        }
        navigate('/donate');
    };

    const handleRetry = async () => {
        // Reset initialization flag to allow retry
        isInitializedRef.current = false;
        setCheckoutError(null);
        setIsLoading(true);

        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 300));

        isInitializedRef.current = true;
        await initializeCheckout();
    };

    if (!donorData) {
        return (
            <div className="checkout-page">
                <div className="error-message">
                    <p>Va rugam sa completati formularul de donatie cum trebuie</p>
                    <button onClick={handleBackToDonate} className="back-button">
                        Inapoi la pagina de donatii
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-page__header">
                <button onClick={handleBackToDonate} className="back-button">
                    Inapoi la pagina de donatii
                </button>
                <h2>Finalizeaza Donatia</h2>
                <div className="donation-summary">
                    <p><strong>Suma:</strong> {donorData.amount} RON</p>
                    <p><strong>Nume:</strong> {donorData.firstName} {donorData.lastName}</p>
                </div>
            </div>

            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Se incarca plata..</p>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                        Aceasta poate dura câteva momente
                    </p>
                </div>
            )}

            {checkoutError && (
                <div className="error-message">
                    <h3>Eroare la inițializarea plății</h3>
                    <p>{checkoutError}</p>
                    <div className="error-actions">
                        <button onClick={handleRetry} className="retry-button">
                            Reincearca
                        </button>
                        <button onClick={handleBackToDonate} className="back-button">
                            Inapoi la donatie
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={checkoutRef}
                id="checkout"
                className="checkout-container"
                style={{ display: (isLoading || checkoutError) ? 'none' : 'block' }}
            />
        </div>
    );
};

export default CheckoutPage;