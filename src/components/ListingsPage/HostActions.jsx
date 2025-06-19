import React, { useState } from "react";
import { Plus } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import CreateListingModal from "./CreateListingModal";

const HostActions = () => {
  const { authUser } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Only show if user is logged in and is a host
  if (!authUser || !authUser.isHost) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowCreateModal(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
      >
        <Plus className="h-4 w-4" />
        <span className="font-medium">Add Listing</span>
      </button>

      {showCreateModal && (
        <CreateListingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
};

export default HostActions;
