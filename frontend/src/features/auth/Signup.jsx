import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupThunk } from "./authThunks";
import { selectAuthStatus, selectAuthError } from "./authSlice";
import { ROUTES } from "../../routes/routePaths";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error  = useSelector(selectAuthError);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signupThunk(form)).unwrap();
      navigate(ROUTES.HOME, { replace: true });
    } catch {}
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <Input label="Name" required value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Password" type="password" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" loading={status === "loading"} className="w-full">
        Signup
      </Button>
      <p className="text-sm text-muted text-center">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="text-brand font-semibold">Login</Link>
      </p>
    </form>
  );
}