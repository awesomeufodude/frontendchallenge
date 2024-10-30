"use client";
import { useState } from 'react';
import { apiInfo } from '@/lib/apiInfo';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Home() {

    const [loading , setLoading] = useState(false);

    const router = useRouter();

    async function login(email: string, password: string) {
        setLoading(true)
      try {
        const response = await fetch(
          `${apiInfo.apiurl}${apiInfo.routes.login}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!response.ok) {
          // Handle different types of errors based on status code
          if (response.status === 401) {
            throw new Error(
              'Authentication failed. Check your credentials.'
            );
          } else if (response.status === 500) {
            throw new Error(
              'Internal server error. Please try again later.'
            );
          } else {
            throw new Error(
              'An unexpected error occurred. Please try again.'
            );
          }
        }

        const data = await response.json();

        if(data) {
            setLoading(false)
            router.push('/reports');
        }

        

        // Storing the token in sessionStorage for better security compared to localStorage
        sessionStorage.setItem('token', data.access_token);

        return {
          success: true,
          message: 'Login successful',
          access_token: data.access_token,
        };
      } catch (error) {
        console.error('Login error:', error);
        // Throw or handle the error as needed
        throw error;
      }
    }


  const handleLogin = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.currentTarget); // Collect form data
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
     
    } catch (err : any) {
     console.error(err);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
              disabled={loading}
                type="submit"
                className="w-full text-white bg-nexus-appmain hover:bg-nexus-appmain/70 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? 'Logging in...' : 'Sign in'}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <a
                  href="/signup"
                  className="font-medium text-nexus-appmain/60 hover:underline"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
