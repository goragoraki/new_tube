import { SearchIcon } from "lucide-react";

export function SearchInput() {
    // Todo: add search functionality
    return (
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full py-2 pl-4 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
                />
                {/** todo: add remove search button */}
            </div>
            <button
                type="submit"
                className="flex items-center px-5 py-2.5 justify-center rounded-r-full border-l-0 border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    );
}