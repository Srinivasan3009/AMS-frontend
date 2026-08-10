import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4">Login</h3>
        <LoginForm />
      </div>
    </div>
  );
}