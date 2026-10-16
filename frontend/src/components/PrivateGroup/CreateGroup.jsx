import React, { useState } from 'react';
import axios from '../../utils/axios';

export default function CreateGroup({ onClose, onGroupCreated }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const trimmedName = name.trim();
        if (!trimmedName) { setError("Group name is required."); return; }
        setIsSubmitting(true);
        try {
            await axios.post('/private-group/create', { name: trimmedName, description: description.trim() });
            if (onGroupCreated) onGroupCreated();
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create group.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card-static p-8 w-full max-w-md mx-auto animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.05s" }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Create New Circle</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>A private space for your group's memories.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                        Circle Name <span style={{ color: "var(--accent-light)" }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Family Memories"
                        className="input-field"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                        Description <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="What's this circle about?"
                        className="input-field"
                        disabled={isSubmitting}
                        style={{ resize: "vertical" }}
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-xl text-sm" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn-secondary text-sm" disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary text-sm inline-flex items-center gap-2" disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? 'Creating...' : '✨ Create Circle'}
                    </button>
                </div>
            </form>
        </div>
    );
}
