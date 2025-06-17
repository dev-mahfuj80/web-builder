import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

const f = createUploadthing();

const authenticateUser = (req: Request) => {
  const { userId } = getAuth(req as unknown as NextApiRequest);
  // If you throw, the user will not be able to upload
  if (!userId) throw new Error("Unauthorized");
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => authenticateUser(req as unknown as Request))
    .onUploadComplete(() => {}),
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => authenticateUser(req as unknown as Request))
    .onUploadComplete(() => {}),
  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => authenticateUser(req as unknown as Request))
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => authenticateUser(req as unknown as Request))
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
