function SearchBar() {
  return (
    <search>
      <form>
        <input
          type="search"
          placeholder="Search articles..."
          className="rounded-[10px] border-2 border-solid border-(--color-border) bg-(--color-input) p-1.5 transition-all duration-500 ease-in-out hover:border-3 hover:border-(--color-text-interactive) hover:pr-20 max-md:w-25 max-md:flex-1 max-md:p-0.5 max-md:placeholder:text-[10px] max-md:hover:w-30 max-md:hover:pr-2"
        />
      </form>
    </search>
  );
}

export default SearchBar;
