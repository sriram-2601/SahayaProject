import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

function SignInwithGoogle() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        try {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: user.displayName || "Friend",
            photo: user.photoURL || "",
            lastName: "",
            lastLogin: new Date(),
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Could not write user to Firestore:", dbErr.message);
        }

        toast.success(`Welcome, ${user.displayName || "Friend"}! Logged in successfully.`, {
          position: "top-center",
        });

        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      if (error.code === "auth/permission-denied" || error.message.includes("suspended")) {
        toast.error("Firebase API key has been suspended. Please check Google Cloud / Firebase Console.", {
          position: "bottom-center",
          autoClose: 6000,
        });
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error("Domain unauthorized. Add sriram-2601.github.io to Authorized Domains in Firebase Console.", {
          position: "bottom-center",
          autoClose: 6000,
        });
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled.", { position: "bottom-center" });
      } else {
        toast.error(`Authentication error: ${error.message}`, {
          position: "bottom-center",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <button
        type="button"
        onClick={googleLogin}
        style={{
          width: "100%",
          height: "46px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          background: "#FFFFFF",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "var(--color-text-main)",
          boxShadow: "var(--shadow-sm)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-bg)";
          e.currentTarget.style.borderColor = "var(--color-border-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFFFF";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default SignInwithGoogle;