"use client"

import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchInput() {
    // Todo: add search functionality
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const [value, setValue] = useState(query)
    const router = useRouter();
    const handleSearch = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const url = new URL("/search", APP_URL);
        const newQuery = value.trim();

        url.searchParams.set("query", encodeURIComponent(newQuery));

        if (categoryId) {
            url.searchParams.set("categoryId", categoryId);
        }

        if (newQuery === "") {
            url.searchParams.delete("query");
        }

        setValue(newQuery);
        router.push(url.toString());
    }

    return (
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search"
                    className="w-full py-2 pl-4 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
                />
                {/** todo: add remove search button */}
                {value && (
                    <Button
                        type="button"
                        disabled={!value.trim()}
                        variant="ghost"
                        size="icon"
                        onClick={() => setValue("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    >
                        <XIcon className="text-gray-500" />
                    </Button>
                )}
            </div>
            <button
                type="submit"
                className="flex items-center px-5 py-2.5 justify-center rounded-r-full border-l-0 border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => handleSearch(e)}
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    );
}