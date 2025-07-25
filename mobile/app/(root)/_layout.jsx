import { Redirect, Stack } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function Layout() {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
