import React from 'react';
import { useParams } from 'react-router-dom';

import '../style/Home.css';

const Home = () => {
    const { username } = useParams();

    return (
        <div className='home-page'>
            <h2>Welcome {username}</h2>
        </div>
    );
}

export default Home;