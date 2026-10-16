import React, { useState } from 'react';
import axios from '../../utils/axios';

// Icons
const TextIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const PhotoIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-12 1h.01M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const VideoIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55-4.55A1 1 0 0121 6v12a1 1 0 01-1.45.95L15 14M4 10a3 3 0 013-3h10a3 3 0 013 3v4a3 3 0 01-3 3H7a3 3 0 01-3-3v-4z"></path></svg>;

const TypeButton = ({ type, currentType, onClick, Icon }) => {
    const isSelected = currentType === type;
    return (
        <button
            type="button"
            onClick={() => onClick(type)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-semibold text-sm capitalize cursor-pointer border-0"
            style={{
                background: isSelected ? "linear-gradient(135deg, var(--accent), #7c3aed)" : "var(--surface-glass-strong)",
                color: isSelected ? "white" : "var(--text-secondary)",
                boxShadow: isSelected ? "0 4px 15px var(--accent-glow)" : "none",
                border: isSelected ? "none" : "1px solid var(--border-subtle)",
            }}
        >
            <Icon /> {type}
        </button>
    );
};

export default function AddStory({ privateGroupId, onClose, onStoryAdded }) {
    const [contentType, setContentType] = useState('text');
    const [text, setText] = useState('');
    const todayStr = new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD
    const [title, setTitle] = useState('');
    const [memoryDate, setMemoryDate] = useState(todayStr);
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const getFileAccept = () => {
        if (contentType === 'image') return 'image/*';
        if (contentType === 'video') return 'video/*';
        return '';
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) { setFile(selectedFile); setError(null); }
    };

    const handleModeChange = (newType) => {
        setContentType(newType); setText(''); setFile(null); setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const textContent = text.trim();
        if (contentType === 'text' && !textContent) { setError("Text content cannot be empty."); return; }
        if (contentType !== 'text' && !file) { setError(`Please select a ${contentType} file.`); return; }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('contentType', contentType);
        formData.append('text', textContent);
        if (title.trim()) formData.append('title', title.trim());
        if (memoryDate) formData.append('memoryDate', memoryDate);
        if (file) formData.append('file', file);

        try {
            await axios.post(`/private-group/${privateGroupId}/stories`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (onStoryAdded) onStoryAdded();
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post story.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card-static p-8 w-full max-w-lg mx-auto animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.05s" }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Share a Memory</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Post something for your circle to enjoy.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Content Type */}
                <div className="p-4 rounded-xl" style={{ background: "var(--surface-glass)" }}>
                    <label className="block text-xs font-bold mb-3" style={{ color: "var(--text-secondary)" }}>Content Type</label>
                    <div className="flex gap-3">
                        <TypeButton type="text" currentType={contentType} onClick={handleModeChange} Icon={TextIcon} />
                        <TypeButton type="image" currentType={contentType} onClick={handleModeChange} Icon={PhotoIcon} />
                        <TypeButton type="video" currentType={contentType} onClick={handleModeChange} Icon={VideoIcon} />
                    </div>
                </div>

                {/* Title + Memory Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Title (optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={120}
                            placeholder="e.g. Grandma's 70th birthday"
                            className="input-field"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>When did this happen?</label>
                        <input
                            type="date"
                            value={memoryDate}
                            max={todayStr}
                            onChange={(e) => setMemoryDate(e.target.value)}
                            className="input-field"
                            required
                            disabled={isSubmitting}
                            style={{ colorScheme: "dark" }}
                        />
                    </div>
                </div>

                {/* Text Area */}
                <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                        {contentType === 'text' ? "What's the story?" : 'Caption (optional)'}
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={contentType === 'text' ? 5 : 3}
                        placeholder={contentType === 'text' ? "Write your memory here..." : "Add a short description..."}
                        className="input-field"
                        required={contentType === 'text'}
                        disabled={isSubmitting}
                        style={{ resize: "vertical" }}
                    />
                </div>

                {/* File Upload */}
                {contentType !== 'text' && (
                    <div className="p-4 rounded-xl" style={{ border: "2px dashed var(--border-accent)", background: "rgba(139,92,246,0.03)" }}>
                        <label className="block text-sm font-bold mb-2 capitalize" style={{ color: "var(--accent-light)" }}>
                            Upload {contentType}
                        </label>
                        <input
                            type="file"
                            accept={getFileAccept()}
                            onChange={handleFileChange}
                            className="block w-full text-sm cursor-pointer"
                            style={{ color: "var(--text-muted)" }}
                            required={!file}
                            disabled={isSubmitting}
                        />
                        {file && (
                            <p className="mt-2 text-xs font-medium" style={{ color: "#86efac" }}>
                                ✅ Selected: {file.name}
                            </p>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-xl text-sm" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn-secondary text-sm" disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary text-sm" disabled={isSubmitting || (contentType !== 'text' && !file)}>
                        {isSubmitting ? 'Posting...' : '📸 Post Story'}
                    </button>
                </div>
            </form>
        </div>
    );
}