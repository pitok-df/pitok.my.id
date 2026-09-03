import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../generated/client/client";

const isDbConfigured = Boolean(process.env.DATABASE_URL);

let prisma: PrismaClient | null = null;
let pool: pg.Pool | null = null;

if (isDbConfigured && process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
  }
}

// Hashing function to convert CUID string to unique number IDs for the frontend
export function stringToId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface AdminConfig {
  passwordHash: string;
}

export interface ContentData {
  hero: {
    greeting: string;
    name: string;
    titles: string[];
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    availableForWork: boolean;
  };
  about: {
    bio: string;
    facts: { value: string; label: string }[];
  };
  skills: {
    categories: { name: string; icon: string; items: string[] }[];
  };
  projects: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    gradient: string;
  }[];
  experience: {
    id: number;
    role: string;
    company: string;
    period: string;
    description: string;
    current: boolean;
  }[];
  education: {
    id: number;
    degree: string;
    school: string;
    period: string;
    description: string;
  }[];
  certifications: {
    id: number;
    title: string;
    issuer: string;
    date: string;
  }[];
  services: {
    id: number;
    title: string;
    description: string;
  }[];
  setup: {
    os: string;
    editor: string;
    terminal: string;
    hardware: string;
  };
  contact: {
    heading: string;
    subheading: string;
    email: string;
    social: { github: string; linkedin: string; instagram: string };
  };
  meta: {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    ogImage?: string;
  };
  admin?: AdminConfig;
  features?: {
    crtEnabled: boolean;
    biosBootEnabled: boolean;
    biosBootDuration: number;
    biosTitle: string;
    biosLines: string[];
    contextMenuEnabled: boolean;
    glitchEffectEnabled: boolean;
    devConsoleWarningEnabled: boolean;
    devConsoleWarningTitle: string;
    devConsoleWarningText: string;
    synthSoundboardEnabled: boolean;
    floppyDiskDefaultTheme: string;
    audioVolume: number;
  };
  gallery?: GalleryItem[];
}

export interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  date: string;
}

export interface Message {
  id: number;
  name: string;
  message: string;
  timestamp: string;
}

export interface Reply {
  id: number;
  name: string;
  replyTo: string | null;
  message: string;
  timestamp: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  creator: string;
  timestamp: string;
  replies: Reply[];
}

export async function readData<T>(
  key: string,
  localFileName: string,
  defaultValue: T,
): Promise<T> {
  const localPath = path.join(process.cwd(), "data", localFileName);

  if (isDbConfigured && prisma) {
    try {
      if (key === "content") {
        let baseConfig: ContentData | null = null;
        try {
          const configRecord = await prisma.systemConfig.findUnique({
            where: { key: "content" },
          });
          if (configRecord) {
            baseConfig = JSON.parse(configRecord.value) as ContentData;
          }
        } catch (dbError) {
          console.error("Failed to read SystemConfig from DB:", dbError);
        }

        // Fallback to local content.json if SystemConfig doesn't exist in DB yet
        if (!baseConfig) {
          baseConfig = await readLocalFile<ContentData>(
            localPath,
            defaultValue as ContentData,
          );
          // Save it to DB for future queries
          try {
            await prisma.systemConfig.upsert({
              where: { key: "content" },
              update: { value: JSON.stringify(baseConfig) },
              create: { key: "content", value: JSON.stringify(baseConfig) },
            });
          } catch (dbError) {
            console.error("Failed to initialize SystemConfig in DB:", dbError);
          }
        }

        const localData = baseConfig;

        // 1. Sync Profile Data
        const dbProfiles = await prisma.profile.findMany();
        const profile = dbProfiles[0];
        if (profile) {
          localData.hero = {
            ...localData.hero,
            name: profile.name,
            titles: [profile.headline],
            subtitle: profile.bio,
          };
          localData.about = {
            ...localData.about,
            bio: profile.bio,
          };
          if (localData.contact) {
            localData.contact.email = profile.email || localData.contact.email;
            localData.contact.social = {
              github: profile.githubUrl || localData.contact.social.github,
              linkedin:
                profile.linkedinUrl || localData.contact.social.linkedin,
              instagram: localData.contact.social.instagram,
            };
          }
        }

        // 2. Sync Projects Data
        const dbProjects = await prisma.project.findMany({
          orderBy: { order: "asc" },
        });
        if (dbProjects.length > 0) {
          localData.projects = dbProjects.map((p, idx) => ({
            id: stringToId(p.id),
            title: p.title,
            description: p.description,
            tags: p.tags,
            liveUrl: p.link || "#",
            githubUrl: "#",
            featured: p.featured,
            gradient:
              p.imageUrl ||
              (idx % 3 === 0
                ? "from-blue-500 to-indigo-500"
                : idx % 3 === 1
                  ? "from-purple-500 to-pink-500"
                  : "from-cyan-500 to-blue-500"),
          }));
        }

        // 3. Sync Skills Data
        const dbSkills = await prisma.skill.findMany({
          orderBy: { order: "asc" },
        });
        if (dbSkills.length > 0) {
          const categoriesMap = new Map<string, string[]>();
          for (const s of dbSkills) {
            const cat = s.category || "General";
            let items = categoriesMap.get(cat);
            if (!items) {
              items = [];
              categoriesMap.set(cat, items);
            }
            items.push(s.name);
          }
          localData.skills.categories = Array.from(categoriesMap.entries()).map(
            ([name, items]) => ({
              name,
              icon: name.toLowerCase(),
              items,
            }),
          );
        }

        return localData as unknown as T;
      }

      if (key === "topics") {
        const dbComments = await prisma.comment.findMany({
          include: {
            User: true,
            CommentReply: {
              include: {
                User: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        const topics = dbComments.map((c) => {
          let title = "Diskusi";
          let description = c.content;
          try {
            const parsed = JSON.parse(c.content);
            if (
              parsed &&
              typeof parsed === "object" &&
              parsed.title &&
              parsed.description
            ) {
              title = parsed.title;
              description = parsed.description;
            }
          } catch (_e) {}

          const replies = c.CommentReply.map((r) => {
            let message = r.content;
            let replyTo: string | null = null;
            try {
              const parsed = JSON.parse(r.content);
              if (parsed && typeof parsed === "object" && parsed.message) {
                message = parsed.message;
                replyTo = parsed.replyTo || null;
              }
            } catch (_e) {}

            return {
              id: stringToId(r.id),
              name: r.User?.name || "Anonymous",
              replyTo,
              message,
              timestamp: r.createdAt.toISOString(),
            };
          });

          return {
            id: stringToId(c.id),
            title,
            description,
            creator: c.User?.name || "Anonymous",
            timestamp: c.createdAt.toISOString(),
            replies,
          };
        });

        return topics as unknown as T;
      }

      if (key === "messages") {
        const dbComments = await prisma.comment.findMany({
          include: { User: true },
          orderBy: { createdAt: "desc" },
        });
        const messages = dbComments.map((c) => {
          let message = c.content;
          try {
            const parsed = JSON.parse(c.content);
            if (parsed && typeof parsed === "object" && parsed.description) {
              message = parsed.description;
            }
          } catch (_e) {}
          return {
            id: stringToId(c.id),
            name: c.User?.name || "Anonymous",
            message,
            timestamp: c.createdAt.toISOString(),
          };
        });
        return messages as unknown as T;
      }
    } catch (error) {
      console.error(
        `Error reading from DB for key ${key}, falling back to local file:`,
        error,
      );
    }
  }

  return readLocalFile(localPath, defaultValue);
}

export async function writeData<T>(
  key: string,
  localFileName: string,
  data: T,
): Promise<void> {
  const localPath = path.join(process.cwd(), "data", localFileName);

  if (isDbConfigured && prisma) {
    try {
      if (key === "content") {
        const content = data as unknown as ContentData;

        // 1. Sync SystemConfig in DB (contains baseline certifications, services, features, etc.)
        await prisma.systemConfig.upsert({
          where: { key: "content" },
          update: { value: JSON.stringify(content) },
          create: { key: "content", value: JSON.stringify(content) },
        });

        // 2. Sync Profile Data
        const existingProfile = await prisma.profile.findFirst();
        const profileData = {
          name: content.hero.name,
          headline: content.hero.titles[0] || "",
          bio: content.about.bio || content.hero.subtitle,
          githubUrl: content.contact?.social?.github || null,
          linkedinUrl: content.contact?.social?.linkedin || null,
          email: content.contact?.email || null,
          updatedAt: new Date(),
        };

        if (existingProfile) {
          await prisma.profile.update({
            where: { id: existingProfile.id },
            data: profileData,
          });
        } else {
          await prisma.profile.create({
            data: {
              id: `profile-${Date.now()}`,
              ...profileData,
            },
          });
        }

        // 2. Sync Projects Data
        const dbProjects = await prisma.project.findMany();
        const uiProjectIds = new Set(content.projects.map((p) => String(p.id)));

        // Delete removed projects
        for (const dbP of dbProjects) {
          if (
            !uiProjectIds.has(dbP.id) &&
            !uiProjectIds.has(String(stringToId(dbP.id)))
          ) {
            await prisma.project.delete({ where: { id: dbP.id } });
          }
        }

        // Upsert projects
        for (let i = 0; i < content.projects.length; i++) {
          const p = content.projects[i];
          const projData = {
            title: p.title,
            description: p.description,
            link: p.liveUrl || null,
            tags: p.tags,
            order: i,
            featured: p.featured ?? true,
            updatedAt: new Date(),
          };

          const existingProj = dbProjects.find(
            (dbP) =>
              dbP.id === String(p.id) || stringToId(dbP.id) === Number(p.id),
          );
          if (existingProj) {
            await prisma.project.update({
              where: { id: existingProj.id },
              data: projData,
            });
          } else {
            await prisma.project.create({
              data: {
                id: `project-${Date.now()}-${i}`,
                ...projData,
              },
            });
          }
        }

        // 3. Sync Skills Data
        await prisma.skill.deleteMany();
        let order = 0;
        for (const cat of content.skills.categories) {
          for (const item of cat.items) {
            await prisma.skill.create({
              data: {
                id: `skill-${Date.now()}-${order}`,
                name: item,
                category: cat.name,
                level: 80,
                order,
                updatedAt: new Date(),
              },
            });
            order++;
          }
        }
      }

      if (key === "topics") {
        const topics = data as unknown as Topic[];
        const dbComments = await prisma.comment.findMany({
          include: { CommentReply: true },
        });

        for (const topic of topics) {
          const comment = dbComments.find(
            (c) => stringToId(c.id) === Number(topic.id),
          );
          if (comment) {
            // Update topic description/content
            await prisma.comment.update({
              where: { id: comment.id },
              data: {
                content: JSON.stringify({
                  title: topic.title,
                  description: topic.description,
                }),
                updatedAt: new Date(),
              },
            });

            // Sync replies
            for (const r of topic.replies) {
              const existingReply = comment.CommentReply.find(
                (dbR) => stringToId(dbR.id) === Number(r.id),
              );
              if (!existingReply) {
                let user = await prisma.user.findFirst({
                  where: { name: r.name },
                });
                if (!user) {
                  user = await prisma.user.create({
                    data: {
                      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                      name: r.name,
                      email: `${r.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
                      updatedAt: new Date(),
                    },
                  });
                }
                await prisma.commentReply.create({
                  data: {
                    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    content: JSON.stringify({
                      message: r.message,
                      replyTo: r.replyTo,
                    }),
                    commentId: comment.id,
                    userId: user.id,
                    updatedAt: new Date(),
                  },
                });
              }
            }
          } else {
            // Create comment
            let user = await prisma.user.findFirst({
              where: { name: topic.creator },
            });
            if (!user) {
              user = await prisma.user.create({
                data: {
                  id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  name: topic.creator,
                  email: `${topic.creator.toLowerCase().replace(/\s+/g, "")}@example.com`,
                  updatedAt: new Date(),
                },
              });
            }
            const newComment = await prisma.comment.create({
              data: {
                id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                content: JSON.stringify({
                  title: topic.title,
                  description: topic.description,
                }),
                userId: user.id,
                updatedAt: new Date(),
              },
            });

            for (const r of topic.replies) {
              let rUser = await prisma.user.findFirst({
                where: { name: r.name },
              });
              if (!rUser) {
                rUser = await prisma.user.create({
                  data: {
                    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    name: r.name,
                    email: `${r.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
                    updatedAt: new Date(),
                  },
                });
              }
              await prisma.commentReply.create({
                data: {
                  id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  content: JSON.stringify({
                    message: r.message,
                    replyTo: r.replyTo,
                  }),
                  commentId: newComment.id,
                  userId: rUser.id,
                  updatedAt: new Date(),
                },
              });
            }
          }
        }
      }

      if (key === "messages") {
        const messages = data as unknown as Message[];
        const dbComments = await prisma.comment.findMany();
        const uiMessageIds = new Set(messages.map((m) => Number(m.id)));

        for (const c of dbComments) {
          if (!uiMessageIds.has(stringToId(c.id))) {
            await prisma.comment.delete({ where: { id: c.id } });
          }
        }
      }

      await writeLocalFile(localPath, data);
      return;
    } catch (error) {
      console.error(
        `Error writing to DB for key ${key}, falling back to local file write:`,
        error,
      );
      await writeLocalFile(localPath, data);
    }
  } else {
    await writeLocalFile(localPath, data);
  }
}

async function readLocalFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (_error) {
    return defaultValue;
  }
}

async function writeLocalFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write local file ${filePath}:`, error);
  }
}
