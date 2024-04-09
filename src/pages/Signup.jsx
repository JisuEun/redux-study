import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import Validation from '../utils/SignupValidation';
import axios from 'axios';

function Signup() {

    const [values, setValues] = useState({
        username:'',
        password:'',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    useEffect(()=> {
        axios.get('http://localhost:3001')
        .then(res => {
            if(res.data.valid) {
                navigate('/');
            }
        })
        .catch(err => console.log(err));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        // 오류가 없을 경우에만 회원가입 요청을 실행
        if (!validationErrors.username && !validationErrors.password) {
            // confirmPassword를 제외한 객체를 생성합니다.
            const signupData = {
                username: values.username,
                password: values.password
            };

            // 생성된 객체를 서버로 전송합니다.
            axios.post('http://localhost:3001/api/accounts/register', signupData)
            .then(res => {
                console.log(res);
                navigate('/login');
            })
            .catch(err => console.log(err));
        }
    }


    return(
        <div className = 'd-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type="username" placeholder='Enter Username' name="username" 
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.username && <span className='text-danger'> {errors.username}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name="password" 
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="confirmPassword"><strong>Confirm Password</strong></label>
                        <input type="password" placeholder='Confirm Password' name="confirmPassword"
                            onChange={handleInput} className='form-control rounded-0'/>
                        {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Sign up</button>
                    <p>You are agree to our terms and policies</p>
                    <Link to="/" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Log in</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup;