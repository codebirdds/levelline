import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordThunk } from "./authThunks";
import { useDispatch } from "react-redux";
import { ROUTES } from "../../routes/routePaths";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { FaEye,FaEyeSlash  } from "react-icons/fa";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sent, setSent]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(forgotPasswordThunk(email,password));
      debugger
      if (response?.success){
        setSent(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch(err){
      
      setError(err.response?.data?.message || "Password reset failed");
  }}

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Reset password</h1>
      {sent ? (
        <p className="text-sm text-green-600">Password reset successfully ✅</p>
      ):
       (
        <>
          <Input label="Email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <Input label="New Password" type={showPassword ? "text" : "password"} required value={password}
            onChange={(e) => setPassword(e.target.value)}  icon={showPassword ? FaEye : FaEyeSlash} Click={() => setShowPassword(!showPassword)} />
          <Input label="Confirm New Password" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}  icon={showConfirmPassword ? FaEye : FaEyeSlash} Click={() => setShowConfirmPassword(!showConfirmPassword)} />
          {password !== confirmPassword && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={password !== confirmPassword}>
            Reset Password
          </Button>
        </>
      )}
      <Link to={ROUTES.LOGIN} className="text-sm text-brand inline-block">
        ← Back to login
      </Link>
    </form>
  );
}