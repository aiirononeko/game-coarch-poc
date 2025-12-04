"use client";

import { login, signup } from "@/app/auth/actions";

export default function AuthForm() {
  return (
    <form className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login / Sign Up</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <button
          type="submit"
          formAction={login}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Log in
        </button>
        <button
          type="submit"
          formAction={signup}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
