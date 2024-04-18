import React from 'react';
import { useParams } from 'react-router-dom';

const Home = () => {
    const { username } = useParams();

    return (
        <div>
        <h2>Welcome {username}</h2>
        </div>
    );
}

export default Home;