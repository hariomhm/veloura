import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import authService from "../lib/auth";
import { account, ID } from "../lib/appwrite";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  /* ================= PASSWORD STRENGTH ================= */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(confirmPassword === password);
    } else {
      setPasswordMatch(null);
    }
  }, [confirmPassword, password]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create account
      await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.name
      );

      // 2️⃣ Create session
      await account.createEmailPasswordSession(
        data.email,
        data.password
      );

      // 3️⃣ Set default role (VERY IMPORTANT)
      await account.updatePrefs({
        role: "user", // 🔥 change to "admin" for admin accounts
      });

      // 4️⃣ Fetch user
      const user = await account.get();

      // 5️⃣ Redux login
      dispatch(login({ userData: user }));

      navigate("/");
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            Veloura
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* NAME */}
          <input
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* STRENGTH */}
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${
                  i <= passwordStrength ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* CONFIRM */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm password",
              })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {passwordMatch !== null && (
            <p className={`text-xs ${passwordMatch ? "text-green-500" : "text-red-500"}`}>
              {passwordMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
