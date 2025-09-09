import { relations } from "drizzle-orm";
import { foreignKey, integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import {
    createInsertSchema,
    createUpdateSchema,
    createSelectSchema,
} from "drizzle-zod"

export const reactionType = pgEnum("reaction_type", ["like", "dislike"])

export const playlistVideos = pgTable("playlist_video", {
    playlistId: uuid("playlist_id").references(() => playlists.id).notNull(),
    videoId: uuid("video_id").references(() => videos.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name: "playlist_videos_pk",
        columns: [t.playlistId, t.videoId],
    })
]);

export const playlistVideoRelations = relations(playlistVideos, ({ one }) => ({
    playlist: one(playlists, {
        fields: [playlistVideos.playlistId],
        references: [playlists.id]
    }),
    video: one(videos, {
        fields: [playlistVideos.videoId],
        references: [videos.id]
    })
}))

export const playlists = pgTable("playlists", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
    user: one(users, {
        fields: [playlists.userId],
        references: [users.id]
    }),
    playlistVideo: many(playlistVideos),
}))

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    bannerUrl: text("banner_url"),
    bannerKey: text("banner_key"),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const userRelations = relations(users, ({ many }) => ({
    videos: many(videos),
    videoViews: many(videoViews),
    videoReactons: many(videoReactions),
    subscriptions: many(subscriptions, {
        relationName: "subscriptions_viewer_id_fkey"
    }),
    subscribers: many(subscriptions, {
        relationName: "subscriptions_creator_id_fkey"
    }),
    comments: many(comments),
    commentReactions: many(commentReactions),
    playlists: many(playlists),
}))

export const subscriptions = pgTable("subscriptions", {
    viewerId: uuid("viewer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    creatorId: uuid("creator_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name: "subscriptions_pk",
        columns: [t.viewerId, t.creatorId],
    })
])

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    viewer: one(users, {
        fields: [subscriptions.viewerId],
        references: [users.id],
        relationName: "subscriptions_viewer_id_fkey"
    }),
    creator: one(users, {
        fields: [subscriptions.creatorId],
        references: [users.id],
        relationName: "subscriptions_creator_id_fkey"
    }),
}))

export const categories = pgTable('categories', {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("update_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("name_idx").on(t.name)]);

export const categoryRelations = relations(categories, ({ many }) => ({
    videos: many(videos)
}))

export const videoVisibility = pgEnum("video_visibility", [
    "private",
    "public",
])

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),

    muxStatus: text("mux_status"),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text("mux_upload_id").unique(),
    muxPlayBackId: text("mux_playback_id").unique(),
    muxTrackId: text("mux_track_id").unique(),
    muxTrackStatus: text("mux_track_status"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailKey: text("thumbnail_key"),
    previewUrl: text("preview_url"),
    previewKey: text("preview_key"),
    duration: integer("duration"),
    visibility: videoVisibility("video_visibility").default("public").notNull(),

    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade" // user id가 지워지면 이 비디오도 지워지게
    }).notNull(), // foreign key
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const videoRelations = relations(videos, ({ one, many }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
    views: many(videoViews),
    reactions: many(videoReactions),
    comments: many(comments),
    playlistVideos: many(playlistVideos),
}))

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("praent_id"),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, { onDelete: "cascade" }).notNull(),
    value: text("comments").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => {
    return [
        foreignKey({
            name: "comments_parent_id_fkey",
            columns: [t.parentId],
            foreignColumns: [t.id],
        })
            .onDelete("cascade"),
    ]
})

export const commentsRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id]
    }),
    video: one(videos, {
        fields: [comments.videoId],
        references: [videos.id]
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: "comments_parent_id_fkey"
    }),
    reactions: many(commentReactions),
    replies: many(comments, {
        relationName: "comments_parent_id_fkey"
    })
}))

export const commentsSelectSchema = createSelectSchema(comments);
export const commentsInsertSchema = createInsertSchema(comments).omit({ userId: true }); // insert 시 필요한 필드 검증 (ex: userId, videoId 필수)
export const commentsUpdateSchema = createUpdateSchema(comments); // update 시변경 가능한 필드검증

export const commentReactions = pgTable("comment_reactions", {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    commentsId: uuid("comments_id").references(() => comments.id, { onDelete: "cascade" }).notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name: "comment_reactions_pk",
        columns: [t.userId, t.commentsId],
    })
])

export const commentReactionsRelations = relations(commentReactions, ({ one }) => ({
    user: one(users, {
        fields: [commentReactions.userId],
        references: [users.id]
    }),
    comment: one(comments, {
        fields: [commentReactions.commentsId],
        references: [comments.id],
    })
}))

export const videoViews = pgTable("video_views", {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, { onDelete: "cascade" }).notNull(),
    createAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name: "video_views_pk",
        columns: [t.userId, t.videoId],
    })
])

export const videoViewRelations = relations(videoViews, ({ one }) => ({
    user: one(users, {
        fields: [videoViews.userId],
        references: [users.id]
    }),
    video: one(videos, {
        fields: [videoViews.videoId],
        references: [videos.id]
    })
}))

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews); // insert 시 필요한 필드 검증 (ex: userId, videoId 필수)
export const videoViewUpdateSchema = createUpdateSchema(videoViews); // update 시변경 가능한 필드검증
// => db 스키마와 zod 스키마를 중복 정의할 필요없이 자동 동기화
// 여기서 사용하지 않지만 relational query api 를 사용할때 필요한 코드들 relations 등등


export const videoReactions = pgTable("video_reactions", {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, { onDelete: "cascade" }).notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name: "video_reactions_pk",
        columns: [t.userId, t.videoId],
    })
])

export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
    user: one(users, {
        fields: [videoReactions.userId],
        references: [users.id]
    }),
    video: one(videos, {
        fields: [videoReactions.videoId],
        references: [videos.id]
    })
}))

export const videotReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionsInsertSchema = createInsertSchema(videoReactions); // insert 시 필요한 필드 검증 (ex: userId, videoId 필수)
export const videoReactionsUpdateSchema = createUpdateSchema(videoReactions); // update 시변경 가능한 필드검증