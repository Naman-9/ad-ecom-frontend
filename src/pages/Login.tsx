import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import { useLoginMutation } from '../redux/api/userAPI';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { MessageResponse } from '../types/api-types';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [gender, setGender] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: 'user',
        dob: date,
        _id: user.uid,
      });

      // "res" will either have "data"(if success)
      // or it will have "error"

      if ('data' in res) {
        toast.success(res.data.message);
      } else {
        const error = res.error as FetchBaseQueryError;
        const errorMessage = error.data as MessageResponse;
        toast.error(errorMessage.message);
      }

      // save user to mongoDb
    } catch (error) {
      toast.error('Sign In Request Failed.');
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender:</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date Of Birth</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <p>Already Signed In Once?</p>
          <button onClick={loginHandler}>
            <FcGoogle />
            <span>Sign In With Google. </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
