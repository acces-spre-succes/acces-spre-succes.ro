import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReturnPage.css'
const STRIPE_SERVER_URL = process.env.NODE_ENV === 'production'
    ? '/api/stripe'
    : 'http://localhost:8080/api/stripe';
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:8080/api';



const ReturnPage = () => {
    const [status, setStatus] = useState('loading');
    const [sessionData, setSessionData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        initialize()
    }, [navigate]);

    const initialize = async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
            setStatus('error');
            return;
        }

        try{
            const response = await fetch(`${STRIPE_SERVER_URL}/session-status?session_id=${sessionId}`);

            if (!response.ok) {
                throw new Error("Could not find session status");
            }

            const session = await response.json();
            setSessionData(session);
            const donorId = session.donorId;

            if (session.status === 'open') {
                navigate('/checkout');
            }else if (session.status === 'complete') {
                setStatus('success');
                try {
                    await fetch(`${API_BASE_URL}/donators/update-payment-status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            donorId: donorId,
                            stripeSessionId: sessionId
                        })
                    });
                    console.log('Payment status updated in backend');
                } catch (err) {
                    console.error('Failed to update payment status in backend:', err);
                }
            }else{
                setStatus('error');
            }
        } catch (error) {
            console.error("Error getting session status: ", error);
            setStatus('error');
        }
    };

    const handleReturnHome = () => {
        navigate('/');
    }

    const handleNewDonation = () => {
        navigate('/donate');
    };

    if (status === 'loading') {
        return (
            <div className="return-page">
                <div className="loading-container">
                    <div className="loading-spinner">
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="return-page">
                <div className="error-container">
                    <h2>Eroare la procesarea platii</h2>
                    <p>A aparut o problema la procesarea platii, va rugam sa incercati din nou</p>
                    <div className="action-buttons">
                        <button onClick={handleReturnHome} className={"return-button"}>
                            Inapoi la pagina de donatie
                        </button>
                        <button onClick={handleNewDonation} className={"new-donation-button"}>
                            Incearca din nou
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="return-page">
            <div className="success-container">
                <h2>Va multumim pentru donatie!</h2>
                <p>Plata dumneavoastra a fost procesata cu succes</p>

                {sessionData && (
                    <div className="payment-details">
                        <p><strong>Amount:</strong> {(sessionData.amount /100).toFixed(2)} {sessionData.currency.toUpperCase()}</p>
                        {sessionData.amount && (<p><strong>Confirmare trimisa la adresa:</strong> {sessionData.email}</p>)}
                    </div>
                )}

                <div className="action-buttons">
                    <button onClick={handleReturnHome} className="return-button">
                        Return to Home
                    </button>
                    <button onClick={handleNewDonation} className="new-donation-button">
                        Make Another Donation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnPage;