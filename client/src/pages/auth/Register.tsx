import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "@/api/authApi";
import MessageError from "@/components/ui/messageError";
import Footer from "@/components/footer";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "EMPLOYEE",
    username: "",
    name: "",
    contact: "",
    address: "",
    idNumber: "",
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
     onSuccess: () => {
          Swal.fire({
                  icon: "success",
                  title: "Successfully Register",
                  text: "The user was successfully added!",
                });
          navigate("/login");
        },
        onError: () => {
          Swal.fire({
                  icon: "error",
                  title: "Failed",
                  text: "Could not add user. Please try again.",
                });
        }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen pb-40 md:pb-0 overflow-y-auto bg-gradient-to-b from-slate-300 to-orange-100 relative">
      <div className="container flex-col md:flex-row mx-auto flex items-center justify-center gap-20 py-20">
        <div className="order-2 md:order-1 w-full md:w-1/2 flex flex-col gap-7">
          <img src="/hero-logo.png" className="w-full" alt="Hero Logo" />
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-[5.5rem] text-center font-medium text-[#4D83B9]">
              PLUS SIZE
            </h1>
            <h1 className="text-4xl text-right pr-7 font-semibold text-[#005A9C]">
              Apperal Shop
            </h1>
          </div>
        </div>

        <div className="order-1 md:order-2 bg-[#F6EBEB80] border-r-4 border-b-4 border-neutral-400/50 rounded-md p-8 w-full md:w-1/2">
          <p className="text-2xl font-bold text-primary mb-5 text-center">
            Create an Account
          </p>

          {registerMutation.isError && (
            <MessageError
              className="mb-5"
              message="Registration failed. Try again."
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact"
                name="contact"
                value={form.contact}
                onChange={handleChange}
              />
              <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ID Number"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
              />

              <div>
                <label className="text-sm font-semibold text-[#005A9C]">
                  Designation
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary/60 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/50 text-white font-bold py-4 rounded-md"
            >
              {registerMutation.isPending ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm text-[#005A9C] font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required
        onChange={onChange}
        className="w-full px-4 py-3 border border-primary/60 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
        placeholder={`Enter your ${name}`}
      />
    </div>
  );
}
