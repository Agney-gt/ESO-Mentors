import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
//import { BlobServiceClient } from "@azure/storage-blob";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use Service Role for admin access
);

// Azure Storage Configuration
//const EXISTING_CONTAINER_NAME = "ESO-mentors"; // Change this to your actual container name

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
    
         return null;
        }


        const { data: userRecord } = await supabase
          .from("ESO")
          .select("user_id, username, password_hash")
          .eq("username", credentials.username)
          .single();

        if (!userRecord) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userRecord.password_hash
        );

        if (!passwordMatch) return null;

        return {
          id: userRecord.user_id,
          email: userRecord.user_id,
          name: userRecord.username || "Manual User",
        };
      },
    }),
  ],

   
  callbacks: {
    async signIn({ user }) {
      if (user && user.email) {
        try {
          // 🔹 Initialize mindmap usage record for new users
          const { data: existingUsage } = await supabase
            .from("ESO")
            .select("user_id")
            .eq("user_id", user.email)
            .single();

          if (!existingUsage) {
            const { error: insertError } = await supabase
              .from("ESO")
              .insert([{ user_id: user.email }, {username: user.email.split("@")[0]}]); // Use email prefix as username
            if (insertError) throw insertError;
            console.log(`✅ New record created: ${user.email}`);
          } else {
            console.log(`ℹ️ User already has record: ${user.email}`);
          }

          // 🔹 Step 2: Create Folder in Azure Container
        //   try {
        //     const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        //     if (!AZURE_STORAGE_CONNECTION_STRING) {
        //       console.error("🔥 Azure Storage Connection String is not configured");
        //       return true; // Allow sign in but skip Azure setup
        //     }

        //     const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        //     const containerClient = blobServiceClient.getContainerClient(EXISTING_CONTAINER_NAME);

        //     // Ensure container exists
        //     await containerClient.createIfNotExists();
        //     console.log(`✅ Container ${EXISTING_CONTAINER_NAME} exists or was created`);

        //     const folderName = `user-${user.email.split("@")[0]}/`; // Append '/' to represent a folder
        //     const folderBlobClient = containerClient.getBlockBlobClient(folderName);

        //     // Check if folder (dummy blob) already exists
        //     const exists = await folderBlobClient.exists();
        //     if (!exists) {
        //       await folderBlobClient.upload("", 0); // Empty blob to create folder
        //       console.log(`✅ Created folder: ${folderName} in ${EXISTING_CONTAINER_NAME}`);
        //     } else {
        //       console.log(`ℹ️ Folder already exists: ${folderName}`);
        //     }
        //   } catch (azureError) {
        //     console.error("🔥 Azure storage error:", azureError);
        //     throw azureError; // Propagate to main error handler
        //   }
        } catch (error) {
          console.error("🔥 Error in sign-in process:", error);
          return false; // Fail sign-in if something goes wrong
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub || "", // ✅ Ensure 'id' is always set
          },
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for production
};
