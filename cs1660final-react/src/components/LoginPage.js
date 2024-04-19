import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';
import { apiCallLogin} from '../function_calls.js'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState(''); // New state for the first name field
  const [lastName, setLastName] = useState(''); // New state for the last name field

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    if (!isRegistering) {
      let user = await apiCallLogin(username, password);
      let uname = user.username;
      navigate(`/home/${uname}`, { state: {user} });
    }
  };

  return (
    <div className='login-page'>
      <h2 className='text'>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {isRegistering && (
          <>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" /> {/* New first name field */}
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" /> {/* New last name field */}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          </>
        )}
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      Don't have an account?
      <button onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? 'Back to Login' : 'Register Now'}</button>
    </div>
  );
};

export default LoginPage;