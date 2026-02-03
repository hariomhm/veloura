import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithPassword, loginWithGoogle } from "../store/authSlice";
import useToast from "../hooks/useToast";
import config from "../config";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: showError, success: showSuccess } = useToast();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await dispatch(
        loginWithPassword({ email: data.email, password: data.password })
      ).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      showError(err || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error("Google login failed");
      await dispatch(loginWithGoogle({ idToken })).unwrap();
      showSuccess("Signed in with Google");
      navigate("/", { replace: true });
    } catch (err) {
      showError(err?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            VELOURA
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Please sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {config.googleClientId && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span>or</span>
              <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => showError("Google login failed")} />
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
