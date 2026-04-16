import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MealDetailClient } from "./MealDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function MealDetailPage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/auth");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  const { id } = await params;

  return <MealDetailClient mealId={id} userId={user.id} />;
}
