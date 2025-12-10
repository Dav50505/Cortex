"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ id, title }: { id: string; title: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/research/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete paper");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error deleting paper");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete Paper"
        >
            <Trash2 className={`w-4 h-4 ${isDeleting ? "animate-pulse" : ""}`} />
        </button>
    );
}
