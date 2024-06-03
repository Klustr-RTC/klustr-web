import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

interface LoaderData {
  redirect?: string;
}

function RedirectHandler() {
  const data = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  useEffect(() => {
    if (data.redirect) {
      navigate(data.redirect, { replace: true });
    }
  }, [data, navigate]);

  return (
    <div>
      <h1 className="text-2xl text-center my-3">Redirecting...</h1>
    </div>
  );
}

export default RedirectHandler;
