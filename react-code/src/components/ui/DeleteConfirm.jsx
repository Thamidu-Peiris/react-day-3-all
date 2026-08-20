import Btn from "./Btn";
import Modal from "./Modal";

export default function DeleteConfirm({ name, onClose, onDelete, apiLoading }) {
  return (
    <Modal title="Delete Student" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm text-zinc-400">Are you sure you want to delete <span className="text-zinc-200 font-medium">{name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={apiLoading} loading={apiLoading} variant="danger" onClick={onDelete}>Delete Student</Btn>
        </div>
      </div>
    </Modal>
  )
}