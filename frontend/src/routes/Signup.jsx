import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAccount } from "../redux/authReducer/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/CommonComponents/CustomInput";
import CustomPasswordInput from "../components/CommonComponents/CustomPasswordInput";
import logo from "../assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sign_up_processing = useSelector(
    (state) => state.authReducer.sign_up_processing
  );
  const sign_up_message = useSelector(
    (state) => state.authReducer.sign_up_message
  );
  const sign_up_success = useSelector(
    (state) => state.authReducer.sign_up_success
  );
  const sign_up_failed = useSelector(
    (state) => state.authReducer.sign_up_failed
  );
  const sign_in_success = useSelector(
    (state) => state.authReducer.sign_in_success
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: formData.name.trim(),
      password: formData.password.trim(),
      email: formData.email.trim(),
    };

    if (
      user.password.length > 30 ||
      user.email.length > 40 ||
      user.name.length > 30 ||
      formData.confirmPassword.trim().length > 30
    ) {
      toast.error("Maximum input length exceeded", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    } else if (user.password !== formData.confirmPassword.trim()) {
      toast.error("Passwords do not match", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    } else if (user.password.length < 7) {
      toast.error("Password must be at least 8 characters long", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return;
    } else {
      dispatch(createAccount(user));
    }
  };

  useEffect(() => {
    if (sign_in_success) {
      navigate("/");
    }

    if (!sign_up_processing && sign_up_failed && !sign_up_success) {
      toast.error(sign_up_message, { position: toast.POSITION.BOTTOM_LEFT });
    }

    if (!sign_up_processing && !sign_up_failed && sign_up_success) {
      toast.success("Account Successfully Created.", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    }
  }, [
    sign_up_processing,
    sign_up_success,
    sign_up_failed,
    sign_in_success,
    navigate,
    dispatch,
  ]);

  return (
    <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md mx-auto my-8">
      <div className="text-center">
        <a href="#" className="flex items-center justify-center mb-4">
          <span className="text-2xl font-extrabold text-gray-900">Sign Up</span>
        </a>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <CustomInput
            label="Name"
            value={formData.name}
            onChange={handleChange}
            name="name"
            placeholder="Full Name"
            required
            disabled={sign_up_processing}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm"
          />

          <CustomInput
            label="Email"
            value={formData.email}
            type="email"
            onChange={handleChange}
            name="email"
            placeholder="Email address"
            required
            disabled={sign_up_processing}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm"
          />

          <CustomPasswordInput
            label="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            required
            disabled={sign_up_processing}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm"
          />

          <CustomPasswordInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            disabled={sign_up_processing}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={sign_up_processing}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {sign_up_processing ? (
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
              Signing up...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/signin")}
          className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
        >
          Sign In
        </span>
      </p>

      <ToastContainer />
    </div>
  );
};

export default Signup;
