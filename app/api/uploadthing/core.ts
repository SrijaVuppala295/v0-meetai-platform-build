import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// Limit to reasonable types and sizes
export const ourFileRouter = {
  resumeUploader: f({
    "text/plain": { maxFileSize: "2MB" },
    "application/pdf": { maxFileSize: "8MB" },
    "application/msword": { maxFileSize: "8MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB" },
  })
    // You can attach metadata if you want (e.g., userId)
    .onUploadComplete(async ({ file }) => {
      // Optional: log or persist file info
      console.log("[v0] Upload complete:", { url: file.url, name: file.name, type: file.type })
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
