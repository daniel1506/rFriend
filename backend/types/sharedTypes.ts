export const eventPrivacy = ["only-me", "friends", "friends-of-friends", "public"] as const;
export type EventPrivacyType = typeof eventPrivacy[number];

export const eventCategory = ["dining", "sports", "study", "work", "leisure", "others"];
export type EventCategoryType = typeof eventCategory[number];
