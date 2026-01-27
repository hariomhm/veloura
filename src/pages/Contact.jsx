import { useState } from "react";
import { useForm } from "react-hook-form";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [status, setStatus] = useState("idle");

  const onSubmit = async (data) => {
    setStatus("loading");

    try {
      // TODO: Connect Appwrite / Email service here

      await new Promise((res) => setTimeout(res, 1000));

      setStatus("success");
      reset();

      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Contact Veloura
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>

          <div>
            <h3 className="font-medium">Customer Support</h3>
            <p className="text-gray-600 dark:text-gray-300">
              support@veloura.com
            </p>
          </div>

          <div>
            <h3 className="font-medium">Business Inquiries</h3>
            <p className="text-gray-600 dark:text-gray-300">
              business@veloura.com
            </p>
          </div>

          <div>
            <h3 className="font-medium">Office</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Jaipur, Rajasthan<br />
              India
            </p>
          </div>

          <div>
            <h3 className="font-medium">Support Hours</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monday – Saturday<br />
              10:00 AM – 7:00 PM
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Send Us a Message
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Message</label>
              <textarea
                rows="5"
                {...register("message", {
                  required: "Message is required",
                })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.message && (
                <p className="text-red-500 text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send Message"}
            </button>
          </form>

          {status === "success" && (
            <div className="mt-4 p-4 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
              Thank you for reaching out! We’ll get back to you shortly.
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 p-4 rounded bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200">
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
