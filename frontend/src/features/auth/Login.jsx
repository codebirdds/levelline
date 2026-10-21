import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginThunk } from "./authThunks";
import { selectAuthStatus, selectAuthError } from "./authSlice";
import { ROUTES } from "../../routes/routePaths";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Destination after login
  const from = location.state?.from?.pathname || ROUTES.HOME;
  const intent = location.state?.intent; // "buy" | "add" | undefined

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await dispatch(loginThunk(form));

      if (user?.role === "admin") {
        navigate(ROUTES.ADMIN, { replace: true });
        return;
      }

      if (intent === "buy") {
        navigate(ROUTES.CHECKOUT, { replace: true });
        return;
      }

      navigate(from, { replace: true });
    } catch {
      // error already in the slice
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-ink">Login</h1>

      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" loading={submitting || status === "loading"} className="w-full">
        Login
      </Button>

      <div className="flex justify-between text-sm text-muted">
        <Link to={ROUTES.FORGOT_PASSWORD} className="hover:text-brand">
          Forgot password?
        </Link>
        <Link to={ROUTES.SIGNUP} className="hover:text-brand">
          Create account
        </Link>
      </div>
    </form>
  );
}