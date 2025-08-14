import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
    "차",
    "교육",
    "게임",
    "음악",
    "스포츠",
    "과학기술",
    "정치",
    "영화",
    "애니메이션",
    "동물",
    "여행",
    "예능",
    "뉴스"
];

async function main() {
    console.log("seeding categories...");

    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`,
        }))

        await db.insert(categories).values(values);

        console.log("Categories seeded successfully!")
    } catch (error) {
        console.error("Error seeding categories: ", error);
        process.exit(1);
    }
}

main();