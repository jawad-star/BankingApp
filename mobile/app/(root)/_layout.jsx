import { Redirect, Stack } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function Layout() {
  const { IsSignedIn } = useUser();
  if (!IsSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
