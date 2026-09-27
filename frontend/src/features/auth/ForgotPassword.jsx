import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordThunk } from "./authThunks";
import { useDispatch } from "react-redux";
import { ROUTES } from "../../routes/routePaths";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPasswordThunk(email));
    } catch {}
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Reset password</h1>
      {sent ? (
        <p className="text-sm text-green-600">Reset link sent ✅</p>
      ) : (
        <>
          <Input label="Email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full">Send reset link</Button>
        </>
      )}
      <Link to={ROUTES.LOGIN} className="text-sm text-brand inline-block">
        ← Back to login
      </Link>
    </form>
  );
}