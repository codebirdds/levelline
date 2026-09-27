import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginThunk } from "./authThunks";
import { selectAuthStatus, selectAuthError } from "./authSlice";
import { ROUTES } from "../../routes/routePaths";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error  = useSelector(selectAuthError);
  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await dispatch(loginThunk(form)).unwrap();
      navigate(user.role === "admin" ? ROUTES.ADMIN : from, { replace: true });
    } catch {}
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-ink">Login</h1>
      <Input label="Email" type="email" required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" loading={status === "loading"} className="w-full">
        Login
      </Button>
      <div className="flex justify-between text-sm text-muted">
        <Link to={ROUTES.FORGOT_PASSWORD} className="hover:text-brand">Forgot password?</Link>
        <Link to={ROUTES.SIGNUP} className="hover:text-brand">Create account</Link>
      </div>
    </form>
  );
}