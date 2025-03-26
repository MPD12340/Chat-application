import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { signInAccount } from "../redux/authReducer/action";
import CustomInput from "../components/CommonComponents/CustomInput";
import CustomPasswordInput from "../components/CommonComponents/CustomPasswordInput";
import logo from "../assets/logo.png";

const Signin = () => {
  const dispatch = useDispatch();
  const sign_in_processing = useSelector(
    (state) => state.authReducer.sign_in_processing
  );
  const sign_in_message = useSelector(
    (state) => state.authReducer.sign_in_message
  );
  const sign_in_success = useSelector(
    (state) => state.authReducer.sign_in_success
  );
  const sign_in_failed = useSelector(
    (state) => state.authReducer.sign_in_failed
  );
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      password: formData.password.trim(),
      email: formData.email.trim(),
    };

    if (user.password.length > 30 || user.email.length > 40) {
      toast.error("Maximum input length exceeded", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    } else {
      dispatch(signInAccount(user));
    }
  };

  useEffect(() => {
    if (!sign_in_processing && sign_in_failed && !sign_in_success) {
      toast.error(sign_in_message, { position: toast.POSITION.BOTTOM_LEFT });
    }
    if (!sign_in_processing && !sign_in_failed && sign_in_success) {
      toast.success("Login Success.", { position: toast.POSITION.BOTTOM_LEFT });
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  }, [sign_in_processing, sign_in_success, sign_in_failed, navigate, dispatch]);

  return (
    <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md mx-auto my-8">
      <div className="text-center">
        <a href="#" className="flex items-center justify-center mb-4">
          <span className="text-2xl font-extrabold text-gray-900">Sign In</span>
        </a>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <CustomInput
            label="Email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email address"
            required
            disabled={sign_in_processing}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm"
          />

          <CustomPasswordInput
            label="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            required
            disabled={sign_in_processing}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={sign_in_processing}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {sign_in_processing ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-2 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
        >
          Sign Up
        </span>
      </p>

      <ToastContainer />
    </div>
  );
};

export default Signin;
