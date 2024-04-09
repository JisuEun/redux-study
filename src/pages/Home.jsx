import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            alert('User not found or not logged in.');
            navigate('/login', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        alert(error);
        navigate('/login', { replace: true });
        return <></>;
    }

    if (!isAuthenticated) {
        // 이미 리다이렉트되었기 때문에 여기서 추가적인 렌더링을 방지합니다.
        return <></>;
    }

    // user 객체가 있을 때만 username을 렌더링합니다.
    return (
        <div>
            <h1>Welcome, {user?.username}</h1>
            <button onClick={handleLogout} className='btn btn-primary'>Logout</button>
            <button onClick={() => navigate('/editor')} className='btn btn-primary'>
                Go to Editor
            </button>
        </div>
    );
}

export default Home;