
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

const AuthComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{isLogin ? "Sign In" : "Register"}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password")} className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => { setIsLogin(!isLogin); reset(); }} className="text-blue-600 ml-2">
          {isLogin ? "Create one" : "Sign In"}
        </button>
      </p>
    </div>
  );
};

export default AuthComponent;
