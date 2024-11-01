import React, {useEffect, useState} from "react";
import './styles/parcels.css';
import {Link, useLocation } from 'react-router-dom';
import {getStatus } from "../../src/action/status";
import { useSelector } from 'react-redux';
import { addBookmark } from "../action/bookmark";
import StatusDetail from './StatusDetail'; // Импортируем новый компонент
import NewBookmark from "./NewBookmark";
import { getFilials } from "../action/filial";
import FilialBookmark from "./FilialBookmark";
import Accepted from "./Accepted";
import config from "../config";


import Tab from './Tab'
import axios from 'axios';

import house from '../assets/icons/home-outline.svg';
import house2 from '../assets/icons/home.svg';

import box from '../assets/icons/layers-outline.svg';
import box2 from '../assets/icons/layers.svg';


import user from '../assets/icons/person-circle-outline.svg';
import user2 from '../assets/icons/person-circle.svg';

const titlePage = 'Мои посылки'

// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

const Parcels = () => {
    const [statuses, setStatuses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [moreText, setMoreText] = useState('');
    const [trackText, setTrackText] = useState('');

    const [notFoundBookmarks, setNotFoundBookmarks] = useState([]);
    const [updatedBookmarks, setUpdatedBookmarks] = useState([]);

    const [archive, setArchive] = useState([]);
    const [showArchive, setShowArchive] = useState(false);

    const [filial, setFilial] = useState([]);
    const userId = useSelector(state => state.user.currentUser.id);

    const [isLoading, setIsLoading] = useState(false); // Добавляем состояние для отслеживания загрузки
    const [errorMessage, setErrorMessage] = useState(''); // Состояние для отображения ошибки

    useEffect(() => {
        const fetchBookmarks = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${config.apiUrl}/api/bookmark/${userId}/getBookmarks`);
                const { notFoundBookmarks, updatedBookmarks } = response.data;
                setNotFoundBookmarks(notFoundBookmarks);
                setUpdatedBookmarks(updatedBookmarks);
                
            } catch (error) {
                console.error('Ошибка при получении закладок:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookmarks();
    }, [userId]);

  

    const fetchStatuses = async () => {
        try {
            const statusesData = await getStatus();
            setStatuses(statusesData);
            
            
        } catch (error) {
            console.error('Ошибка при получении статусов:', error);
        }
    };

    const getFilial = async () => {
        try {
            const filialData = await getFilials();
            setFilial(filialData);
            console.log(filial);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        // Получаем статусы при загрузке компонента
        fetchStatuses();
        getFilial();
    });

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
        setErrorMessage(''); // Сбрасываем ошибку при открытии модального окна
    }


    const handleAddBookmark = async () => {
        setIsLoading(true);
        try {
            await addBookmark(userId, moreText, trackText);
            setMoreText('');
            setTrackText('');
            alert('Трек-номер успешно добавлен'); // Сообщение об успешном добавлении
        } catch (error) {
            console.log('Детали ошибки:', error);
            if (error.response && error.response.status) {
                if (error.response.status === 400) {
                    // Если статус ошибки 400, выводим сообщение о существующем трек-коде
                    alert('Ошибка: Трек-номер уже существует в закладках');
                } else {
                    // Общая обработка ошибок с другими статусами
                    alert(`Ошибка: ${error.response.status} - ${error.response.statusText}`);
                }
            } else {
                // Обработка ошибок, не связанных с ответом сервера
                console.error('Ошибка:', error.message);
                alert('Ошибка: Заполните все поля или Трек-номер уже существует');
            }
        } finally {
            setIsLoading(false);
            handleOpenModal();
        }
    };
    
    
        
    
    
    


    useEffect(() => {
        const fetchArchive = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/api/archive/${userId}/getArchive`);
                setArchive(response.data);
            } catch (error) {
                console.error('Ошибка при получении архива:', error.message);
            }
        };

        fetchArchive();
    }, [userId]);
    

    const removeBookmark = async (trackNumber) => {
        const confirmDelete = window.confirm("Вы уверены, что хотите удалить эту закладку?");
        if (confirmDelete) {
            setIsLoading(true);
            try {
                const response = await fetch(`${config.apiUrl}/api/archive/${userId}/delete/${trackNumber}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Ошибка при удалении закладки');
                }

                console.log('Закладка успешно удалена');
                // Перезагрузить страницу или обновить список закладок

            } catch (error) {
                console.error('Произошла ошибка при удалении закладки:', error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };


    const [userData, setUserData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Функция для получения данных профиля пользователя
        const fetchUserProfile = async () => {
            try {
                // Отправляем GET запрос на сервер для получения данных профиля
                const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Передаем токен в заголовке запроса
                    }
                });

                // Проверяем, успешно ли выполнен запрос
                if (response.ok) {
                    // Если запрос успешен, получаем данные профиля из ответа
                    const data = await response.json();
                    setUserData(data.user); // Сохраняем данные профиля в состоянии
                } else {
                    // Если произошла ошибка, выводим сообщение об ошибке
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                // Если произошла ошибка при выполнении запроса, выводим сообщение об ошибке
                console.error('Error fetching user profile:', error.message);
            }
        };

        // Вызываем функцию для получения данных профиля пользователя
        fetchUserProfile();
    }, []); // Запрос будет выполнен только при первом рендере компонента

    return (
      
        <div className="main__parcels">
                
                {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <svg className="svg-loading" viewBox="25 25 50 50">
                            <circle r="20" cy="50" cx="50"></circle>
                        </svg>
                    </div>
                </div>
            )}

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

                        {/* <Link to="/notification" className="tabbutton-menu" >
                            <img src={location.pathname === '/notification' ? bell2 : bell} alt="" />
                            <p>Уведомление</p>
                        </Link> */}

                        <Link to="/profile" className="tabbutton-menu" >
                            <img className="icons-svg" src={location.pathname === '/profile' ? user2 : user}  alt="" />
                            <p style={location.pathname === '/profile' ? { color: '#1F800C' } : { color: '#808080' } }>Профиль</p>
                        </Link>
                        {userData && userData.role === 'admin' && (
                            <Link to="/dashboard" className="tabbutton-menu">Панель управления</Link>
                        )}
                        {userData && userData.role === 'filial' && (
                            <Link to="/dashboard" className="tabbutton-menu">Панель управления</Link>
                        )}
                        
                    </ul>

                </header>
                
                <div className="parcels">
                <div>
                   
                </div>
              
                        <div className="statuses-client">
                            <NewBookmark notFoundBookmarks = {notFoundBookmarks} />
                            {statuses.map(status => (
                                status.statusText !== "Получено" &&
                                <StatusDetail 
                                    key={status._id} 
                                    statusId={status._id} 
                                    statusText={status.statusText} 
                                    updatedBookmarks={updatedBookmarks} 
                                />
                            ))}

                            {Array.isArray(filial) && filial.map(filial => {
                                const filialId = filial.filial._id;
                                const filteredBookmarks = updatedBookmarks.filter(bookmark => bookmark.currentStatus === filialId);
                                if (filteredBookmarks.length > 0) {
                                    return (
                                        <FilialBookmark 
                                            key={filialId} 
                                            filialId={filialId} 
                                            filialText={filial.filial.filialText} 
                                            updatedBookmarks={updatedBookmarks} 
                                        />
                                    );
                                }
                                return null;
                            })}


                            {statuses.map(status => (
                                status.statusText === "Получено" &&
                                <Accepted 
                                    key={status._id} 
                                    statusId={status._id} 
                                    statusText={status.statusText} 
                                    updatedBookmarks={updatedBookmarks} 
                                />
                            ))}
                            
                        </div>

                        {modalOpen && (
                            <div className="modalAdd">
                                <div className="modalAdd-header">
                                    <h2>Добавить трек номер</h2>
                                    <div className="close" onClick={handleOpenModal}></div>
                                </div>
                                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Добавление вывода ошибки */}
                                <label className="labelTrack" htmlFor="">Описание посылки</label>
                                <input
                                    type="text"
                                    value={moreText}
                                    onChange={(e) => setMoreText(e.target.value)}
                                    placeholder="Введите текст статуса"
                                    className="input-trackAdd"
                                />
                                <label className="labelTrack"  htmlFor="">Трек номер посылки</label>
                                <input
                                    type="text"
                                    value={trackText}
                                    onChange={(e) => setTrackText(e.target.value)}
                                    placeholder="Введите текст статуса"
                                    className="input-trackAdd"
                                />
                                <div className="button__addTrack" onClick={handleAddBookmark}>Добавить посылку</div>
                            </div>
                             )}
                             {modalOpen &&  (
                                <div className="overflow"></div>
                            )}
                       
                        <div className="archive-container"  onClick={() => setShowArchive(!showArchive)}>
                            <div className="archive-icon"></div>
                            <p>Посылки в Архиве</p>
                            <div className="quantity-archive"><div className="quantity__p-archive">{archive.length}</div></div>
                        </div>
                    
                    <div className="area"></div>

                    <div className="button__container">
                        <div className="add__track" onClick={handleOpenModal}>Добавить трек номер</div>
                    </div>

                    {showArchive && (
                    
                    <ul className="ul-detail">    
                        <div className="title2 detail-header">
                            <p>Архив посылок</p>
                            <div className="close-detail" onClick={() => setShowArchive(!showArchive)}></div>
                        </div>         
                        <div className="li-container">
                            {archive.map((item, index) => (
                                <div className="ul-detail-border" key={index}>
                                    <li className="li-track-detail">
                                        <div className="li-header">
                                            <p>{item.trackNumber}</p>
                                            <div className="removeLiTrack" onClick={() => removeBookmark(item.trackNumber)}></div>

                                        </div>
                                        <div className="description-li">
                                            <b>Описание: </b>{item.description}
                                        </div>
                                        
                                        <div className="description-li">
                                            <b>Сумма:</b> <span>{item.price ? `${item.price + "₸"}` : 'Неизвестно'}</span>
                                        </div>
                                        <div className="description-li">
                                            <b>Вес:</b> <span>{item.weight ? `${item.weight} кг` : 'Неизвестно'}</span>
                                        </div>
                                        {/* <ul className="date-li">
                                            <b className="date-text"> История:</b>
                                            {item.history.map((historyItem, historyIndex) => (
                                                <li key={historyIndex}>{formatDate(historyItem.date)}</li>
                                            ))} 
                                        </ul> */}
                                    </li>
                                </div>
                            ))}
                    <div className="area2"></div>

                        </div>
                       

                    </ul>

                    )}
                    {showArchive &&  (
                        <div className="overflow_detail"></div>
                    )}

                   
                </div>

            <Tab/>
        </div>

    )
}

export default Parcels;