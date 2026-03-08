import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
function Footer() {
  const date = new Date().getFullYear();

  return (
    <footer className="mt-2.5 w-full bg-cover">
      <div className="animate__animated animate__fadeInUp flex flex-col items-center justify-between gap-3 uppercase">
        <p className="max-md:text-sm">We Are Social</p>
        <div className="social-icons animate__animated animate__pulse animate__infinite animate__slow flex items-center justify-between gap-2">
          <a
            href="https://omarkhaled-00.github.io/Portfolio/"
            className="rounded-2xl border-2 border-solid border-(--color-ring) bg-(--color-input) p-2 hover:bg-(--color-text-interactive) hover:text-black max-md:p-1"
          >
            <FontAwesomeIcon icon={faUser} />
          </a>
          <a
            href="https://github.com/OmarKhaled-00"
            className="rounded-2xl border-2 border-solid border-(--color-ring) bg-(--color-input) p-2 hover:bg-(--color-text-interactive) hover:text-black max-md:p-1"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            href="https://www.linkedin.com/in/omar-khaled-4a85aa271/"
            className="rounded-2xl border-2 border-solid border-(--color-ring) bg-(--color-input) p-2 hover:bg-(--color-text-interactive) hover:text-black max-md:p-1"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <p className="bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text text-transparent capitalize max-md:text-sm">
          Copyright © {date} Eng: Omar Khaled
        </p>
      </div>
    </footer>
  );
}

export default Footer;
