"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";

export interface UseAdminCrudOptions<T extends { id: number }> {
  initialItems: T[];
  apiEndpoint: string;
  resourceName: string;
  getItemDisplayName?: (item: T) => string;
}

/**
 * Reusable admin hook providing unified CRUD state, modal management,
 * optimistic updates, and deletion workflows across admin tables.
 */
export function useAdminCrud<T extends { id: number }>({
  initialItems,
  apiEndpoint,
  resourceName,
  getItemDisplayName,
}: UseAdminCrudOptions<T>) {
  const router = useRouter();
  const [prevInitialItems, setPrevInitialItems] = useState<T[]>(initialItems);
  const [items, setItems] = useState<T[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Safely synchronize state when server-rendered initialItems change without cascading renders
  if (prevInitialItems !== initialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
  }

  const openCreateModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleItemSaved = (savedItem: T, isEdit: boolean) => {
    if (isEdit) {
      setItems((prev) =>
        prev.map((item) => (item.id === savedItem.id ? { ...item, ...savedItem } : item))
      );
    } else {
      setItems((prev) => [savedItem, ...prev]);
    }
    closeModal();
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    const displayName = getItemDisplayName
      ? getItemDisplayName(deletingItem)
      : `${resourceName} #${deletingItem.id}`;

    try {
      await apiFetch<{ success: boolean }>(`${apiEndpoint}/${deletingItem.id}`, { method: "DELETE" });

      setItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
      toast.success(`تم حذف "${displayName}" بنجاح`);
      setDeletingItem(null);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, `فشل في حذف ${resourceName}، يرجى المحاولة لاحقاً`));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    items,
    setItems,
    modalOpen,
    setModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
    deletingItem,
    setDeletingItem,
    isDeleting,
    handleConfirmDelete,
    handleItemSaved,
    router,
  };
}
