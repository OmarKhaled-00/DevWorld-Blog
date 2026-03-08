function HeroTitle({ title }) {
  return (
    <section className="m-3 flex justify-center">
      <div className="animate__animated animate__backInLeft animate-fill-title-left animate-fill-title-right relative rounded-[20px] border-2 border-solid border-(--color-border) bg-linear-to-r from-[#16a085] to-[#0ea5e9] bg-clip-text p-2 text-4xl text-transparent uppercase transition-all delay-400 before:absolute before:top-1/2 before:-left-7.5 before:-z-10 before:h-3.5 before:w-3.5 before:-translate-y-1/2 before:rounded-full before:bg-cyan-400 before:transition-all before:duration-400 before:content-[''] after:absolute after:top-1/2 after:-right-7.5 after:-z-10 after:h-3.5 after:w-3.5 after:-translate-y-1/2 after:rounded-full after:bg-cyan-400 after:transition-all after:duration-400 after:content-[''] hover:bg-cyan-400 hover:bg-none hover:bg-clip-border hover:text-black max-md:text-[16px] before:max-md:h-2 before:max-md:w-2 after:max-md:h-2 after:max-md:w-2">
        {title}
      </div>
    </section>
  );
}

export default HeroTitle;
