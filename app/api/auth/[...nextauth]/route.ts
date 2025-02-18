import { authOptions } from "@/lib/authOptions";

const hander = NextAuth(authOptions);

export { hander as GET, hander as POST };