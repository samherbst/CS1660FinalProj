import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';
import { apiCallLogin, apiCallRegister } from '../function_calls.js'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState(''); // New state for the first name field
  const [lastName, setLastName] = useState(''); // New state for the last name field
  const [message, setMessage] = useState(''); // New state for the message field

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    if (!isRegistering) {
      let user = await apiCallLogin(username, password);

      if (user === 'fail') {
        setMessage('Invalid username or password');
        return;
      }
      else {
        let uname = user.username;
        console.log(user);
        navigate(`/home/${uname}`, { state: {user} });
      }
    }
    if (isRegistering) {
      let response = await apiCallRegister(username, password, firstName, lastName, email);
      if (response.success) {
        setIsRegistering(false);
        setMessage('Registration successful! Please login.');
      } else {
        setMessage(response.message);
      }
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

        {message && <div className='message'>{message}</div>}
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      {message !== 'Registration successful! Please login.' && (
                <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Login' : 'Register'}
                </button>
      )}
    </div>
  );
};

export default LoginPage;