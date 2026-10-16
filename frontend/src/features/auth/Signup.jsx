import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signupThunk } from "./authThunks";
import { selectAuthStatus, selectAuthError } from "./authSlice";
import { ROUTES } from "../../routes/routePaths";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const [firstName, ...lastNameParts] = form.name.trim().split(/\s+/);
      const lastName = lastNameParts.join(" ") || "";

      const body = {
        first_name: firstName,
        last_name: lastName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        role: "user",
      };

      await dispatch(signupThunk(body)).unwrap();

      toast.success("Account created successfully! Please log in.");
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 900);
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err?.message || "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>

      <Input
        label="Name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        label="Mobile"
        type="text"
        required
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        icon={showPassword ? FaEye : FaEyeSlash}
        Click={() => setShowPassword(!showPassword)}
      />

      <Input
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        required
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        icon={showConfirmPassword ? FaEye : FaEyeSlash}
        Click={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {(localError || error) && (
        <p className="text-sm text-red-500">{localError || error}</p>
      )}

      <Button type="submit" loading={submitting || status === "loading"} className="w-full">
        Signup
      </Button>

      <p className="text-sm text-muted text-center">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="text-brand font-semibold">
          Login
        </Link>
      </p>
    </form>
  );
}