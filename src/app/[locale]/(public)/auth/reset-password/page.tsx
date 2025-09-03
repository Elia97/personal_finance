import ResetPasswordForm from "@/components/reset-password-form";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default function ResetPasswordPage() {
  return (
    <section>
      <ResetPasswordForm />
    </section>
  );
}
