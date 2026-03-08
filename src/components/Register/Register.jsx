import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import axios from "axios";
import { ENV } from "../../config/ENV";
import handleInputChange from "../../utils/handleInputChange";
import { useNavigate } from "react-router-dom";

function Register({ whichBtn }) {
  /* =========================== */
  /* =======Local Sign Up===== */
  /* =========================== */

  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });

  const [logData, setLogData] = useState({
    username: "",
    password: "",
  });

  const handleFormData = handleInputChange(setFormData);
  const handleLoginData = handleInputChange(setLogData);

  async function localSignUp(event) {
    event.preventDefault();

    try {
      const result = await axios.post(`${ENV.LOCAL_API_URL}/signUp`, formData, {
        withCredentials: true,
      });
      console.log(result);
      Navigate("/home");
    } catch (err) {
      console.log(err);
    }
  }

  /* =========================== */
  /* =======Local Sign In===== */
  /* =========================== */
  async function localSignIn(event) {
    event.preventDefault();

    try {
      const result = await axios.post(`${ENV.LOCAL_API_URL}/signIn`, logData, {
        withCredentials: true,
      });
      console.log(result);
      Navigate("/home");
    } catch (err) {
      console.log(err);
    }
  }

  return whichBtn === "signUp" ? (
    <>
      <div className="animate__animated animate__zoomIn container h-fit rounded-2xl border-2 border-solid border-(--color-cyan) bg-(--color-input) max-2xl:w-fit">
        <div className="title mt-2 flex flex-col items-center justify-between gap-2">
          <h2 className="bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text text-3xl font-bold text-transparent">
            DevWorld Blog
          </h2>
          <small className="text-gray-400">developer community</small>
        </div>
        <form
          onSubmit={localSignUp}
          className="flex flex-col items-center justify-between gap-2"
        >
          <h3 className="max-md:text-lg md:text-xl">
            Welcome to our community
          </h3>
          <label
            type="text"
            className="text-gray-400 capitalize after:ml-0.5 after:text-red-500 after:content-['*'] max-md:text-[10px] md:text-[12px]"
          >
            Please enter the form data.
          </label>
          <div
            className={
              "flex items-center justify-between gap-1 max-md:flex-col"
            }
          >
            <input
              className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
              type="text"
              name="first_name"
              id="first_name"
              placeholder="first name"
              value={formData.first_name}
              required
              autoFocus
              onChange={handleFormData}
            />
            <input
              className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
              type="text"
              name="last_name"
              id="last_name"
              placeholder="last name"
              value={formData.last_name}
              required
              onChange={handleFormData}
            />
          </div>
          <input
            className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
            type="email"
            name="username"
            id="name"
            placeholder="email"
            value={formData.username}
            required
            onChange={handleFormData}
          />
          <div
            className={
              "flex items-center justify-between gap-1 max-md:flex-col"
            }
          >
            <input
              className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
              type="password"
              name="password"
              id="password"
              placeholder="password"
              value={formData.password}
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}"
              title="Must contain uppercase, lowercase, number, special character, and be at least 8 characters"
              onChange={handleFormData}
              required
            />
            <input
              className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
              type="password"
              name="confirmedPass"
              id="confirmedPass"
              placeholder="set password again"
              required
              onInput={(e) =>
                e.target.setCustomValidity(
                  e.target.value !== document.getElementById("password").value
                    ? "Passwords do not match."
                    : "",
                )
              }
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-2xl border-2 border-solid border-(--color-ring) p-2 capitalize hover:bg-(--color-text-interactive) hover:text-black max-md:text-[12px] md:text-[14px]"
          >
            submit
          </button>
        </form>
        <div className="m-1.5 flex flex-col items-center justify-between gap-2">
          <button
            type="submit"
            onClick={() => {
              window.location.href = `${ENV.GOOGLE_API_URL}`;
            }}
            className="cursor-pointer rounded-2xl border-2 border-solid border-b-emerald-900 bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text p-1 font-bold text-transparent capitalize hover:text-white max-md:text-[12px]"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              size="1x"
              className="mr-1.5 text-blue-500 opacity-70 transition-transform duration-500 group-hover:rotate-y-360 max-md:text-[12px]"
            />
            sign up with google
          </button>
          <p className="m-2 text-gray-400 max-md:text-[10px] md:text-[12px]">
            By signing up, you agree to our{" "}
            <span className="text-(--color-success)"> Terms of Service </span>{" "}
            and
            <span className="text-(--color-success)"> Privacy Policy </span> ©
            2025 DevWorld Blog. All rights reserved.
          </p>
          <a
            href=""
            className="b-(--color-input) cursor-pointer rounded-2xl border-2 border-solid border-(--color-ring) p-2 text-[13px] md:hidden"
            onClick={window.history.back()}
          >
            Back
          </a>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="animate__animated animate__zoomIn container h-fit rounded-2xl border-2 border-solid border-(--color-cyan) bg-(--color-input) max-2xl:w-fit">
        <div className="title mt-2 flex flex-col items-center justify-between gap-1.5">
          <h2 className="bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text text-3xl font-bold text-transparent">
            DevWorld Blog
          </h2>
          <small className="text-gray-400">developer community</small>
        </div>
        <form
          onSubmit={localSignIn}
          className="flex flex-col items-center justify-between gap-2.5"
        >
          <h3 className="text-xl">Welcome Back</h3>
          <label
            type="text"
            className="text-xs text-gray-400 after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Please enter your email and password.
          </label>
          <input
            className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
            type="email"
            name="username"
            id="email"
            placeholder="email"
            value={logData.username}
            onChange={handleLoginData}
            autoFocus
            required
          />
          <input
            className="rounded-2xl border-2 border-solid border-(--color-cyan) p-2 placeholder:capitalize max-md:placeholder:text-[12px]"
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={logData.password}
            onChange={handleLoginData}
            required
          />
          <button
            className="cursor-pointer rounded-2xl border-2 border-solid border-(--color-ring) p-2 capitalize hover:bg-(--color-text-interactive) hover:text-black max-2xl:text-[14px] max-md:text-[12px]"
            type="submit"
          >
            login
          </button>
        </form>
        <div className="m-1.5 flex flex-col items-center justify-between gap-2">
          <button
            type="submit"
            onClick={() => {
              window.location.href = `${ENV.GOOGLE_API_URL}`;
            }}
            className="cursor-pointer rounded-2xl border-2 border-solid border-b-emerald-900 bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text p-1 font-bold text-transparent capitalize hover:text-white"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              size="1x"
              className="mr-1.5 text-blue-500 opacity-70 transition-transform duration-500 group-hover:rotate-y-360 max-md:text-[12px]"
            />
            sign in with google
          </button>
          <p className="m-2 text-[12px] text-gray-400">
            By signing in, you agree to our
            <span className="text-(--color-success)"> Terms of Service </span>
            and
            <span className="text-(--color-success)"> Privacy Policy </span> ©
            2025 DevWorld Blog. All rights reserved.
          </p>
          <a
            href=""
            className="b-(--color-input) cursor-pointer rounded-2xl border-2 border-solid border-(--color-ring) p-2 text-[13px] md:hidden"
            onClick={window.history.back()}
          >
            Back
          </a>
        </div>
      </div>
    </>
  );
}

export default Register;
