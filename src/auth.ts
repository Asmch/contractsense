import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/database/connection';
import { UserModel as User } from '@/database/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await connectToDatabase();
        let user = await User.findOne({ email: profile.email });
        
        if (!user) {
          user = await User.create({
            email: profile.email,
            name: profile.name,
            provider: 'GOOGLE',
            role: 'user',
          });
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();
        
        console.log("[AUTH DEBUG] Searching for email:", credentials.email);
        
        const user = await User.findOne({ 
          email: (credentials.email as string).toLowerCase(),
          provider: 'EMAIL'
        }).select('+password').lean();

        console.log("[AUTH DEBUG] User found:", !!user);
        if (!user) return null;

        console.log("[AUTH DEBUG] Password hash present:", !!user.password);
        if (!user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        console.log("[AUTH DEBUG] Passwords match:", passwordsMatch);

        if (passwordsMatch) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        }

        return null;
      },
    }),
  ],
});
