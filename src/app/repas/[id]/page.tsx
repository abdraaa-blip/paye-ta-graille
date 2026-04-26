import { redirect } from "next/navigation";
import { PTG_AUTH_PATH } from "@/lib/auth/auth-path";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MealDetailClient } from "./MealDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function MealDetailPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(PTG_AUTH_PATH);
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(PTG_AUTH_PATH);
  }

  const { id } = await params;

  return <MealDetailClient mealId={id} userId={user.id} />;
}
