import { SearchIcon } from "lucide-react";

export default function SearchInput() {
    return (
        <form className="flex w-full max-w-[600px]">
            <div className="w-full">
                <input
                    className="w-full py-2 pl-4 pr-12 border rounded-l-full focus:outline-none focus:border-blue-500"
                    placeholder="Search"
                    type="text"
                />
            </div>
            <button
                className="flex bg-gray-100 px-5 py-2.5 border-l-0 justify-center items-center rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    );
}