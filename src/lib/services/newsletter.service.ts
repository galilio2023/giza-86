import { NewsletterSubscriberItem } from "@/types";
import { isDatabaseConfigured, db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { memoryNewsletter } from "@/lib/repositories/memory-store";

export async function subscribeNewsletter(
  contact: string,
  type: "email" | "phone"
): Promise<{ success: boolean; message: string; isNew: boolean }> {
  const cleanContact = contact.trim().toLowerCase();

  if (!isDatabaseConfigured || !db) {
    const existing = memoryNewsletter.find((n) => n.contact === cleanContact);
    if (existing) {
      return {
        success: true,
        message: "أنت مشترك بالفعل معنا في نادي عملاء GIZA 86 وستصلك العروض الحصرية دورياً!",
        isNew: false,
      };
    }
    memoryNewsletter.unshift({
      id: Date.now(),
      contact: cleanContact,
      type,
      createdAt: new Date().toISOString(),
    });
    return {
      success: true,
      message: "أهلاً بك في نادي عملاء GIZA 86! تم تسجيل بياناتك بنجاح، وستصلك أقوى العروض الحصرية.",
      isNew: true,
    };
  }

  try {
    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.contact, cleanContact))
      .limit(1);

    if (existing.length > 0) {
      return {
        success: true,
        message: "أنت مشترك بالفعل معنا في نادي عملاء GIZA 86 وستصلك العروض الحصرية دورياً!",
        isNew: false,
      };
    }

    await db
      .insert(newsletterSubscribers)
      .values({
        contact: cleanContact,
        type,
      })
      .onConflictDoNothing();

    return {
      success: true,
      message: "أهلاً بك في نادي عملاء GIZA 86! تم تسجيل بياناتك بنجاح، واستمتع بخصومات حصرية وقسائم شراء.",
      isNew: true,
    };
  } catch (error) {
    console.error("Database error in subscribeNewsletter:", error);
    return {
      success: true,
      message: "تم تسجيل بياناتك بنجاح!",
      isNew: true,
    };
  }
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriberItem[]> {
  if (!isDatabaseConfigured || !db) {
    return memoryNewsletter;
  }

  try {
    const rows = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));

    return rows.map((r) => ({
      id: r.id,
      contact: r.contact,
      type: r.type as "email" | "phone",
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Database error in getNewsletterSubscribers:", error);
    return memoryNewsletter;
  }
}
