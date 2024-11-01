import React, { useEffect, useState } from "react";
import './styles/parcels.css';
import './styles/referral.css';

import Tab from './Tab';
import { Link, useLocation } from "react-router-dom";

import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';
import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';
import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';
import config from "../config";

const titlePage = "Партнерская программа"; 

const Referral = () => {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
               const response = await fetch(`${config.apiUrl}/api/user/referrals`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReferrals(data);
            } else {
                console.error('Failed to fetch user profile:', response.statusText);
            }
            } catch (error) {
                console.error('Ошибка при получении рефералов:', error);
            }
        };
        fetchReferrals();
    }, []);

    const generateReferralLink = () => {
        const userId = userData.id;
        const link = `${window.location.origin}/registration?ref=${userId}`;
        setReferralLink(link);
        navigator.clipboard.writeText(link);
        alert("Реферальная ссылка скопирована!");
    };

    return (
        <div className="main__parcels">
            <header className="header">
                <div className='LogoHeader'>
                    <div className="title2">
                        {titlePage}
                    </div>
                </div>
                <ul className="Menu">
                    <Link to="/main" className="tabbutton-menu">
                        <img className="icons-svg" src={location.pathname === '/main' ? house2 : house} alt="" />
                        <p style={location.pathname === '/main' ? { color: '#1F800C' } : { color: '#808080' } }>Главная</p>
                    </Link>
                    <Link to="/parcels" className="tabbutton-menu" >
                        <img className="icons-svg" src={location.pathname === '/parcels' ? box2 : box}  alt="" />
                        <p style={location.pathname === '/parcels' ? { color: '#1F800C' } : { color: '#808080' } }>Посылки</p>
                    </Link>
                    <Link to="/profile" className="tabbutton-menu" >
                        <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user}  alt="" />
                        <p style={location.pathname === '/profile' ? { color: '#1F800C' } : { color: '#808080' } }>Профиль</p>
                    </Link>
                </ul>
            </header>

            <div className="referral-section">
                <div className="bonus-section">
                    <h3>Мой бонус</h3>
                    <span className="bonus-amount">{userData ? `${userData.bonuses} ₸` : "0 ₸"}</span>
                </div>
                <div className="referral-link-section">
                    <p><strong>Ваша реферальная ссылка:</strong></p>
                    <div className="referral-link-box">
                        <span>{referralLink || `${window.location.origin}/registration?ref=${userData ? userData.id : ''}`}</span>
                        <button onClick={generateReferralLink}>Копировать</button>
                    </div>
                </div>
                <div className="referrals-list">
                    <h2>Пользователи, зарегистрированные по вашей реферальной ссылке</h2>
                    <ul>
                        {referrals.map((referral) => (
                            <li key={referral._id}>
                                <p><strong>Имя:</strong> {referral.name}</p>
                                <p><strong>Фамилия:</strong> {referral.surname}</p>
                                <p><strong>Номер телефона:</strong> {referral.phone}</p>
                                <p><strong>Дата регистрации:</strong> {new Date(referral.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Tab/>
        </div>
    );
}

export default Referral;
